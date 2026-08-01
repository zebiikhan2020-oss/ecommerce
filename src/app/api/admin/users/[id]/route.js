import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";


// ===============================
// UPDATE USER BLOCK STATUS (ADMIN)
// ===============================

export async function PUT(request, context) {

  try {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {

      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }



    const user = verifyToken(token);



    if (!user || user.role !== "ADMIN") {

      return Response.json(
        {
          message: "Only Admin can update users",
        },
        {
          status: 403,
        }
      );

    }



    const { id } = await context.params;


    const body = await request.json();


    const { isBlocked } = body;



    if (typeof isBlocked !== "boolean") {

      return Response.json(
        {
          message: "isBlocked must be true or false",
        },
        {
          status: 400,
        }
      );

    }



    const targetUser = await prisma.user.findUnique({

      where: {

        id: Number(id),

      },

    });



    if (!targetUser) {

      return Response.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );

    }

    if (targetUser.role === "ADMIN") {

  return Response.json(
    {
      message: "Admin account cannot be blocked",
    },
    {
      status: 400,
    }
  );

}



    const updatedUser = await prisma.user.update({

      where: {

        id: Number(id),

      },


      data: {

        isBlocked,

      },


      select: {

        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,

      },

    });



    return Response.json({

      message: "User block status updated successfully",

      user: updatedUser,

    });



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