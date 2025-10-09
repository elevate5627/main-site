import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  if (req.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
