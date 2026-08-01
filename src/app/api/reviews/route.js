import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId: Number(productId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return Response.json(
      { reviews, avgRating, totalReviews: reviews.length },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can add reviews" },
        { status: 403 }
      );
    }

    const { productId, orderId, rating, comment } = await request.json();

    if (!productId || !rating) {
      return Response.json(
        { message: "productId and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
      select: { id: true, title: true, sellerId: true },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if order exists and belongs to user (if orderId provided)
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: Number(orderId),
          buyerId: user.id,
        },
      });

      if (!order) {
        return Response.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId: Number(productId),
      },
    });

    if (existing) {
      return Response.json(
        { message: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: Number(productId),
        orderId: orderId ? Number(orderId) : null,
        rating: Number(rating),
        comment: comment || null,
      },
    });

    // 🔔 Notification Send Logic for Product Owner (Seller or Admin)
    const recipientId = product.sellerId;

    if (recipientId) {
      try {
        await prisma.notification.create({
          data: {
            userId: recipientId,
            title: "New Product Review 🌟",
            message: `You received a ${rating}-star review on your product "${product.title || 'Product'}".`,
            type: "REVIEW",
            link: `/products/${product.id}`,
          },
        });
      } catch (notifError) {
        console.log("Failed to send notification:", notifError);
      }
    }

    return Response.json(
      { message: "Review added successfully", review },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}