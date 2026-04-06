import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Redirect logged-in users away from login
  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
