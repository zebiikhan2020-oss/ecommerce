import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";


export async function POST(request) {

  try {

    const body = await request.json();

    const { email, password } = body;


    if (!email || !password) {

      return Response.json(
        {
          message: "Email and Password are required",
        },
        {
          status: 400,
        }
      );

    }



    const user = await prisma.user.findUnique({

      where: {
        email,
      },

    });



    if (!user) {

      return Response.json(
        {
          message: "Invalid Email or Password",
        },
        {
          status: 401,
        }
      );

    }




    // Email Verification Check

    if (!user.isVerified) {

      return Response.json(
        {
          message: "Please verify your email before logging in.",
        },
        {
          status: 403,
        }
      );

    }





    // Blocked User Check

    if (user.isBlocked) {

      return Response.json(
        {
          message: "Your account has been blocked. Please contact the administrator.",
        },
        {
          status: 403,
        }
      );

    }





    // Password Check

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );



    if (!isPasswordCorrect) {

      return Response.json(
        {
          message: "Invalid Email or Password",
        },
        {
          status: 401,
        }
      );

    }




    // Generate JWT Token


    await prisma.user.update({
  where: {
    id: user.id,
  },
  data: {
    isOnline: true,
  },
});

    const token = generateToken(user);

    

    const cookieStore = await cookies();



    cookieStore.set("token", token, {

      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      maxAge: 60 * 60 * 24 * 7,

      path: "/",


    });





    // Role Based Redirect

    let redirectTo = "/buyer";


    if (user.role === "SELLER") {

      redirectTo = "/seller";

    } 
    
    else if (user.role === "ADMIN") {

      redirectTo = "/admin";

    }





    return Response.json(

      {
        message: "Login successful",

        redirectTo,

        user: {

          id: user.id,

          name: user.name,

          email: user.email,

          role: user.role,

        },

      },

      {
        status: 200,
      }

    );




  } catch (error) {


    console.error(error);



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