import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname === "/login"
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth")
  const isPublicPage = isAuthPage || req.nextUrl.pathname === "/"

  // Allow auth API routes
  if (isApiAuth) {
    return NextResponse.next()
  }

  // Allow public pages
  if (isPublicPage) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
