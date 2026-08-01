import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";


// ===============================
// GET ALL USERS (ADMIN)
// ===============================

export async function GET() {
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
          message: "Only Admin can view users",
        },
        {
          status: 403,
        }
      );
    }



    const users = await prisma.user.findMany({

      select: {

        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        isVerified: true,
        createdAt: true,

      },


      orderBy: {

        createdAt: "desc",

      },

    });



    return Response.json(
      {
        totalUsers: users.length,
        users,
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