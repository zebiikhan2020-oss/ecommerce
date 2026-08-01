import { prisma } from "@/lib/prisma";


console.log(prisma);
console.log(prisma.address);
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
        { message: "Only Buyer can access addresses" },
        { status: 403 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" },
    });

    return Response.json({ addresses }, { status: 200 });
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
        { message: "Only Buyer can add addresses" },
        { status: 403 }
      );
    }

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

    if (!fullName || !phone || !street || !city || !zipCode) {
      return Response.json(
        { message: "fullName, phone, street, city, zipCode are required" },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        label: label || "Home",
        fullName,
        phone: String(phone),
        street,
        city,
        state: state || null,
        zipCode: String(zipCode),
        country: country || "Pakistan",
        isDefault: Boolean(isDefault),
      },
    });

    return Response.json(
      { message: "Address added successfully", address },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}


