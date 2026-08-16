import type { Metadata } from 'next'

import configPromise from '../../../payload.config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { ServicesShowcaseCarousel } from '../../../components/sections/ServicesShowcaseCarousel.client'
import { SlidingServicesSection } from '../../../components/sections/SlidingServicesSection.client'
import { ServicesPageHero } from '../../../components/sections/ServicesPageHero.client'
import { ServicesCTASection } from '../../../components/sections/ServicesCTASection.client'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { getCachedPublishedServicesList } from '../../../lib/cms/cached-queries'
import { safePayloadFind } from '../../../utilities/safePayloadQuery'

export async function generateMetadata(): Promise<Metadata> {
  const servicesPageContent = (await getCachedGlobal('services-page-content', 2)()) as {
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
    title: servicesPageContent?.seo?.metaTitle || servicesPageContent?.hero?.title || 'Our Services | Shamal Technologies',
    description: servicesPageContent?.seo?.metaDescription || servicesPageContent?.hero?.subtitle || 'Comprehensive drone and geospatial solutions from a drone company in Saudi Arabia, including aerial survey, construction monitoring, asset inspection, and more.',
  }
}

export const revalidate = 3600

export default async function ServicesPage() {
  const [servicesPageContent, servicesResultInitial] = await Promise.all([
    getCachedGlobal('services-page-content', 2)(),
    getCachedPublishedServicesList(1),
  ])

  const pageContent = servicesPageContent as {
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

  let servicesResult = servicesResultInitial

  if (servicesResult.docs.length === 0) {
    servicesResult = await safePayloadFind({
      collection: 'services',
      limit: 50,
      where: { _status: { equals: 'published' } },
      sort: 'order',
      depth: 1,
      draft: false,
      overrideAccess: false,
    })
  }

  // Ensure proper sorting: services with order field first (ascending), then by createdAt
  // This handles cases where order might be null/undefined and matches homepage sorting
  let services = {
    ...servicesResult,
    docs: [...servicesResult.docs].sort((a, b) => {
      const orderA = a.order ?? 999
      const orderB = b.order ?? 999
      if (orderA !== orderB) {
        return orderA - orderB
      }
      // If order is the same, sort by createdAt (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }),
  }

  // If no published services, get all services (for development)
  if (services.docs.length === 0) {
    const payload = await getPayload({ config: configPromise })
    services = await payload.find({
      collection: 'services',
      limit: 100,
      sort: 'title',
      depth: 1,
    })
  }

  // Get hero content from CMS - passed to client component for language support
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
              alt={heroBackgroundImage.alt || 'Services page hero background'}
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
              src="/media/hero-banners/hero-services.png"
              alt="Services page hero background"
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <ServicesPageHero
          badge={pageContent?.hero?.badge}
          badgeAr={pageContent?.hero?.badgeAr}
          title={pageContent?.hero?.title}
          titleAr={pageContent?.hero?.titleAr}
          subtitle={pageContent?.hero?.subtitle}
          subtitleAr={pageContent?.hero?.subtitleAr}
        />
      </ScrollSection>

      {/* Dynamic Sliding Services Section */}
      {services.docs.length > 0 && (
        <SlidingServicesSection
          services={services.docs.map((service) => ({
            id: String(service.id),
            title: service.title || null,
            titleAr: service.titleAr || null,
            slug: service.slug || null,
          }))}
        />
      )}

      {/* Services Showcase Carousel - Flexible Height */}
      <ScrollSection id="services" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full py-12 lg:py-16">
          {services.docs.length === 0 ? (
            <CinematicReveal delay={0.2} duration={1}>
              <Card className="max-w-2xl mx-auto border-2 border-logo-blue/30 shadow-xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                    No Services Available
                  </CardTitle>
                  <CardDescription className="text-base text-logo-blue font-medium">
                    Please check back later or contact us for more information.
                  </CardDescription>
                </CardHeader>
              </Card>
            </CinematicReveal>
          ) : (
            <ServicesShowcaseCarousel services={services.docs} />
          )}
        </div>
      </ScrollSection>

      {/* CTA Section - Full Viewport */}
      <ScrollSection id="cta" fullViewport bgVariant="gradient" parallax>
        <ServicesCTASection />
      </ScrollSection>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Drone Services in Saudi Arabia',
            description: 'Drone survey and geospatial solutions from a drone company in Saudi Arabia',
            itemListElement: services.docs.map((service, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Service',
                name: service.title,
                description: service.heroDescription || '',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa'}/services/${service.slug}`,
              },
            })),
          }),
        }}
      />
    </main>
  )
}
