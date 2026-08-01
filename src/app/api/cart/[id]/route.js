import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ===============================
// UPDATE CART ITEM QUANTITY
// ===============================
export async function PUT(request, context) {
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
        { message: "Only Buyer can update cart" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return Response.json(
        { message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        buyerId: user.id,
      },
    });

    if (!cart) {
      return Response.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(id),
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return Response.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: Number(quantity),
      },
    });

    return Response.json({
      message: "Cart updated successfully",
      item: updatedItem,
    });

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

// ===============================
// REMOVE ITEM FROM CART
// ===============================
export async function DELETE(request, context) {
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
        { message: "Only Buyer can remove cart items" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const cart = await prisma.cart.findUnique({
      where: {
        buyerId: user.id,
      },
    });

    if (!cart) {
      return Response.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(id),
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return Response.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return Response.json({
      message: "Product removed from cart successfully",
    });

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