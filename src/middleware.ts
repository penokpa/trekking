import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // Skip auth routes and API routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // For dashboard and admin: auth is handled by authConfig.callbacks.authorized
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Public routes: resolve tenant from host header
  const response = NextResponse.next();

  // Check for custom domain or subdomain
  const appDomain = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
    : "localhost:3000";

  const isLocalhost = host.startsWith("localhost");
  const isAppDomain = host === appDomain;
  const isVercelPreview = host.endsWith(".vercel.app");

  if (!isLocalhost && !isAppDomain && !isVercelPreview) {
    // Check if it's a subdomain of the app domain
    if (host.endsWith(`.${appDomain}`)) {
      const slug = host.replace(`.${appDomain}`, "");
      response.headers.set("x-agency-slug", slug);
    } else {
      // Custom domain
      response.headers.set("x-agency-domain", host);
    }
  } else if (process.env.DEFAULT_AGENCY_SLUG) {
    // Use default agency for localhost, app domain, and Vercel preview URLs
    response.headers.set("x-agency-slug", process.env.DEFAULT_AGENCY_SLUG);
  }

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
