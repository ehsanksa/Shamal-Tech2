import type { Metadata } from 'next'

import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { getServerSideURL } from '../../utilities/getURL'

type BuildPageMetadataArgs = {
  title: string
  description: string
  path?: string
  keywords?: readonly string[]
  ogImage?: string
  noIndex?: boolean
}

export function buildPageMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  ogImage,
  noIndex = false,
}: BuildPageMetadataArgs): Metadata {
  const siteUrl = getServerSideURL()
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`

  const ogImages = ogImage
    ? [{ url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}` }]
    : undefined

  return {
    title,
    description,
    keywords: keywords.length > 0 ? [...keywords] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: mergeOpenGraph({
      title,
      description,
      url: canonicalPath,
      images: ogImages,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@ShamalTech',
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}
