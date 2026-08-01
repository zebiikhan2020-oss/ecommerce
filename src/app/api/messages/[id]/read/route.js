import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function PUT(request, { params }) {

  try {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    const userId = decoded.id;


    const { id } = await params;


    const conversation = await prisma.conversation.findUnique({
      where: {
        id: Number(id),
      },
    });


    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }


    // Sirf doosre bande ke messages read honge
    await prisma.message.updateMany({

      where: {

        conversationId: Number(id),

        senderId: {
          not: userId,
        },

        isRead: false,

      },

      data: {

        isRead: true,

      },

    });


    return NextResponse.json({
      message: "Messages marked as read",
    });


  } catch(error) {

    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );

  }

}