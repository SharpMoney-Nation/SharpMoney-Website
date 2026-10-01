import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FIRST_TOUCH_COOKIE } from "@/lib/firstTouch";
import { firstTouchSetCookie, publicRequestUrl } from "@/lib/firstTouchCookie";

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
    return NextResponse.next();
  }

  // First-touch source cookie (src/lib/firstTouch.ts). Best effort: an error
  // here must never block the page.
  const response = NextResponse.next();
  try {
    const setCookie = firstTouchSetCookie(
      {
        url: publicRequestUrl(request.nextUrl, request.headers),
        method: request.method,
        headers: request.headers,
        hasCookie: request.cookies.has(FIRST_TOUCH_COOKIE),
      },
      Date.now()
    );
    if (setCookie) response.headers.append("Set-Cookie", setCookie);
  } catch {
    // ignore
  }
  return response;
}

export const config = {
  matcher: [
    // Every page except Next internals, API routes and files with an extension.
    "/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
