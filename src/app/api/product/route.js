import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    // Check Login
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

    // Verify Token
    const user = verifyToken(token);

    console.log(user);

    if (!user) {
      return Response.json(
        {
          message: "Invalid Token",
        },
        {
          status: 401,
        }
      );
    }

    // Only Seller
    if (user.role !== "SELLER") {
      return Response.json(
        {
          message: "Only Seller can add products",
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

    // Check Category
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
  imageName = Date.now() + "-" + imageFile.name.replaceAll(" ", "-");

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadPath = path.join(
    process.cwd(),
    "public",
    "images",
    imageName
  );

  await fs.writeFile(uploadPath, buffer);
}
 
    // Create Product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        image:imageName,
        sellerId: Number (user.id),
        categoryId: Number(categoryId),
      },
    });

    return Response.json(
      {
        message: "Product added successfully",
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