import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ loggedIn: false }, { status: 200 });
    }

    const user = verifyToken(token);

    if (!user) {
      return Response.json({ loggedIn: false }, { status: 200 });
    }

    return Response.json(
      {
        loggedIn: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch {
    return Response.json({ loggedIn: false }, { status: 200 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, password, newPassword } = body || {};

    if (!name && !password) {
      return Response.json(
        { message: "Provide name or password" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (password) {
      // If password change is requested
      if (!newPassword) {
        return Response.json(
          { message: "newPassword is required" },
          { status: 400 }
        );
      }

      const ok = await bcrypt.compare(password, dbUser.password);
      if (!ok) {
        return Response.json({ message: "Wrong current password" }, { status: 400 });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          password: hashed,
          name: name ?? dbUser.name,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          name,
        },
      });
    }

    return Response.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

