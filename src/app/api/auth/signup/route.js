import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "@/lib/mail";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return Response.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Token valid for 24 hours
    const verifyTokenExp = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "BUYER",
        verifyToken,
        verifyTokenExp,
      },
    });

    // Verification Link
    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verifyToken}`;

    console.log("Verify Link:", verifyLink);

    // Send Verification Email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Welcome to our E-Commerce Website</h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>Thank you for creating your account.</p>

          <p>Please click the button below to verify your email.</p>

          <a href="${verifyLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
            ">
            Verify Email
          </a>

          <p style="margin-top:20px;">
            If the button doesn't work, copy this link:
          </p>

          <p>${verifyLink}</p>

          <p>This link expires in 24 hours.</p>

          <hr>

          <p>If you didn't create this account, ignore this email.</p>
        </div>
      `,
    });

    console.log("Verification email sent successfully.");
    console.log("Message ID:", info.messageId);

    return Response.json(
      {
        message: "Account created successfully. Please verify your email.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Signup Error:", error);

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