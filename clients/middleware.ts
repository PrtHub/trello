import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("trello_token");
  const url = request.nextUrl.clone();

  if (!token) {
    if (url.pathname !== "/sign-in" && url.pathname !== "/sign-up") {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"],
};
