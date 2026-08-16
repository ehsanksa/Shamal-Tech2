import type { Metadata } from 'next'

import Image from 'next/image'
import { ProductsPageHero } from '../../../components/sections/ProductsPageHero.client'
import { ProductsClient } from './ProductsClient'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { getCachedPublishedProducts } from '../../../lib/cms/cached-queries'
import { ProductsSeoIntro } from '../../../components/sections/ProductsSeoIntro.client'
import { TARGET_BRAND_KEYWORDS } from '../../../lib/seo/englishKeywords'
import { getOrganizationSchema } from '../../../lib/seo/structuredData'
import { getServerSideURL } from '../../../utilities/getURL'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const productsPageContent = (await getCachedGlobal('products-page-content', 2)()) as {
    hero?: {
      title?: string
      subtitle?: string
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  return {
    title:
      productsPageContent?.seo?.metaTitle ||
      'DJI Products | Authorized DJI Drones Seller in Saudi Arabia',
    description:
      productsPageContent?.seo?.metaDescription ||
      'Shop DJI products from Shamal Technologies, an authorized DJI drones seller and authorized DJI products seller. A drone company in Saudi Arabia offering DJI enterprise drones, payloads, docks, and geospatial technology for sale or lease.',
    keywords: [
      ...TARGET_BRAND_KEYWORDS,
      'DJI enterprise drones',
      'DJI Dock',
      'drone equipment Saudi Arabia',
    ],
  }
}

export default async function ProductsPage() {
  const [productsPageContent, products] = await Promise.all([
    getCachedGlobal('products-page-content', 2)(),
    getCachedPublishedProducts(),
  ])

  const pageContent = productsPageContent as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      backgroundImage?: {
        id?: string
        url?: string
        alt?: string
        mimeType?: string
      } | string | null
    }
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  // Group products by category
  const productsByCategory = {
    drones: products.docs.filter((p) => p.category === 'drones'),
    payloads: products.docs.filter((p) => p.category === 'payloads'),
    other: products.docs.filter(
      (p) =>
        p.category === 'other' ||
        p.category === 'batteries' ||
        p.category === 'accessories' ||
        p.category === 'software',
    ),
  }

  const heroBackgroundImage = pageContent?.hero?.backgroundImage

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Reduced Height */}
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {/* Background Image */}
        {/* Use only the URL from the API (S3 in production — do not use local /media/ paths) */}
        {heroBackgroundImage &&
        typeof heroBackgroundImage === 'object' &&
        heroBackgroundImage !== null &&
        heroBackgroundImage.url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={
                heroBackgroundImage.url.startsWith('http')
                  ? heroBackgroundImage.url
                  : heroBackgroundImage.url.startsWith('/')
                    ? heroBackgroundImage.url
                    : `/${heroBackgroundImage.url}`
              }
              alt={heroBackgroundImage.alt || 'Products page hero background'}
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        {(!heroBackgroundImage ||
          typeof heroBackgroundImage !== 'object' ||
          heroBackgroundImage === null ||
          !heroBackgroundImage.url) && (
          <div className="absolute inset-0 z-0">
            <Image
              src="/media/hero-banners/hero-products.webp"
              alt="Products page hero background"
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.1} duration={1.2}>
            <ProductsPageHero
              badge={pageContent?.hero?.badge}
              badgeAr={pageContent?.hero?.badgeAr}
              title={pageContent?.hero?.title}
              titleAr={pageContent?.hero?.titleAr}
              subtitle={pageContent?.hero?.subtitle}
              subtitleAr={pageContent?.hero?.subtitleAr}
            />
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      {/* Category Tabs and Products - Flexible Height */}
      <ScrollSection id="products" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full">
          <ProductsSeoIntro />
          <ProductsClient
            productsByCategory={productsByCategory}
            allProducts={products.docs}
          />
        </div>
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              getOrganizationSchema({ siteUrl: getServerSideURL() }),
              {
                '@type': 'CollectionPage',
                name: 'DJI Products | Authorized DJI Drones Seller',
                description:
                  'DJI products from an authorized DJI products seller and drone company in Saudi Arabia.',
                url: `${getServerSideURL()}/products`,
              },
              {
                '@type': 'ItemList',
                name: 'DJI Products',
                itemListElement: products.docs.map((product, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Product',
                    name: product.name,
                    description: product.seo?.description || '',
                    brand: { '@type': 'Brand', name: 'DJI' },
                    category: product.category,
                    ...(typeof product.price === 'number' && product.price > 0
                      ? {
                          offers: {
                            '@type': 'Offer',
                            priceCurrency: 'SAR',
                            price: product.price,
                            availability: 'https://schema.org/InStock',
                          },
                        }
                      : {}),
                  },
                })),
              },
            ],
          }),
        }}
      />
    </main>
  )
}
