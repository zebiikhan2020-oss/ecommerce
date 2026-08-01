import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can access wishlist" },
        { status: 403 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ wishlist }, { status: 200 });
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
        { message: "Only Buyer can add to wishlist" },
        { status: 403 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: user.id,
        productId: Number(productId),
      },
    });

    if (existing) {
      return Response.json(
        { message: "Product already in wishlist" },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: Number(productId),
      },
    });

    return Response.json(
      { message: "Added to wishlist", wishlistItem },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can remove from wishlist" },
        { status: 403 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: user.id,
        productId: Number(productId),
      },
    });

    if (!existing) {
      return Response.json(
        { message: "Wishlist item not found" },
        { status: 404 }
      );
    }

    await prisma.wishlist.delete({
      where: { id: existing.id },
    });

    return Response.json(
      { message: "Removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
