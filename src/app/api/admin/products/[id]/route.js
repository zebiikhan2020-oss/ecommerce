import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ===============================
// GET SINGLE PRODUCT (ADMIN)
// ===============================

export async function GET(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        { message: "Only Admin can view products" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
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
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { product },
      { status: 200 }
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
// DELETE PRODUCT (ADMIN)
// ===============================

export async function DELETE(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        { message: "Only Admin can delete products" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.update({
  where: {
    id: Number(id),
  },
  data: {
    isActive: false,
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

// ===============================
// UPDATE PRODUCT (ADMIN)
// ===============================

export async function PUT(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        { message: "Only Admin can update products" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const categoryId = formData.get("categoryId");

    const imageFile = formData.get("image");
    const oldImage = formData.get("imageName");

    let imageName = oldImage || "";

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

      await fs.writeFile(uploadPath, buffer);
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(id),
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