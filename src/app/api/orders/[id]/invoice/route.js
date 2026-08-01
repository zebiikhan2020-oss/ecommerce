import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = context.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, title: true, image: true },
            },
          },
        },
        courier: true,
      },
    });

    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if user is the buyer or admin
    if (user.role !== "ADMIN" && order.buyerId !== user.id) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    // Generate HTML invoice
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 32px; font-weight: bold; color: #2563eb; }
    .invoice-info { text-align: right; }
    .invoice-info h2 { margin: 0; color: #1e40af; }
    .section { margin-bottom: 30px; }
    .section h3 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
    .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">iShop</div>
    <div class="invoice-info">
      <h2>INVOICE</h2>
      <p>Invoice #${order.id}</p>
      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
    </div>
  </div>

  <div class="section">
    <h3>Bill To</h3>
    <p><strong>${order.buyer.name}</strong></p>
    <p>${order.buyer.email}</p>
  </div>

  <div class="section">
    <h3>Shipping Address</h3>
    <p><strong>${order.shippingName}</strong></p>
    <p>${order.shippingPhone}</p>
    <p>${order.shippingStreet}</p>
    <p>${order.shippingCity}, ${order.shippingState} ${order.shippingZip}</p>
    <p>${order.shippingCountry}</p>
  </div>

  <div class="section">
    <h3>Order Items</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
          <tr>
            <td>${item.product.title}</td>
            <td>Rs. ${item.price}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.price * item.quantity}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>Payment Details</h3>
    <p><strong>Payment Method:</strong> ${order.paymentLabel} (${order.paymentType})</p>
    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
    ${order.courier ? `<p><strong>Courier:</strong> ${order.courier.name}</p>` : ''}
  </div>

  <div class="total">
    <p>Subtotal: Rs. ${order.subtotal}</p>
    <p>Shipping: Rs. ${order.shippingCost}</p>
    <p style="font-size: 24px; color: #2563eb;">Total: Rs. ${order.totalPrice}</p>
  </div>

  <div class="footer">
    <p>Thank you for your order!</p>
    <p>For questions, contact support@ishop.com</p>
  </div>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="invoice-${order.id}.html"`,
      },
    });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
