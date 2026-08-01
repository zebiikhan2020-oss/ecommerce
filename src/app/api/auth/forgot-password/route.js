import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { transporter } from "@/lib/mail";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security: Email exist kare ya na kare, same response do
    if (!user) {
      return Response.json(
        {
          message:
            "If an account exists with this email, a reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Random Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 1 hour expiry
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return Response.json(
      {
        message: "Password reset link sent successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}