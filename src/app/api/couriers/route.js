import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const couriers = await prisma.courier.findMany({
      where: { isActive: true },
      orderBy: { basePrice: "asc" },
    });

    return Response.json({ couriers }, { status: 200 });
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
    if (!user || user.role !== "ADMIN") {
      return Response.json(
        { message: "Only Admin can add couriers" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, basePrice, estimatedDays } = body;

    if (!name) {
      return Response.json(
        { message: "name is required" },
        { status: 400 }
      );
    }

    const courier = await prisma.courier.create({
      data: {
        name,
        description,
        basePrice: Number(basePrice) || 0,
        estimatedDays: Number(estimatedDays) || 3,
      },
    });

    return Response.json(
      { message: "Courier added successfully", courier },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

