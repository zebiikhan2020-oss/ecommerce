import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can buy products" },
        { status: 403 }
      );
    }

    const { productId, quantity } = await request.json();

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return Response.json(
        { message: "Product is inactive" },
        { status: 400 }
      );
    }

    if (product.stock < Number(quantity || 1)) {
      return Response.json(
        { message: "Not enough stock available" },
        { status: 400 }
      );
    }

    return Response.json(
      {
        message: "Buy Now Ready",
        productId: product.id,
        quantity: Number(quantity || 1),
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    return Response.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }
}