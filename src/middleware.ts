import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
const adminRoutes = ['/admin', '/admin/dashboard', '/admin/profile']
const protectedRoutes = ['/dashboard', '/profile']


export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAdminRoute = adminRoutes.includes(path)


  console.log('path', path, 'isProtectedRoute', isProtectedRoute, 'isAdminRoute', isAdminRoute)



  if (isProtectedRoute || isAdminRoute) {
    const token = req.cookies.get('token')?.value;
    let payload;
    if (!token) {
      console.log('No token found');
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (token) {
      payload = JSON.parse(atob(token.split('.')[1]));

    };
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (isAdminRoute && payload.permission !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next();
  }

  if (path === '/login') {
    const token = req.cookies.get('token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
}
console.log("aeiou")

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)'],
}
