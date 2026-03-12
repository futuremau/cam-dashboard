import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "cam_session";
const SESSION_TOKEN = "cam_authenticated_2026";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas — no requieren auth
  if (
    pathname.startsWith("/api") || // Excluir rutas de API para que funcionen
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (session !== SESSION_TOKEN) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
