
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const { pathname } = req.nextUrl;

  // Handle root path redirection
  if (pathname === '/') {
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } catch (error) {
        // If token is invalid, clear cookie and redirect to login
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('token');
        return response;
      }
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If user is authenticated
  if (token) {
    try {
      await jwtVerify(token, secret);
      // If authenticated user tries to access login or register, redirect to dashboard
      if (pathname === '/login' || pathname === '/register') {
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
    // If unauthenticated user tries to access dashboard, redirect to login
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/','/dashboard', '/login', '/register'],
};
