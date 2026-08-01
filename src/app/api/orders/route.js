import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ===============================
// CREATE ORDER (CHECKOUT)
// ===============================

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can place orders" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      addressId,
      paymentMethodId,
      courierId,
      manualAddress,
      manualPayment,
      selectedItemIds, // <-- Array of cart item IDs (agar buyer sirf selected items checkout karna chahe)
    } = body;

    // ===============================
    // GET CART
    let cart = await prisma.cart.findUnique({
      where: {
        buyerId: user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return Response.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Agar user ne specific items select kiye hain, toh sirf unhein filter karein
    let itemsToCheckout = cart.items;
    if (selectedItemIds && Array.isArray(selectedItemIds) && selectedItemIds.length > 0) {
      itemsToCheckout = cart.items.filter((item) =>
        selectedItemIds.includes(item.id)
      );
    }

    if (itemsToCheckout.length === 0) {
      return Response.json(
        { message: "No items selected for checkout" },
        { status: 400 }
      );
    }

    // ===============================
    // CHECK STOCK
    for (const item of itemsToCheckout) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product || product.stock < item.quantity) {
        return Response.json(
          {
            message: `Insufficient stock for product: ${
              product?.title || "Unknown"
            }`,
          },
          { status: 400 }
        );
      }
    }

    // ===============================
    // COURIER
    let courier = null;
    let shippingCost = 0;

    if (courierId) {
      courier = await prisma.courier.findUnique({
        where: {
          id: Number(courierId),
        },
      });

      if (courier) {
        shippingCost = courier.basePrice;
      }
    }

    let subtotal = 0;
    itemsToCheckout.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });

    const totalPrice = subtotal + shippingCost;
    const adminCommission = subtotal * 0.10;
    const sellerAmount = subtotal - adminCommission;

    // ===============================
    // CREATE ORDER TRANSACTION
    const order = await prisma.$transaction(async (tx) => {
      // 1. ADDRESS RESOLUTION & SAVING
      let addressData = null;

      if (manualAddress) {
        const createdAddress = await tx.address.create({
          data: {
            userId: user.id,
            fullName: manualAddress.fullName,
            phone: manualAddress.phone,
            street: manualAddress.street,
            city: manualAddress.city,
            state: manualAddress.state,
            zipCode: manualAddress.zipCode,
            country: manualAddress.country,
          },
        });
        addressData = createdAddress;
      } else {
        if (!addressId) {
          throw new Error("Address is required");
        }

        const existingAddress = await tx.address.findFirst({
          where: {
            id: Number(addressId),
            userId: user.id,
          },
        });

        if (!existingAddress) {
          throw new Error("Address not found");
        }
        addressData = existingAddress;
      }

      // 2. PAYMENT METHOD RESOLUTION & SAVING
      let paymentData = null;

      if (manualPayment) {
        const createdPayment = await tx.paymentMethod.create({
          data: {
            userId: user.id,
            type: manualPayment.type,
            label: manualPayment.label,
          },
        });
        paymentData = createdPayment;
      } else {
        if (!paymentMethodId) {
          throw new Error("Payment method is required");
        }

        const existingPayment = await tx.paymentMethod.findFirst({
          where: {
            id: Number(paymentMethodId),
            userId: user.id,
          },
        });

        if (!existingPayment) {
          throw new Error("Payment method not found");
        }
        paymentData = existingPayment;
      }

      // 3. CREATE ORDER (with addressId link)
      const newOrder = await tx.order.create({
        data: {
          buyerId: user.id,
          addressId: addressData.id, // <-- Yahan addressId link ho gayi hai
          subtotal,
          shippingCost,
          totalPrice,
          adminCommission,
          sellerAmount,
          courierId: courier ? courier.id : null,

          paymentType: paymentData.type,
          paymentLabel: paymentData.label,

          shippingName: addressData.fullName,
          shippingPhone: addressData.phone,
          shippingStreet: addressData.street,
          shippingCity: addressData.city,
          shippingState: addressData.state,
          shippingZip: addressData.zipCode,
          shippingCountry: addressData.country,

          items: {
            create: itemsToCheckout.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 4. BUYER NOTIFICATION
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Order Placed",
          message: `Your order #${newOrder.id} has been placed successfully.`,
          type: "ORDER",
          link: "/buyer/orders",
        },
      });

      // 6. SELLER NOTIFICATIONS
      for (const item of itemsToCheckout) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { seller: true },
        });

        if (product?.seller) {
          // If seller is ADMIN, send notification with admin orders link
          if (product.seller.role === "ADMIN") {
            await tx.notification.create({
              data: {
                userId: product.seller.id,
                title: "New Order",
                message: `${item.quantity} × ${product.title} has been ordered.`,
                type: "ORDER",
                link: "/admin/orders",
              },
            });
          } else {
            // Regular seller notification
            await tx.notification.create({
              data: {
                userId: product.seller.id,
                title: "New Order",
                message: `${item.quantity} × ${product.title} has been ordered.`,
                type: "ORDER",
                link: "/seller/orders",
              },
            });
          }
        }
      }

      // 7. UPDATE PRODUCT STOCK
      for (const item of itemsToCheckout) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 8. CLEAR CHECKED-OUT ITEMS FROM CART
      const itemIdsToRemove = itemsToCheckout.map((item) => item.id);
      await tx.cartItem.deleteMany({
        where: {
          id: { in: itemIdsToRemove },
        },
      });

      return newOrder;
    });

    return Response.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

// ===============================
// GET BUYER ORDERS
// ===============================

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user || user.role !== "BUYER") {
      return Response.json({ message: "Only Buyer can view orders" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
          },
        },
        courier: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(
      { totalOrders: orders.length, orders },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

// ===============================
// CANCEL ORDER (BUYER)
// ===============================

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user || user.role !== "BUYER") {
      return Response.json({ message: "Only Buyer can cancel orders" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return Response.json({ message: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });

    if (!order || order.buyerId !== user.id) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return Response.json(
        { message: "Only pending orders can be cancelled" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Order Cancelled",
          message: `Your order #${order.id} has been cancelled successfully.`,
          type: "ORDER",
          link: "/buyer/orders",
        },
      });
    });

    return Response.json(
      { message: "Order cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}