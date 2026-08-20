import { is_supabase_configured } from "@/lib/env";
import { update_session } from "@/lib/supabase/update_session";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/configurar"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!is_supabase_configured()) {
    if (pathname !== "/configurar") {
      return NextResponse.redirect(new URL("/configurar", request.url));
    }
    return NextResponse.next();
  }
  const { response, user } = await update_session(request);
  const is_public = PUBLIC_PATHS.includes(pathname);
  if (!user && !is_public) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/agenda", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png)$).*)"],
};
