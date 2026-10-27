import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSellerRoute = pathname === "/sell" || pathname.startsWith("/sell/") || pathname === "/my-listings" || pathname.startsWith("/my-listings/");
  const isCustomerRoute =
    pathname === "/browse" ||
    pathname.startsWith("/browse/") ||
    pathname === "/category" ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/listings/") ||
    pathname === "/search" ||
    pathname.startsWith("/search/") ||
    pathname === "/favorites" ||
    pathname.startsWith("/favorites/");

  if (isSellerRoute || isCustomerRoute) {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("role", isSellerRoute ? "seller" : "customer");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/browse",
    "/browse/:path*",
    "/sell",
    "/sell/:path*",
    "/my-listings",
    "/my-listings/:path*",
    "/category",
    "/category/:path*",
    "/listings/:path*",
    "/search",
    "/search/:path*",
    "/favorites",
    "/favorites/:path*",
  ],
};
