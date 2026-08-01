import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

// ===============================
// GET ALL PRODUCTS (ADMIN)
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
          message: "Only Admin can view products",
        },
        {
          status: 403,
        }
      );
    }

  const products = await prisma.product.findMany({
  where: {
    isActive: true,
  },
  include: {
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    seller: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

    return Response.json(
      {
        totalProducts: products.length,
        products,
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

// ===============================
// ADD PRODUCT (ADMIN)
// ===============================

export async function POST(request) {
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
          message: "Only Admin can add products",
        },
        {
          status: 403,
        }
      );
    }


    const formData = await request.formData();


    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const categoryId = formData.get("categoryId");

    const imageFile = formData.get("image");


    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !categoryId
    ) {
      return Response.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }


    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });


    if (!category) {
      return Response.json(
        {
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }


    let imageName = "";


    if (imageFile && imageFile.size > 0) {

      imageName =
        Date.now() +
        "-" +
        imageFile.name.replaceAll(" ", "-");


      const bytes = await imageFile.arrayBuffer();

      const buffer = Buffer.from(bytes);


      const uploadPath = path.join(
        process.cwd(),
        "public",
        "images",
        imageName
      );


      await fs.writeFile(
        uploadPath,
        buffer
      );

    }


    const product = await prisma.product.create({

      data: {

        title,
        description,

        price: Number(price),

        stock: Number(stock),

        image: imageName,

        sellerId: Number(user.id),

        categoryId: Number(categoryId),

      },

    });


    return Response.json(
      {
        message: "Admin product added successfully",
        product,
      },
      {
        status: 201,
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