import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
   
    console.log("Upload API called");

  try {
    const formData = await request.formData();

    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { message: "No image selected" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
        const result = await new Promise((resolve, reject) => {

      cloudinary.uploader
        .upload_stream(
          {
            folder: "chat-images",
          },
          (error, result) => {

            if (error) {
              reject(error);
            } else {
              resolve(result);
            }

          }
        )
        .end(buffer);

    });

    return NextResponse.json({
      message: "Image uploaded successfully",
      image: result.secure_url,
    });
      } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Image upload failed",
      },
      {
        status: 500,
      }
    );
  }
}