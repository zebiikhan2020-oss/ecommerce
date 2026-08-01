import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";


// ===============================
// GET SINGLE ORDER DETAILS
// ===============================

export async function GET(request, context) {

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



    if (!user || user.role !== "BUYER") {

      return Response.json(
        {
          message: "Only Buyer can view order details",
        },
        {
          status: 403,
        }
      );

    }



    const { id } = await context.params;



    const order = await prisma.order.findFirst({

      where: {

        id: Number(id),

        buyerId: user.id,

      },


      include: {

        items: {

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

    });



    if (!order) {

      return Response.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );

    }



    return Response.json(
      {
        order,
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