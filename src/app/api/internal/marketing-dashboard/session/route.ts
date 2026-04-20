import { NextResponse } from "next/server";

const COOKIE = "sm_mkt_auth";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  const secret = process.env.MARKETING_DASHBOARD_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "MARKETING_DASHBOARD_SECRET is not set." },
      { status: 501 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.password !== secret) {
    return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
