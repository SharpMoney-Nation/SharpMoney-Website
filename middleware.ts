import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/internal/marketing-dashboard/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/internal/marketing-dashboard")) {
    const secret = process.env.MARKETING_DASHBOARD_SECRET;
    if (!secret) {
      return NextResponse.next();
    }
    const authed = request.cookies.get("sm_mkt_auth")?.value === "1";
    if (!authed) {
      const login = new URL("/internal/marketing-dashboard/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/internal/marketing-dashboard",
    "/internal/marketing-dashboard/:path*",
  ],
};
