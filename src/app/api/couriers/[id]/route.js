import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ==============================
// GET SINGLE COURIER
// ==============================

export async function GET(request, { params }) {
  try {
    const courier = await prisma.courier.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!courier) {
      return Response.json(
        {
          message: "Courier not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        courier,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// UPDATE COURIER
// ==============================

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        {
          message: "Only Admin can update couriers",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      basePrice,
      estimatedDays,
      isActive,
    } = body;

    const courier = await prisma.courier.update({
      where: {
        id: Number(params.id),
      },
      data: {
        name,
        description,
        basePrice: Number(basePrice),
        estimatedDays: Number(estimatedDays),
        isActive,
      },
    });

    return Response.json(
      {
        message: "Courier updated successfully",
        courier,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ==============================
// DELETE COURIER (SOFT DELETE)
// ==============================

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        {
          message: "Only Admin can delete couriers",
        },
        {
          status: 403,
        }
      );
    }

    const courier = await prisma.courier.update({
      where: {
        id: Number(params.id),
      },
      data: {
        isActive: false,
      },
    });

    return Response.json(
      {
        message: "Courier deleted successfully",
        courier,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}