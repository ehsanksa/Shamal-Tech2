export const LOCALES = ['en', 'ar'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const ARABIC_LOCALE: Locale = 'ar'
export const ARABIC_PREFIX = '/ar'

const SKIP_LOCALE_PREFIX = [
  /^\/admin(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /^\/_next(?:\/|$)/,
  /^\/next(?:\/|$)/,
  /^\/media(?:\/|$)/,
  /\.\w+$/,
]

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'ar'
}

export function parseLocalePath(pathname: string): {
  locale: Locale
  /** Path without `/ar` prefix, always starting with `/` */
  pathname: string
  /** Original request pathname */
  originalPath: string
} {
  const clean = pathname || '/'
  if (clean === ARABIC_PREFIX || clean === `${ARABIC_PREFIX}/`) {
    return { locale: 'ar', pathname: '/', originalPath: clean }
  }
  if (clean.startsWith(`${ARABIC_PREFIX}/`)) {
    const stripped = clean.slice(ARABIC_PREFIX.length) || '/'
    return { locale: 'ar', pathname: stripped, originalPath: clean }
  }
  return { locale: 'en', pathname: clean, originalPath: clean }
}

export function stripLocalePrefix(pathname: string): string {
  return parseLocalePath(pathname).pathname
}

export function shouldSkipLocalePrefix(href: string): boolean {
  if (!href || !href.startsWith('/')) return true
  return SKIP_LOCALE_PREFIX.some((pattern) => pattern.test(href))
}

/** Prefix an internal path for the given locale. Idempotent. */
export function localePath(path: string, locale: Locale): string {
  if (!path) return locale === 'ar' ? ARABIC_PREFIX : '/'
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('#')) {
    return path
  }

  const [pathnamePart, hashAndQuery] = splitPathExtras(path)
  const stripped = stripLocalePrefix(pathnamePart)

  if (shouldSkipLocalePrefix(stripped)) {
    return `${stripped}${hashAndQuery}`
  }

  if (locale === 'ar') {
    const arPath = stripped === '/' ? ARABIC_PREFIX : `${ARABIC_PREFIX}${stripped}`
    return `${arPath}${hashAndQuery}`
  }

  return `${stripped}${hashAndQuery}`
}

export function localizeHref(href: string, locale: Locale): string {
  return localePath(href, locale)
}

export function switchLocalePath(currentPath: string, nextLocale: Locale): string {
  return localePath(currentPath, nextLocale)
}

function splitPathExtras(path: string): [string, string] {
  const hashIndex = path.indexOf('#')
  const queryIndex = path.indexOf('?')
  let cut = -1
  if (hashIndex >= 0 && queryIndex >= 0) cut = Math.min(hashIndex, queryIndex)
  else if (hashIndex >= 0) cut = hashIndex
  else if (queryIndex >= 0) cut = queryIndex
  if (cut < 0) return [path, '']
  return [path.slice(0, cut), path.slice(cut)]
}

export function htmlLang(locale: Locale): string {
  return locale === 'ar' ? 'ar' : 'en'
}

export function htmlDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function ogLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar_SA' : 'en_SA'
}
