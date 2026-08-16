import type { Metadata } from 'next'

import { getCachedGlobal } from '../../utilities/getGlobals'
import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { getServerSideURL } from '../../utilities/getURL'
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

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_SEO_TITLE,
      template: '%s | Shamal Technologies',
    },
    description: SITE_SEO_DESCRIPTION,
    keywords: [...new Set([...TARGET_BRAND_KEYWORDS, ...englishKeywords, ...arabicKeywords])],
    alternates: {
      canonical: siteUrl,
      languages: {
        en: siteUrl,
        ar: siteUrl,
        'ar-SA': siteUrl,
        'x-default': siteUrl,
      },
    },
    openGraph: mergeOpenGraph({
      title: SITE_SEO_TITLE,
      description: SITE_SEO_DESCRIPTION,
      locale: 'en_US',
      alternateLocale: ['ar_SA'],
      url: '/',
    }),
    other: {
      'content-language': 'en, ar',
      'og:locale:alternate': 'ar_SA',
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
