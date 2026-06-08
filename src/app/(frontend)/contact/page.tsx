import type { Metadata } from 'next'
import Image from 'next/image'

import { getCachedGlobal } from '../../../utilities/getGlobals'
import { getCachedPublishedServicesSelect, getCachedSiteSettings } from '../../../lib/cms/cached-queries'
import { ScrollSection } from '../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../components/sections/ParallaxElement'
import { CinematicReveal } from '../../../utilities/animations'
import { ContactPageHero } from '../../../components/sections/ContactPageHero.client'
import { ContactPageContent } from '../../../components/sections/ContactPageContent.client'

export const metadata: Metadata = {
  title: 'Contact Us | Shamal Technologies',
  description:
    'Get in touch with Shamal Technologies for drone survey and geospatial solutions in Saudi Arabia.',
}

export const revalidate = 3600

export default async function ContactPage() {
  const [siteSettings, contactPageContent, services] = await Promise.all([
    getCachedSiteSettings(),
    getCachedGlobal('contact-page-content', 2)(),
    getCachedPublishedServicesSelect(),
  ])

  const siteSettingsTyped = siteSettings as {
    siteName?: string
    siteDescription?: string
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
      addressAr?: string
      mapEmbedUrl?: string
      mapLink?: string
    }
  } | null

  const contactContent = contactPageContent as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      backgroundImage?: { url?: string; alt?: string } | string | null
    }
  } | null

  const heroBackgroundImage = contactContent?.hero?.backgroundImage
  let heroBackgroundImageSrc: string | null = null
  if (heroBackgroundImage && typeof heroBackgroundImage === 'object') {
    const url = heroBackgroundImage.url
    if (url) {
      heroBackgroundImageSrc = url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`
    }
  }

  return (
    <main className="flex flex-col relative">
      <ScrollSection id="hero" heroHeight bgVariant="gradient" parallax>
        {heroBackgroundImageSrc && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBackgroundImageSrc}
              alt={
                (heroBackgroundImage && typeof heroBackgroundImage === 'object'
                  ? heroBackgroundImage.alt
                  : undefined) || 'Contact page background'
              }
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
            <ContactPageHero
              badge={contactContent?.hero?.badge}
              badgeAr={contactContent?.hero?.badgeAr}
              title={contactContent?.hero?.title}
              titleAr={contactContent?.hero?.titleAr}
              subtitle={contactContent?.hero?.subtitle}
              subtitleAr={contactContent?.hero?.subtitleAr}
            />
          </CinematicReveal>
        </ParallaxElement>
      </ScrollSection>

      <ScrollSection id="contact" flexible bgVariant="1" parallax>
        <div className="container mx-auto px-4 w-full">
          <ContactPageContent
            services={services.docs.map((s) => ({
              id: String(s.id),
              title: s.title,
              titleAr: (s as { titleAr?: string }).titleAr,
              slug: s.slug,
            }))}
            contactInfo={siteSettingsTyped?.contactInfo}
            mapEmbedUrl={siteSettingsTyped?.contactInfo?.mapEmbedUrl}
            mapLink={siteSettingsTyped?.contactInfo?.mapLink}
          />
        </div>
      </ScrollSection>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: siteSettingsTyped?.siteName || 'Shamal Technologies',
            description: siteSettingsTyped?.siteDescription || '',
            telephone: siteSettingsTyped?.contactInfo?.phone || '+966 (0) 53 030 1370',
            email: siteSettingsTyped?.contactInfo?.email || 'hello@shamal.sa',
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteSettingsTyped?.contactInfo?.address || '11th floor, Office no:1109',
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
          }),
        }}
      />
    </main>
  )
}
