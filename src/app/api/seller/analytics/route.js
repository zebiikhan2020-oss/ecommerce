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
    
    if (!user || user.role !== "SELLER") {
      return Response.json(
        { message: "Only Seller can access analytics" },
        { status: 403 }
      );
    }

    // Get seller's products
    const products = await prisma.product.findMany({
      where: { sellerId: user.id },
      select: { id: true },
    });

    const productIds = products.map((p) => p.id);

    // Get orders containing seller's products
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: productIds } },
      include: {
        order: true,
        product: true,
      },
    });

    // Calculate analytics
    const totalOrders = new Set(orderItems.map((item) => item.orderId)).size;
    const totalRevenue = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalCommission = orderItems.reduce(
  (sum, item) => sum + (item.adminCommission || (item.price * item.quantity * 0.10)),
  0
);
    const totalProductsSold = orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId: { in: productIds },
          },
        },
      },
      include: {
        items: {
          where: { productId: { in: productIds } },
          include: { product: true },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get product performance
    const productPerformance = await prisma.product.findMany({
      where: { sellerId: user.id },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const performanceData = productPerformance.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      totalSold: product._count.orderItems,
      revenue: product._count.orderItems * product.price,
    }));

   return Response.json(
  {
    totalProducts: products.length,
    totalOrders,
    totalRevenue,
    totalEarnings: totalRevenue - totalCommission,
    totalCommission,
    totalProductsSold,
    recentOrders,
    productPerformance: performanceData,
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
