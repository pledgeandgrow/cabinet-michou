import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionStatus } from "./app/actions"

export async function middleware(request: NextRequest) {
  const session = await getSessionStatus()
  
  if (request.nextUrl.pathname.startsWith("/admin/") && 
      request.nextUrl.pathname !== "/admin/login" && 
      !session) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}