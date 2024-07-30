import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.time("middleware");
  const token = request.cookies.get("trello_token");
  const url = request.nextUrl.clone();

  console.log(token)

  if (!token) {
    if (url.pathname !== "/sign-in" && url.pathname !== "/sign-up") {
      console.timeEnd("middleware");
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      console.timeEnd("middleware");
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  console.timeEnd("middleware");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"],
};
