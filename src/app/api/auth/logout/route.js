import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST() {
  try {
    const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;

if (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        isOnline: false,
        lastSeen: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
  }
}

cookieStore.delete("token");

    return Response.json(
      {
        message: "Logout successful",
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