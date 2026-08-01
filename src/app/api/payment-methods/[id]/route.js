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
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can access payment methods" },
        { status: 403 }
      );
    }

    const { id } = context.params;

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!paymentMethod) {
      return Response.json(
        { message: "Payment method not found" },
        { status: 404 }
      );
    }

    return Response.json({ paymentMethod }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can update payment methods" },
        { status: 403 }
      );
    }

    const { id } = context.params;
    const body = await request.json();
    const { type, label, last4, isDefault } = body;

    const existing = await prisma.paymentMethod.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!existing) {
      return Response.json(
        { message: "Payment method not found" },
        { status: 404 }
      );
    }

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: existing.id },
      data: {
        type: type ?? existing.type,
        label: label ?? existing.label,
        last4: last4 !== undefined ? (last4 ? String(last4) : null) : existing.last4,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : existing.isDefault,
      },
    });

    return Response.json(
      { message: "Payment method updated successfully", paymentMethod },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can delete payment methods" },
        { status: 403 }
      );
    }

    const { id } = context.params;

    const existing = await prisma.paymentMethod.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!existing) {
      return Response.json(
        { message: "Payment method not found" },
        { status: 404 }
      );
    }

    await prisma.paymentMethod.delete({ where: { id: existing.id } });

    // Optional: if deleted default, set another as default
    if (existing.isDefault) {
      const next = await prisma.paymentMethod.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });
      if (next) {
        await prisma.paymentMethod.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return Response.json(
      { message: "Payment method deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

