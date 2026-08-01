import { prisma } from "@/lib/prisma";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!product) {
      return Response.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        product,
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