import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const publicRoutes = ["/", "/login", "/register", "/events/:path*"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Check if the current path is an API route
  if (pathname.startsWith("/api")) {
    // if the request is get from /events ignore the token
    if (
      pathname.startsWith("/api/events") &&
      !pathname.includes("/my-events") &&
      req.method === "GET"
    ) {
      return NextResponse.next();
    }

    const apiToken = req.headers.get("authorization")?.split(" ")[1];
    if (!apiToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
      const { payload } = await jwtVerify(apiToken, secret);
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("userId", payload.userId as string);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } else {
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route) => {
      if (route.endsWith("/:path*")) {
        const baseRoute = route.replace("/:path*", "");
        return pathname.startsWith(baseRoute);
      }
      return pathname === route;
    });

    // If user is authenticated
    if (token) {
      try {
        await jwtVerify(token, secret);
        // If authenticated user tries to access a public route, redirect to dashboard
        if (isPublicRoute) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
      } catch {
        // If token is invalid, clear cookie and redirect to login
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("token");
        return response;
      }
    } else {
      // If unauthenticated user tries to access a protected route, redirect to login
      if (!isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|api/|favicon.ico).*)",
    // API routes that need authentication/middleware processing
    "/api/events/:path*",
    "/api/profile",
  ],
};
