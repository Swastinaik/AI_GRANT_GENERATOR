import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = !!token


  const authPaths = [
    
    '/login',
    '/register']

  const protectedPaths = [
    '/me',
    '/generate-grant',
    '/search-grant',
    '/resume-generate',
    '/podcast-agent'
  ]

  const pathname = request.nextUrl.pathname

  if (authPaths.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/me', request.url))
    }
    return NextResponse.next()
  }

  if (protectedPaths.includes(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  
  return NextResponse.next()

  /*
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/main', request.url))
    }
  }
  if (pathname === '/generate-grant' || pathname === '/search-grant') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/register', request.url))
    }
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/main', request.url))
  }
  return NextResponse.next()
  */
}
