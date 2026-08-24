import type { Metadata } from 'next'

import { getCachedGlobal } from '../../utilities/getGlobals'
import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { getServerSideURL } from '../../utilities/getURL'
import { getRequestInternalPathname, getRequestLocale } from '../i18n/getRequestLocale'
import { ogLocale } from '../i18n/locale'
import { buildLanguageAlternates } from './alternates'
import {
  allArabicKeywordsFlat,
  ARABIC_META_DESCRIPTION,
  ARABIC_SITE_TITLE,
} from './arabicKeywords'
import {
  allEnglishKeywordsFlat,
  SITE_SEO_DESCRIPTION,
  SITE_SEO_TITLE,
  TARGET_BRAND_KEYWORDS,
} from './englishKeywords'

type SeoSettingsDoc = {
  primaryKeywords?: string[] | null
  secondaryKeywords?: string[] | null
  longTailKeywords?: string[] | null
  arabicPrimaryKeywords?: string[] | null
  arabicSecondaryKeywords?: string[] | null
  arabicLongTailKeywords?: string[] | null
  metaDescriptionTemplateAr?: string | null
}

export async function getSiteSeoMetadata(): Promise<Metadata> {
  let settings: SeoSettingsDoc | null = null

  try {
    settings = (await getCachedGlobal('seo-settings', 0)()) as SeoSettingsDoc
  } catch {
    settings = null
  }

  const locale = await getRequestLocale()
  const path = await getRequestInternalPathname()
  const isAr = locale === 'ar'

  const englishFromCms = [
    ...(settings?.primaryKeywords || []),
    ...(settings?.secondaryKeywords || []).slice(0, 12),
    ...(settings?.longTailKeywords || []).slice(0, 8),
  ]
  const englishKeywords =
    englishFromCms.length > 0 ? englishFromCms : allEnglishKeywordsFlat()

  const arabicFromCms = [
    ...(settings?.arabicPrimaryKeywords || []),
    ...(settings?.arabicSecondaryKeywords || []).slice(0, 12),
    ...(settings?.arabicLongTailKeywords || []).slice(0, 8),
  ]
  const arabicKeywords = arabicFromCms.length > 0 ? arabicFromCms : allArabicKeywordsFlat()

  const siteUrl = getServerSideURL()
  const title = isAr ? ARABIC_SITE_TITLE : SITE_SEO_TITLE
  const description = isAr
    ? settings?.metaDescriptionTemplateAr || ARABIC_META_DESCRIPTION
    : SITE_SEO_DESCRIPTION
  const keywords = isAr
    ? [...new Set([...arabicKeywords, ...TARGET_BRAND_KEYWORDS])]
    : [...new Set([...TARGET_BRAND_KEYWORDS, ...englishKeywords])]

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: isAr ? '%s | شمل للتقنيات' : '%s | Shamal Technologies',
    },
    description,
    keywords,
    alternates: buildLanguageAlternates(path, locale, siteUrl),
    openGraph: mergeOpenGraph({
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: isAr ? ['en_SA'] : ['ar_SA'],
      url: path,
    }),
    other: {
      'content-language': isAr ? 'ar-SA' : 'en-SA',
      'og:locale:alternate': isAr ? 'en_SA' : 'ar_SA',
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon-32.png',
      apple: '/apple-touch-icon.png',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@shamaltechnologies',
      site: '@shamaltechnologies',
    },
  }
}

/** Arabic-only metadata fields for pages that support bilingual SEO. */
export function getArabicPageSeoFields(settings?: SeoSettingsDoc | null) {
  return {
    titleAr: ARABIC_SITE_TITLE,
    descriptionAr: settings?.metaDescriptionTemplateAr || ARABIC_META_DESCRIPTION,
    keywordsAr: settings?.arabicPrimaryKeywords?.length
      ? [
          ...(settings.arabicPrimaryKeywords || []),
          ...(settings.arabicSecondaryKeywords || []).slice(0, 6),
        ]
      : allArabicKeywordsFlat().slice(0, 15),
  }
}
