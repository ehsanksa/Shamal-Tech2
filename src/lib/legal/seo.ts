import type { Metadata } from 'next'

import { getServerSideURL } from '../../utilities/getURL'
import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { LEGAL_COMPANY, type LegalDocument } from './types'

export function buildLegalMetadata(document: LegalDocument): Metadata {
  return {
    title: document.metaTitle,
    description: document.metaDescription,
    keywords: document.keywords,
    alternates: {
      canonical: `/${document.slug}`,
    },
    openGraph: mergeOpenGraph({
      title: `${document.title} | ${LEGAL_COMPANY.name}`,
      description: document.metaDescription,
      url: `/${document.slug}`,
      type: 'website',
    }),
    twitter: {
      card: 'summary_large_image',
      title: `${document.title} | ${LEGAL_COMPANY.name}`,
      description: document.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'article:modified_time': document.lastUpdatedIso,
    },
  }
}

export function buildLegalJsonLd({
  document,
  email,
  phone,
  address,
}: {
  document: LegalDocument
  email: string
  phone: string
  address: string
}) {
  const siteUrl = getServerSideURL()
  const pageUrl = `${siteUrl}/${document.slug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: LEGAL_COMPANY.name,
        url: LEGAL_COMPANY.website,
        email,
        telephone: phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: address,
          addressLocality: LEGAL_COMPANY.locality,
          addressRegion: LEGAL_COMPANY.region,
          postalCode: LEGAL_COMPANY.postalCode,
          addressCountry: LEGAL_COMPANY.country,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: document.title,
        description: document.metaDescription,
        dateModified: document.lastUpdatedIso,
        inLanguage: 'en',
        isPartOf: {
          '@type': 'WebSite',
          name: LEGAL_COMPANY.name,
          url: siteUrl,
        },
        about: { '@id': `${siteUrl}/#organization` },
        breadcrumb: {
          '@id': `${pageUrl}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: document.title,
            item: pageUrl,
          },
        ],
      },
    ],
  }
}
