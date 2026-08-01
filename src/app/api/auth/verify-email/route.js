import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        { message: "Invalid verification link." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return Response.json(
        { message: "Verification link has expired or is invalid." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExp: null,
      },
    });

    return Response.json(
      {
        message: "Email verified successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong.",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}