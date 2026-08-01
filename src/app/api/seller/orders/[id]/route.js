import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ===============================
// UPDATE ORDER STATUS (SELLER)
// ===============================

export async function PUT(request, context) {
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

    if (!user || user.role !== "SELLER") {
      return Response.json(
        {
          message: "Only Seller can update order",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    const allowedStatus = [
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(status)) {
      return Response.json(
        {
          message: "Invalid order status",
        },
        {
          status: 400,
        }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: Number(id),
        items: {
          some: {
            product: {
              sellerId: user.id,
            },
          },
        },
      },
    });

    if (!order) {
      return Response.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    // ===============================
    // STATUS FLOW VALIDATION (SELLER)
    // ===============================

    // 1. Agar order pehle hi DELIVERED ya CANCELLED hai, toh mazeed change nahi ho sakta
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      return Response.json(
        {
          message: `Cannot update status. Order is already ${order.status.toLowerCase()}`,
        },
        {
          status: 400,
        }
      );
    }

    // 2. Status hierarchy map
    const statusHierarchy = {
      PENDING: 1,
      CONFIRMED: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
    };

    // Agar naya status CANCELLED nahi hai, toh check karo ke level aage ja raha hai ya nahi
    if (status !== "CANCELLED") {
      const currentLevel = statusHierarchy[order.status] || 0;
      const newLevel = statusHierarchy[status] || 0;

      if (newLevel <= currentLevel) {
        return Response.json(
          {
            message: `Cannot revert order status from ${order.status} to ${status}`,
          },
          {
            status: 400,
          }
        );
      }
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status,
      },
    });

    // ===============================
// ADMIN COMMISSION NOTIFICATION
// ===============================

if (status === "DELIVERED") {
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (admin) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: "Commission Earned",
        message: `Order #${updatedOrder.id} has been delivered. You earned Rs. ${updatedOrder.adminCommission.toFixed(
          2
        )} (10% commission).`,
        type: "COMMISSION",
        link: "/admin/orders",
      },
    });
  }
}

    return Response.json({
      message: "Order status updated successfully",
      order: updatedOrder,
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