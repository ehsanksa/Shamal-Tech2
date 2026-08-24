import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose/jwt/verify'

import { parseLocalePath } from './lib/i18n/locale'
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

function withLocaleHeaders(
  request: NextRequest,
  locale: 'en' | 'ar',
  originalPath: string,
  internalPath: string,
): Headers {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', originalPath)
  requestHeaders.set('x-internal-pathname', internalPath)
  requestHeaders.set('x-locale', locale)
  return requestHeaders
}

function continueLocalized(
  request: NextRequest,
  locale: 'en' | 'ar',
  originalPath: string,
  internalPath: string,
): NextResponse {
  const requestHeaders = withLocaleHeaders(request, locale, originalPath, internalPath)

  if (originalPath !== internalPath) {
    const url = request.nextUrl.clone()
    url.pathname = internalPath
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

/**
 * Locale prefix + training JWT gate. `/ar/...` is rewritten to the same English
 * route with `x-locale=ar` so Arabic pages are crawlable, unique URLs.
 */
export async function middleware(request: NextRequest) {
  const originalPath = request.nextUrl.pathname

  if (originalPath === '/en' || originalPath.startsWith('/en/')) {
    const stripped = originalPath === '/en' ? '/' : originalPath.slice(3) || '/'
    const url = request.nextUrl.clone()
    url.pathname = stripped
    return NextResponse.redirect(url, 301)
  }

  const { locale, pathname: internalPath } = parseLocalePath(originalPath)

  if (isMaintenanceMode() && !isMaintenanceBypassPath(internalPath)) {
    return maintenanceMiddlewareResponse(request)
  }

  const secret = process.env.TRAINING_JWT_SECRET
  if (secret && isTrainingProtectedPath(internalPath)) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return redirectToLogin(request, locale)
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(secret))
    } catch {
      return redirectToLogin(request, locale)
    }
  }

  return continueLocalized(request, locale, originalPath, internalPath)
}

function redirectToLogin(request: NextRequest, locale: 'en' | 'ar') {
  const url = request.nextUrl.clone()
  url.pathname = locale === 'ar' ? '/ar/training/login' : '/training/login'
  url.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.svg|apple-icon.png|robots.txt|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)',
  ],
}
