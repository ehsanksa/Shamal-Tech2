import { SITE_SEO_DESCRIPTION } from './englishKeywords'
import { TARGET_BRAND_KEYWORDS } from './englishKeywords'

const DEFAULT_SITE_URL = 'https://shamal.sa'

const DEFAULT_SOCIAL = [
  'https://www.linkedin.com/company/shamal-technologies',
  'https://www.facebook.com/shamaltechnologies',
  'https://www.youtube.com/@shamaltechnologies',
  'https://www.instagram.com/shamaltechnologies',
  'https://x.com/shamaltechnologies',
]

export type OrganizationSchemaInput = {
  siteUrl?: string
  name?: string | null
  description?: string | null
  logoUrl?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  sameAs?: Array<string | null | undefined>
}

export function getOrganizationSchema(input: OrganizationSchemaInput = {}) {
  const siteUrl = input.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  const name = input.name || 'Shamal Technologies'
  const description = input.description || SITE_SEO_DESCRIPTION
  const sameAs = [
    ...DEFAULT_SOCIAL,
    ...(input.sameAs || []).filter((url): url is string => Boolean(url)),
  ]
  const uniqueSameAs = [...new Set(sameAs)]

  return {
    '@type': ['Organization', 'LocalBusiness', 'Store'],
    '@id': `${siteUrl}/#organization`,
    name,
    legalName: 'Shamal Technologies',
    alternateName: [
      'شمال للتقنيات',
      'Drone company',
      'drone company in saudi',
      'Drone Company in Saudi Arabia',
      'Authorized DJI Drones Seller',
      'Authorized DJI Products Seller',
      'شركة درون في السعودية',
      'المسح الجوي بالدرون',
      'خدمات الطائرات بدون طيار',
    ],
    description,
    url: siteUrl,
    logo: input.logoUrl || undefined,
    image: input.logoUrl || undefined,
    telephone: input.phone || '+966 (0) 53 030 1370',
    email: input.email || 'hello@shamal.sa',
    areaServed: {
      '@type': 'Country',
      name: 'Saudi Arabia',
    },
    knowsAbout: [
      ...TARGET_BRAND_KEYWORDS,
      'Drone survey',
      'Geospatial solutions',
      'LiDAR',
      'GIS',
    ],
    brand: {
      '@type': 'Brand',
      name: 'DJI',
    },
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'DJI Products',
          brand: { '@type': 'Brand', name: 'DJI' },
          description: 'DJI enterprise drones, docks, payloads, and accessories sold by an authorized DJI products seller in Saudi Arabia.',
        },
        areaServed: 'SA',
        url: `${siteUrl}/products`,
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Drone survey and geospatial solutions',
          description: 'Professional drone surveying, inspection, GIS, and geospatial services from a drone company in Saudi Arabia.',
        },
        areaServed: 'SA',
        url: `${siteUrl}/services`,
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: input.address || 'Office 1109, 11th Floor, The Headquarters Business Park',
      addressLocality: 'Jeddah',
      addressRegion: 'Makkah',
      postalCode: '23511',
      addressCountry: 'SA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.60244686782873,
      longitude: 39.10571367472985,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: input.phone || '+966 (0) 53 030 1370',
      contactType: 'Customer Service',
      email: input.email || 'hello@shamal.sa',
      areaServed: 'SA',
      availableLanguage: ['en', 'ar'],
    },
    sameAs: uniqueSameAs,
  }
}

export function getWebsiteSchema(siteUrl: string) {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Shamal Technologies',
    url: siteUrl,
    description: SITE_SEO_DESCRIPTION,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export const DRONE_COMPANY_FAQS = [
  {
    question: 'Which drone company in Saudi Arabia sells DJI products?',
    questionAr: 'ما هي شركة الدرون في السعودية التي تبيع منتجات DJI؟',
    answer:
      'Shamal Technologies is a drone company in Saudi Arabia and an authorized DJI products seller. We supply DJI products including enterprise drones, docks, and payloads, and we deliver professional drone survey and geospatial solutions across the Kingdom.',
    answerAr:
      'شمال للتقنيات شركة درون في السعودية وبائع منتجات DJI المعتمد. نوفر منتجات DJI بما في ذلك طائرات المؤسسات ومنصات الإقلاع والهبوط والحمولات، ونقدم خدمات المسح الجوي والحلول الجيومكانية في المملكة.',
  },
  {
    question: 'Is Shamal Technologies an authorized DJI drones seller?',
    questionAr: 'هل شمال للتقنيات بائع طائرات DJI المعتمد؟',
    answer:
      'Yes. Shamal Technologies is an authorized DJI drones seller and authorized DJI products seller in Saudi Arabia. You can browse DJI products on our products page and request a quote for sale or lease.',
    answerAr:
      'نعم. شمال للتقنيات بائع طائرات DJI المعتمد وبائع منتجات DJI المعتمد في السعودية. يمكنك تصفح منتجات DJI في صفحة المنتجات وطلب عرض سعر للبيع أو التأجير.',
  },
  {
    question: 'Where can I buy DJI products in Saudi Arabia?',
    questionAr: 'أين يمكنني شراء منتجات DJI في السعودية؟',
    answer:
      'Buy DJI products from Shamal Technologies, a drone company in Saudi and an authorized DJI products seller based in Jeddah, serving clients across Saudi Arabia.',
    answerAr:
      'اشترِ منتجات DJI من شمال للتقنيات، شركة درون في السعودية وبائع منتجات DJI المعتمد ومقرها جدة، وتخدم العملاء في جميع أنحاء المملكة.',
  },
] as const

export function getFaqSchema(siteUrl: string, locale: 'en' | 'ar' = 'en') {
  return {
    '@type': 'FAQPage',
    '@id': `${siteUrl}/#drone-company-faq`,
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-SA',
    mainEntity: DRONE_COMPANY_FAQS.map((faq) => ({
      '@type': 'Question',
      name: locale === 'ar' ? faq.questionAr : faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: locale === 'ar' ? faq.answerAr : faq.answer,
      },
    })),
  }
}

export function getHomeStructuredData(input: OrganizationSchemaInput & { locale?: 'en' | 'ar' } = {}) {
  const siteUrl = input.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  const locale = input.locale || 'en'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema({ ...input, siteUrl }),
      getWebsiteSchema(siteUrl),
      getFaqSchema(siteUrl, locale),
    ],
  }
}
