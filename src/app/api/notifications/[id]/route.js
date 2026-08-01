import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function PUT(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

   const { id } = await context.params;
    const body = await request.json();
    const { isRead } = body;

    const notification = await prisma.notification.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!notification) {
      return Response.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.notification.update({
      where: { id: notification.id },
      data: {
        isRead: isRead !== undefined ? Boolean(isRead) : true,
      },
    });

    return Response.json(
      { message: "Notification updated", notification: updated },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id } = await  context.params;

    const notification = await prisma.notification.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!notification) {
      return Response.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id: notification.id },
    });

    return Response.json(
      { message: "Notification deleted" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
