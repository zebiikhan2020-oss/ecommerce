
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  ) {
    return NextResponse.next();
  }

  // Protected routes
  if (
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/admin")
  ) {
    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let user;

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      user = payload;
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/buyer") && user.role !== "BUYER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/seller") && user.role !== "SELLER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*", "/admin/:path*"],
};
