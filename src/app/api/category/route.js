import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Get Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Verify Token
    const user = verifyToken(token);

    if (!user) {
      return Response.json(
        {
          message: "Invalid Token",
        },
        {
          status: 401,
        }
      );
    }

    // Only Admin
    if (user.role !== "ADMIN") {
      return Response.json(
        {
          message: "Only Admin can create categories",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return Response.json(
        {
          message: "Category name is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return Response.json(
        {
          message: "Category already exists",
        },
        {
          status: 400,
        }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return Response.json(
      {
        message: "Category created successfully",
        category,
      },
      {
        status: 201,
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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
  include: {
    products: true,
  },

  orderBy: {
    name: "asc",
  },
});

    return Response.json(
      {
        categories,
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