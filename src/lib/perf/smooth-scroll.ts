/**
 * Routes where Lenis smooth scroll is disabled (native scroll is faster and avoids GSAP ticker overhead).
 */
const SMOOTH_SCROLL_DISABLED_PREFIXES = [
  '/company-profile',
  '/profile/',
  '/employee/',
  '/products/quote',
  '/training',
] as const

export function shouldUseSmoothScroll(pathname: string | null | undefined): boolean {
  if (!pathname) return true
  return !SMOOTH_SCROLL_DISABLED_PREFIXES.some(
    (prefix) => pathname === prefix.replace(/\/$/, '') || pathname.startsWith(prefix),
  )
}
