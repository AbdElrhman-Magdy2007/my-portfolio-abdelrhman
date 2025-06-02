import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { Routes, Pages, UserRole } from "./constants/enums";

/**
 * Middleware to handle authentication and route protection.
 */
export default withAuth(
  async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;
    console.log("Pathname:", pathname);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Authentication check
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    // Define route types
    const isAuthPage = pathname.startsWith(`/${Routes.AUTH}`);
    const protectedRoutes = [Routes.PROFILE, Routes.ADMIN];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(`/${route}`)
    );

    // Redirect unauthenticated users trying to access protected routes
    if (!isAuthenticated && isProtectedRoute) {
      const redirectUrl = new URL(`/${Routes.AUTH}${Pages.LOGIN}`, request.url);
      console.log("Redirecting to Login:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users trying to access auth pages
    if (isAuthPage && isAuthenticated) {
      const role = token?.role as UserRole;
      const redirectUrl =
        role === UserRole.ADMIN
          ? new URL(`/${Routes.ADMIN}`, request.url)
          : new URL(`/${Routes.PROFILE}`, request.url);
      console.log("Redirecting Authenticated User to:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    // Restrict access to admin routes for non-admin users
    if (
      isAuthenticated &&
      pathname.startsWith(`/${Routes.ADMIN}`) &&
      token?.role !== UserRole.ADMIN
    ) {
      const redirectUrl = new URL(`/${Routes.PROFILE}`, request.url);
      console.log("Redirecting Non-Admin to Profile:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  },
  {
    callbacks: {
      authorized: () => true, // Let middleware handle checks
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
