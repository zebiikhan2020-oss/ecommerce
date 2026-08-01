import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function PUT() {

  try {

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;


    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    await prisma.user.update({

      where: {
        id: decoded.id,
      },

      data: {

        isOnline: true,

        lastSeen: new Date(),

      },

    });


    return NextResponse.json({

      message: "Presence updated",

    });


  } catch(error) {


    console.log(error);


    return NextResponse.json(

      {
        message: "Something went wrong",
      },

      {
        status:500,
      }

    );

  }

}