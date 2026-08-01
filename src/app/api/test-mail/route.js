import { transporter } from "@/lib/mail";

export async function GET() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Hello! This is a test email from Nodemailer.",
    });

    return Response.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}