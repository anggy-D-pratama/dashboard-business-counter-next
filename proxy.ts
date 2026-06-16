import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const user = req.cookies.get("auth_user")?.value;

  const isAuthRoute =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user && req.nextUrl.pathname !== "/onboarding") {
    const parsedUser = JSON.parse(user);
    console.log(parsedUser);
    if (!parsedUser.business_model_id) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
