import { NextResponse, NextRequest} from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isAuthenticated = !!token
const pathname = request.nextUrl.pathname
if(pathname === '/login' || pathname === '/register'){
  if(isAuthenticated){
    return NextResponse.redirect(new URL('/main', request.url))
  }
}
if(pathname === '/generate-grant'){
  if(!isAuthenticated){
    return NextResponse.redirect(new URL('/register', request.url))
  }
}

if(pathname === '/'){
  return NextResponse.redirect(new URL('/main', request.url))
}
  return NextResponse.next()
}
