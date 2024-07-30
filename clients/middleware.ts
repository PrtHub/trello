import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.time("middleware");
  const token = request.cookies.get("trello_token");
  const url = request.nextUrl.clone();

  // Redirect to sign-in if no token and not already on sign-in or sign-up
  if (!token) {
    if (url.pathname !== "/sign-in" && url.pathname !== "/sign-up") {
      console.timeEnd("middleware");
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  } else {
    // Redirect to home if token exists and user tries to access sign-in or sign-up
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      console.timeEnd("middleware");
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Continue to the requested page if all checks pass
  console.timeEnd("middleware");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"], // Match all paths for better redirection
};
