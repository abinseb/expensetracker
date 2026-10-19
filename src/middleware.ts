import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/src/lib/auth/session";

const protectedRoutes = ["/dashboard", "/transaction", "/categories", "/budget", "/reports"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // Redirect to login if accessing protected route without session
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect to dashboard if accessing login/register while authenticated
  if (isPublic && session) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // Redirect root to dashboard or login
  if (path === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
