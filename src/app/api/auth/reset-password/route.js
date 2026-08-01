import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        {
          message: "Token and Password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Optional: token normalize (agar URL se aaye)
    const resetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { resetToken: token },
          { resetToken: resetToken },
        ],
        resetTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return Response.json(
        {
          message: "Invalid or expired reset link",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return Response.json(
      {
        message: "Password reset successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

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