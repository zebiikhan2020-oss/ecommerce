import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {

  try {

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

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") {

      return Response.json(
        {
          message: "Only Admin can access dashboard",
        },
        {
          status: 403,
        }
      );

    }

    const totalUsers = await prisma.user.count();

    const totalBuyers = await prisma.user.count({
      where: {
        role: "BUYER",
      },
    });

    const totalSellers = await prisma.user.count({
      where: {
        role: "SELLER",
      },
    });

    const totalProducts = await prisma.product.count();

    const totalOrders = await prisma.order.count();

    return Response.json(
      {
        totalUsers,
        totalBuyers,
        totalSellers,
        totalProducts,
        totalOrders,
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