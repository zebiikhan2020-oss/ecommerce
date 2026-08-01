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
    if (!user || user.role !== "ADMIN") {
      return Response.json(
        { message: "Only Admin can access analytics" },
        { status: 403 }
      );
    }

    // Get total users by role
    const totalUsers = await prisma.user.count();
    const totalBuyers = await prisma.user.count({ where: { role: "BUYER" } });
    const totalSellers = await prisma.user.count({ where: { role: "SELLER" } });
    const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

    // Get total products
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({ where: { isActive: true } });

    // Get total orders and revenue
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany({
      select: { totalPrice: true, status: true, adminCommission: true,
    sellerAmount: true, },
    });

    const deliveredRevenueOrders = orders.filter(
  (order) => order.status === "DELIVERED"
);

   const totalRevenue = deliveredRevenueOrders.reduce(
  (sum, order) => sum + order.totalPrice,
  0
);

const totalCommission = deliveredRevenueOrders.reduce(
  (sum, order) => sum + (order.adminCommission || 0),
  0
);

const totalSellerAmount = deliveredRevenueOrders.reduce(
  (sum, order) => sum + (order.sellerAmount || 0),
  0
);
    // Orders by status
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED").length;
    const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
    const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, title: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get top sellers by revenue
    const sellers = await prisma.user.findMany({
      where: { role: "SELLER" },
      include: {
        products: {
          include: {
            orderItems: {
              include: {
                order: true,
              },
            },
          },
        },
      },
    });

    const sellerRevenue = sellers
      .map((seller) => {
       const revenue = seller.products.reduce((sum, product) => {
  return (
    sum +
    product.orderItems.reduce((itemSum, item) => {

      if (item.order.status !== "DELIVERED") {
        return itemSum;
      }

      return itemSum + item.price * item.quantity;

    }, 0)
  );
}, 0);
        return {
          id: seller.id,
          name: seller.name,
          email: seller.email,
          revenue,
          totalProducts: seller.products.length,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    
    // Get top products
const topProducts = await prisma.product.findMany({
  include: {
    seller: {
      select: {
        id: true,
        name: true,
      },
    },

    orderItems: {
      include: {
        order: true,
      },
    },
  },
});

    const topProductData = topProducts
  .map((product) => {

    const deliveredItems = product.orderItems.filter(
      (item) => item.order.status === "DELIVERED"
    );

    const totalSold = deliveredItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      totalSold,
      seller: product.seller.name,
    };

  })
  .sort((a, b) => b.totalSold - a.totalSold)
  .slice(0, 10);

    return Response.json(
      {
        users: {
          total: totalUsers,
          buyers: totalBuyers,
          sellers: totalSellers,
          admins: totalAdmins,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
        },
        orders: {
          total: totalOrders,
          totalRevenue,
          totalCommission,
          totalSellerAmount,
          byStatus: {
            pending: pendingOrders,
            confirmed: confirmedOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
          },
        },
        recentOrders,
        topSellers: sellerRevenue,
        topProducts: topProductData,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
