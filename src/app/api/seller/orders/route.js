import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";


// ===============================
// GET SELLER ORDERS
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


    if (!user || user.role !== "SELLER") {
      return Response.json(
        {
          message: "Only Seller can view orders",
        },
        {
          status: 403,
        }
      );
    }



    const orders = await prisma.order.findMany({

      where: {

        items: {

          some: {

            product: {

              sellerId: user.id,

            },

          },

        },

      },


      include: {

        buyer: {

          select: {

            id: true,
            name: true,
            email: true,

          },

        },


        items: {

          where: {

            product: {

              sellerId: user.id,

            },

          },


          include: {

            product: {

              select: {

                id: true,
                title: true,
                image: true,

              },

            },

          },

        },

      },


      orderBy: {

        createdAt: "desc",

      },

    });



    return Response.json(

      {
        totalOrders: orders.length,
        orders,
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