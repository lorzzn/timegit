import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const getPathname = () => {
  return headers().get("x-pathname")
}

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  const { pathname } = request.nextUrl
  headers.set("x-pathname", pathname)

  return NextResponse.next({ headers })
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
