import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ===============================
// GET SINGLE ORDER (ADMIN)
// ===============================

export async function GET(request, context) {
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
          message: "Only Admin can view order details",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await context.params;

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                price: true,
              },
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

    return Response.json(
      {
        order,
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

// ===============================
// UPDATE ORDER STATUS (ADMIN)
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

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        {
          message: "Only Admin can update orders",
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
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(status)) {
      return Response.json(
        {
          message: "Invalid status",
        },
        {
          status: 400,
        }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
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
    // STATUS FLOW VALIDATION
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

    // 2. Status hierarchy map (define levels to restrict backward movement)
    const statusHierarchy = {
      PENDING: 1,
      CONFIRMED: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0, // Special case handled separately if needed
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
        id: Number(id),
      },
      data: {
        status,
      },
    });

    // ===============================
    // BUYER NOTIFICATION
    // ===============================

    let notificationMessage = "";

    if (status === "CONFIRMED") {
      notificationMessage = `Your order #${updatedOrder.id} has been confirmed.`;
    } else if (status === "SHIPPED") {
      notificationMessage = `Your order #${updatedOrder.id} has been shipped.`;
    } else if (status === "DELIVERED") {
      notificationMessage = `Your order #${updatedOrder.id} has been delivered.`;
    } else if (status === "CANCELLED") {
      notificationMessage = `Your order #${updatedOrder.id} has been cancelled.`;
    }

    if (notificationMessage) {
      await prisma.notification.create({
        data: {
          userId: updatedOrder.buyerId,
          title: "Order Update",
          message: notificationMessage,
          type: "ORDER",
          link: "/buyer/orders",
        },
      });
    }

    return Response.json(
      {
        message: "Order status updated successfully",
        order: updatedOrder,
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