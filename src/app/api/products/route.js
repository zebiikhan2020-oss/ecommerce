import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
    };

    // Search by product title
    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Filter by category
    if (category) {
      where.categoryId = Number(category);
    }

    const totalProducts = await prisma.product.count({
      where,
    });

    const products = await prisma.product.findMany({
      where,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return Response.json(
      {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        products,
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