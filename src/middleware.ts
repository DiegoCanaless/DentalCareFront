import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/user', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};