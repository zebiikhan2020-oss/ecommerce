import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

   const conversationId = Number(id);

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

   if (
  user.id !== conversation.buyerId &&
  user.id !== conversation.sellerId &&
  user.id !== conversation.adminId
) {
  return NextResponse.json(
    { message: "Access denied" },
    { status: 403 }
  );
}

    const { text, image } = await request.json();

  if (!text?.trim() && !image) {
  return NextResponse.json(
    { message: "Message or image is required" },
    { status: 400 }
  );
}

   const message = await prisma.message.create({
  data: {
    conversationId,
    senderId: user.id,
    text: text || "",
    image: image || null,
    isDelivered: true,
    isRead: false,
  },
});
    await prisma.conversation.update({
  where: {
    id: conversationId,
  },
  data: {
    updatedAt: new Date(),
  },
});

    return NextResponse.json({
      message: "Message sent successfully",
      data: message,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  try {

    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const conversationId = Number(id);

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
             isOnline: true,
             lastSeen: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            role: true,
             isOnline: true,
             lastSeen: true,
          },
        },

        admin: {
  select: {
    id: true,
    name: true,
    role: true,
    isOnline: true,
    lastSeen: true,
  },
},

        product: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

   if (
  user.id !== conversation.buyerId &&
  user.id !== conversation.sellerId &&
  user.id !== conversation.adminId
) {
  return NextResponse.json(
    { message: "Access denied" },
    { status: 403 }
  );
}
await prisma.message.updateMany({
  where: {
    conversationId,
    senderId: {
      not: user.id,
    },
    isRead: false,
  },
  data: {
    isRead: true,
  },
});

   return NextResponse.json({
  conversation,
  currentUserId: user.id,
});

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}