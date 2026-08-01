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
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can access payment methods" },
        { status: 403 }
      );
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    });

    return Response.json({ paymentMethods }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can add payment methods" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, label, last4, isDefault } = body;

    if (!type || !label) {
      return Response.json(
        { message: "type and label are required" },
        { status: 400 }
      );
    }

    // If isDefault is being set, unset other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        type,
        label,
        last4: last4 ? String(last4) : null,
        isDefault: Boolean(isDefault),
      },
    });

    return Response.json(
      { message: "Payment method added successfully", paymentMethod },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}


