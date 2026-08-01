import { createNotification } from "@/lib/api";

export async function notifyOrderPlaced(prisma, buyerId, orderId) {
  await createNotification(prisma, buyerId, {
    title: "Order Placed",
    message: `Your order #${orderId} has been placed successfully.`,
    type: "ORDER",
    link: `/buyer/orders/${orderId}`,
  });
}

export async function notifyOrderStatus(prisma, buyerId, orderId, status) {
  await createNotification(prisma, buyerId, {
    title: "Order Update",
    message: `Order #${orderId} is now ${status}.`,
    type: "ORDER",
    link: `/buyer/orders/${orderId}`,
  });
}

export async function notifySellerNewOrder(prisma, sellerId, orderId) {
  await createNotification(prisma, sellerId, {
    title: "New Order",
    message: `You received items in order #${orderId}.`,
    type: "ORDER",
    link: `/seller/orders`,
  });
}
