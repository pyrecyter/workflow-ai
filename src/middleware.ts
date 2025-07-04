

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const publicRoutes = ['/', '/login', '/register'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is authenticated
  if (token) {
    try {
      await jwtVerify(token, secret);
      // If authenticated user tries to access a public route, redirect to dashboard
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // If user is not authenticated
  if (!token) {
    // If unauthenticated user tries to access a protected route, redirect to login
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - any file with an extension (e.g., .js, .css, .png, .jpg)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\..*).*)',
  ],
};
