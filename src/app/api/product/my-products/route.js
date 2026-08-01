import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
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
     console.log(user);
    // Only Seller
    if (user.role !== "SELLER") {
      return Response.json(
        {
          message: "Only Seller can access this route",
        },
        {
          status: 403,
        }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        sellerId: Number  (user.id),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(
      {
        totalProducts: products.length,
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