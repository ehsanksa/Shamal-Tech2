import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose/jwt/verify'

import { isMaintenanceMode } from './lib/maintenance/config'
import { maintenanceMiddlewareResponse } from './lib/maintenance/middleware-response'

const COOKIE_NAME = 'training_session'

const TRAINING_PROTECTED_PREFIXES = [
  '/training/dashboard',
  '/training/courses',
  '/training/checkout',
  '/training/admin',
] as const

function matchesRoute(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`)
}

function isTrainingProtectedPath(pathname: string): boolean {
  return TRAINING_PROTECTED_PREFIXES.some((prefix) => matchesRoute(pathname, prefix))
}

function isMaintenanceBypassPath(pathname: string): boolean {
  return matchesRoute(pathname, '/admin') || pathname.startsWith('/api/')
}

/** Pass pathname to server components (LayoutChrome skips Header/Footer fetches when hidden). */
function withPathname(request: NextRequest, response: NextResponse): NextResponse {
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}

/**
 * Training JWT gate (when not in maintenance). Maintenance mode short-circuits first with 503.
 */
export async function middleware(request: NextRequest) {
  if (isMaintenanceMode() && !isMaintenanceBypassPath(request.nextUrl.pathname)) {
    return maintenanceMiddlewareResponse(request)
  }

  const secret = process.env.TRAINING_JWT_SECRET
  if (!secret || !isTrainingProtectedPath(request.nextUrl.pathname)) {
    return withPathname(request, NextResponse.next())
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return withPathname(request, redirectToLogin(request))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return withPathname(request, NextResponse.next())
  } catch {
    return withPathname(request, redirectToLogin(request))
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/training/login'
  url.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.svg|apple-icon.png|robots.txt|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)',
  ],
}
