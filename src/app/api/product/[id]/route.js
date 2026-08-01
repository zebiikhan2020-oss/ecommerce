import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

async function getSeller() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const user = verifyToken(token);

  if (!user || user.role !== "SELLER") {
    return null;
  }

  return user;
}

// GET Single Product
export async function GET(request, context) {
  try {
    const user = await getSeller();

    if (!user) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        sellerId: user.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(product);
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

// UPDATE Product
export async function PUT(request, context) {
  try {
    const user = await getSeller();

    if (!user) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

   const formData = await request.formData();

const title = formData.get("title");
const description = formData.get("description");
const price = formData.get("price");
const stock = formData.get("stock");
const categoryId = formData.get("categoryId");

const imageFile = formData.get("image");
const oldImage = formData.get("imageName");

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        sellerId: user.id,
      },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
 

let imageName = oldImage || "";

if (imageFile && imageFile.size > 0) {
  imageName =
    Date.now() + "-" + imageFile.name.replaceAll(" ", "-");

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

    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        image: imageName,
        categoryId: Number(categoryId),
      },
    });

    return Response.json(
      {
        message: "Product updated successfully",
        product: updatedProduct,
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

// DELETE Product
export async function DELETE(request, context) {
  try {
    const user = await getSeller();

    if (!user) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
        sellerId: user.id,
      },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

   await prisma.product.delete({
  where: {
    id: product.id,
  },
});

return Response.json(
  {
    message: "Product deleted successfully",
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