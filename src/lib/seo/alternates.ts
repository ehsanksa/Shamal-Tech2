import type { Metadata } from 'next'

import { getServerSideURL } from '../../utilities/getURL'
import { localePath, type Locale } from '../i18n/locale'

function absoluteUrl(path: string, siteUrl: string): string {
  if (path.startsWith('http')) return path
  const normalized = path === '/' ? '/' : path
  return `${siteUrl.replace(/\/$/, '')}${normalized}`
}

/**
 * Canonical + hreflang for a page. `path` must be the locale-stripped pathname
 * (e.g. `/services/gis-remote-sensing`, `/` ).
 */
export function buildLanguageAlternates(
  pathWithoutLocale: string,
  locale: Locale,
  siteUrl = getServerSideURL(),
): NonNullable<Metadata['alternates']> {
  const path = pathWithoutLocale || '/'
  const enPath = localePath(path, 'en')
  const arPath = localePath(path, 'ar')
  const enUrl = absoluteUrl(enPath, siteUrl)
  const arUrl = absoluteUrl(arPath, siteUrl)
  const canonical = locale === 'ar' ? arUrl : enUrl

  return {
    canonical,
    languages: {
      'en-SA': enUrl,
      'ar-SA': arUrl,
      'x-default': enUrl,
    },
  }
}

export function absoluteLocaleUrl(pathWithoutLocale: string, locale: Locale, siteUrl = getServerSideURL()): string {
  return absoluteUrl(localePath(pathWithoutLocale || '/', locale), siteUrl)
}
