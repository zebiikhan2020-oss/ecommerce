import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can access addresses" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const addressId = Number(resolvedParams.id);

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    });

    if (!address) {
      return Response.json({ message: "Address not found" }, { status: 404 });
    }

    return Response.json({ address }, { status: 200 });
  } catch (error) {
    console.error("GET Address Error:", error);
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can update addresses" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const addressId = Number(resolvedParams.id);

    const body = await request.json();
    const {
      label,
      fullName,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = body;

    // Address ke sath uske orders bhi fetch kar rahe hain
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
      include: { orders: true },
    });

    if (!existing) {
      return Response.json({ message: "Address not found" }, { status: 404 });
    }

    // --- REQUIREMENT CHECK: Agar koi order SHIPPED ya DELIVERED hai toh edit block kar do ---
    const hasShippedOrDeliveredOrder = existing.orders.some(
      (order) => order.status === "SHIPPED" || order.status === "DELIVERED"
    );

    if (hasShippedOrDeliveredOrder) {
      return Response.json(
        { message: "Cannot edit address because an order using this address has already been shipped or delivered." },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        label: label ?? existing.label,
        fullName: fullName ?? existing.fullName,
        phone: phone ? String(phone) : existing.phone,
        street: street ?? existing.street,
        city: city ?? existing.city,
        state: state !== undefined ? (state ? String(state) : null) : existing.state,
        zipCode: zipCode ? String(zipCode) : existing.zipCode,
        country: country ?? existing.country,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : existing.isDefault,
      },
    });

    return Response.json(
      { message: "Address updated successfully", address: updatedAddress },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Address Error:", error);
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can delete addresses" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const addressId = Number(resolvedParams.id);

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
      include: { orders: true },
    });

    if (!existing) {
      return Response.json({ message: "Address not found" }, { status: 404 });
    }

    // --- REQUIREMENT CHECK: Shipped/Delivered order par delete bhi block hoga ---
    const hasShippedOrDeliveredOrder = existing.orders.some(
      (order) => order.status === "SHIPPED" || order.status === "DELIVERED"
    );

    if (hasShippedOrDeliveredOrder) {
      return Response.json(
        { message: "Cannot delete address because an order using this address has already been shipped or delivered." },
        { status: 400 }
      );
    }

    await prisma.address.delete({ where: { id: addressId } });

    if (existing.isDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });
      if (next) {
        await prisma.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return Response.json({ message: "Address deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Address Error:", error);
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}