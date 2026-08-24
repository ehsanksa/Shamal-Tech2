import { localePath } from '../i18n/locale'

type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

function toArabicLoc(loc: string, siteUrl: string): string | null {
  const origin = siteUrl.replace(/\/$/, '')
  if (!loc.startsWith(origin)) return null
  const path = loc.slice(origin.length) || '/'
  if (path === '/ar' || path.startsWith('/ar/')) return null
  const arPath = localePath(path, 'ar')
  return `${origin}${arPath}`
}

/** Duplicate each English sitemap URL with its `/ar` equivalent. */
export function expandSitemapWithArabic(entries: SitemapEntry[], siteUrl: string): SitemapEntry[] {
  const result: SitemapEntry[] = []
  const seen = new Set<string>()

  for (const entry of entries) {
    if (!seen.has(entry.loc)) {
      result.push(entry)
      seen.add(entry.loc)
    }
    const arLoc = toArabicLoc(entry.loc, siteUrl)
    if (arLoc && !seen.has(arLoc)) {
      result.push({ ...entry, loc: arLoc })
      seen.add(arLoc)
    }
  }

  return result
}

export function bilingualPaths(path: string, siteUrl: string): string[] {
  const origin = siteUrl.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return [`${origin}${localePath(normalized, 'en')}`, `${origin}${localePath(normalized, 'ar')}`]
}
