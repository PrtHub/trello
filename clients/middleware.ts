// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return NextResponse.next();
  }
  const token = request.cookies.get("trello_token")?.value;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
        return NextResponse.next();
    }
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", '/sign-in', '/sign-up']
};
