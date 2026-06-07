import type { Metadata } from 'next'

import { getCachedGlobal } from '../../utilities/getGlobals'
import { generateMeta } from '../../utilities/generateMeta'
import { safePayloadFind, safePayloadFindCached } from '../../utilities/safePayloadQuery'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { ArrowRight, Check, CheckCircle2, TrendingUp, Award, Users, Target } from 'lucide-react'
import { ServicesCarousel } from '../../components/sections/ServicesCarousel.client'
import { serializeServices } from '../../utilities/serializeService'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../utilities/animations'
import { SectorsPinnedSection } from '../../components/sections/SectorsPinnedSection.client'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'
import { ScrollSection } from '../../components/sections/ScrollSection'
import { ParallaxElement } from '../../components/sections/ParallaxElement'
import { ScrollIndicator } from '../../components/sections/ScrollIndicator'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter.client'
import { LogoSlider } from '../../components/sections/LogoSlider.client'
import { SlidingServicesSection } from '../../components/sections/SlidingServicesSection.client'
import { HomeHeroSection } from '../../components/sections/HomeHeroSection.client'
import { ImpactStatsSection } from '../../components/sections/ImpactStatsSection.client'
import { ContactCTASection } from '../../components/sections/ContactCTASection.client'
import { AboutPreviewSection } from '../../components/sections/AboutPreviewSection.client'
import { BlogPreviewSection } from '../../components/sections/BlogPreviewSection.client'
import { HomeServicesOverviewSection } from '../../components/sections/HomeServicesOverviewSection.client'
import { ViewAllServicesButton } from '../../components/sections/ViewAllServicesButton.client'
import { HomeHeroBackgroundVideo } from '../../components/sections/HomeHeroBackgroundVideo.client'

export const metadata: Metadata = {
  title: 'Shamal Technologies | Drone Survey & Geospatial Solutions in Saudi Arabia',
  description:
    'Pioneering provider of drone and geospatial solutions in Saudi Arabia. Expert drone survey and geospatial services for construction, infrastructure, mining, agriculture, and environmental sectors.',
}

// ISR: Regenerate homepage every hour (3600 seconds)
// On-demand revalidation hooks still work for immediate updates when content changes
export const revalidate = 3600

export default async function HomePage() {
  // Fetch independent globals and services in parallel (reduces TTFB vs sequential awaits)
  const [
    homepageContent,
    siteSettings,
    aboutContent,
    sectorsContent,
    servicesResultInitial,
  ] = await Promise.all([
    getCachedGlobal('homepage-content', 2)() as Promise<{
    hero?: {
      title?: string
      titleAr?: string
      subtitle?: string
      subtitleAr?: string
      backgroundImage?: any
    }
    impactStats?: {
      badge?: string
      badgeAr?: string
      heading?: string
      headingAr?: string
      stats?: Array<{
        value?: number
        suffix?: string
        prefix?: string
        label?: string
        labelAr?: string
      }>
    }
    servicesOverview?: {
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
    }
    sectors?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
      selectedSectors?: Array<{
        sectorSlug?: string
        id?: string
      }>
    }
    aboutPreview?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      textColumn?: any
      textColumnAr?: any
      imageColumn?: {
        id?: string
        url?: string
        alt?: string
        mimeType?: string
        filename?: string
        updatedAt?: string
        createdAt?: string
      } | string | null
      enableTwoColumn?: boolean
      leftColumnMedia?: {
        id?: string
        url?: string
        alt?: string
        mimeType?: string
      } | string | null
      rightColumnTextBlocks?: Array<{
        textType?: 'heading' | 'paragraph' | 'bullets'
        heading?: string
        headingLevel?: 'h2' | 'h3' | 'h4'
        paragraph?: string
        bullets?: Array<{
          text?: string
        }>
      }>
      ctaText?: string
      ctaTextAr?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
    }
    blogPreview?: {
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      ctaText?: string
      ctaTextAr?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
      featuredPosts?: Array<{
        post?: string | {
          id?: string
          slug?: string
          title?: string
          date?: string
          description?: string
          featuredImage?: {
            url?: string
            alt?: string
          } | null
        }
        customImage?: {
          url?: string
          alt?: string
        } | null
      }>
    }
    contactCTA?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      ctaText?: string
      ctaTextAr?: string
      secondaryCtaText?: string
      secondaryCtaTextAr?: string
      backgroundImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null>,
    getCachedGlobal('site-settings', 2)() as Promise<{
    siteName?: string
    siteDescription?: string
    logo?: {
      url?: string
    }
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
    }
  } | null>,
    getCachedGlobal('about-page-content', 2)() as Promise<{
    clients?: Array<{
      logo?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
      } | string | null
    }>
  } | null>,
    getCachedGlobal('sectors-content', 2)() as Promise<{
    sectors?: Array<{
      name?: string
      nameAr?: string
      slug?: string
      description?: string
      descriptionAr?: string
      image?: {
        id?: string
        url?: string
        filename?: string
        alt?: string
        mimeType?: string
      } | string | null
      ctaBlog?: string
      ctaContact?: string
      useCases?: Array<{
        title?: string
        titleAr?: string
        description?: string
        descriptionAr?: string
        id?: string
      }>
      solutionsDelivered?: Array<{
        title?: string
        titleAr?: string
        description?: string
        descriptionAr?: string
        id?: string
      }>
    }>
  } | null>,
    safePayloadFindCached({
      cacheKeyParts: ['home', 'services', 'published', 'limit:50', 'sort:order', 'depth:1'],
      tags: ['collection_services'],
      revalidate: 3600,
      options: {
        collection: 'services',
        limit: 50,
        where: {
          _status: {
            equals: 'published',
          },
        },
        sort: 'order',
        depth: 1,
        draft: false,
        overrideAccess: false,
      },
    }),
  ])

  let servicesResult = servicesResultInitial

  // Safety fallback: if cached query is stale/empty, bypass cache once.
  if (servicesResult.docs.length === 0) {
    servicesResult = await safePayloadFind({
      collection: 'services',
      limit: 50,
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: 'order',
      depth: 2,
      draft: false,
      overrideAccess: false,
    })
  }

  // If no published services, fallback to all services (dev-friendly behavior).
  if (servicesResult.docs.length === 0) {
    servicesResult = await safePayloadFindCached({
      cacheKeyParts: ['home', 'services', 'all', 'limit:50', 'sort:title', 'depth:1'],
      tags: ['collection_services'],
      revalidate: 3600,
      options: {
        collection: 'services',
        limit: 50,
        sort: 'title',
        depth: 1,
        overrideAccess: false,
      },
    })
  }

  // Ensure proper sorting: services with order field first (ascending), then by createdAt
  // This handles cases where order might be null/undefined
  const services = {
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

  // Filter and order sectors based on homepage selection
  let orderedSectors = sectorsContent?.sectors || []
  if (homepageContent?.sectors?.selectedSectors && homepageContent.sectors.selectedSectors.length > 0) {
    // Create a map of sectors by slug for quick lookup (case-insensitive)
    const sectorsMap = new Map(
      (sectorsContent?.sectors || []).map((sector) => [
        sector.slug?.toLowerCase().trim() || '',
        sector,
      ])
    )
    
    // Order sectors according to selectedSectors array
    orderedSectors = homepageContent.sectors.selectedSectors
      .map((selected) => {
        const slug = selected.sectorSlug?.toLowerCase().trim() || ''
        const sector = sectorsMap.get(slug)
        return sector
      })
      .filter((sector) => sector !== undefined) as typeof orderedSectors
    
    // If no sectors matched, fall back to all sectors
    if (orderedSectors.length === 0) {
      orderedSectors = sectorsContent?.sectors || []
    }
  }

  // Determine which blog posts to show
  // If featuredPosts are set in homepageContent, use those; otherwise use latest published posts
  const featuredPostsFromCMS = homepageContent?.blogPreview?.featuredPosts
  let blogPostsToDisplay: any[] = []

  if (featuredPostsFromCMS && Array.isArray(featuredPostsFromCMS) && featuredPostsFromCMS.length > 0) {
    // Use featured posts from CMS
    // Fetch full post data for each featured post
    const postIds = featuredPostsFromCMS
      .map((item) => {
        if (typeof item.post === 'object' && item.post !== null && 'id' in item.post) {
          return item.post.id
        } else if (typeof item.post === 'string') {
          return item.post
        }
        return null
      })
      .filter((id) => id !== null)

    if (postIds.length > 0) {
      const fetchedPosts = await safePayloadFindCached({
        cacheKeyParts: ['home', 'posts', 'featured', `ids:${postIds.join(',')}`, 'depth:2'],
        tags: ['collection_posts'],
        revalidate: 3600,
        options: {
          collection: 'posts',
          where: {
            id: {
              in: postIds as string[],
            },
          },
          depth: 2,
          draft: false,
          overrideAccess: false,
        },
      })

      // Map posts with their custom images
      blogPostsToDisplay = fetchedPosts.docs.map((post) => {
        const featuredItem = featuredPostsFromCMS.find(
          (item) =>
            (typeof item.post === 'object' && item.post !== null && 'id' in item.post
              ? item.post.id
              : item.post) === post.id
        )
        return {
          ...post,
          customImage: featuredItem?.customImage || null,
        }
      })
    }
  }

  // Fallback to latest published posts if no featured posts
  if (blogPostsToDisplay.length === 0) {
    const blogPosts = await safePayloadFindCached({
      cacheKeyParts: ['home', 'posts', 'latest', 'published', 'limit:3', 'sort:-publishedAt', 'depth:2'],
      tags: ['collection_posts'],
      revalidate: 3600,
      options: {
        collection: 'posts',
        limit: 3,
        sort: '-publishedAt',
        where: {
          _status: {
            equals: 'published',
          },
        },
        depth: 2,
        draft: false,
        overrideAccess: false,
      },
    })
    blogPostsToDisplay = blogPosts.docs.map((post) => ({
      ...post,
      customImage: null,
    }))
  }

  // Define sections for scroll indicator
  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'stats', label: 'Impact' },
    { id: 'services', label: 'Services' },
    { id: 'sectors', label: 'Sectors' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <main className="flex flex-col relative">
      {/* Scroll Indicator */}
      <ScrollIndicator sections={sections} />

      {/* Hero Section - Enhanced with Motion Overlays */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - Keep existing video */}
        <HomeHeroBackgroundVideo />
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Enhanced gradient overlay for better text readability and cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>
        
        {/* Motion Overlays - Subtle abstract shapes */}
        <HomeHeroSection
          hero={{
            title: homepageContent?.hero?.title,
            titleAr: homepageContent?.hero?.titleAr,
            subtitle: homepageContent?.hero?.subtitle,
            subtitleAr: homepageContent?.hero?.subtitleAr,
          }}
        />
      </section>

      {/* Dynamic Sliding Services Section */}
      {services.docs.length > 0 && (
        <SlidingServicesSection
          services={services.docs.map((service) => ({
            id: String(service.id),
            title: service.title || null,
            titleAr: (service as { titleAr?: string }).titleAr ?? null,
            slug: service.slug || null,
          }))}
        />
      )}

      {/* Client Logos Slider - Automatic Scrolling */}
      {aboutContent?.clients && aboutContent.clients.length > 0 && (
        <LogoSlider
          logos={aboutContent.clients
            .map((client) => {
              if (
                client.logo &&
                typeof client.logo === 'object' &&
                client.logo !== null &&
                (client.logo.url || client.logo.filename)
              ) {
                return {
                  id: client.logo.id || `client-${client.logo.id}`,
                  url: client.logo.url,
                  filename: client.logo.filename,
                  alt: client.logo.alt || 'Client logo',
                }
              }
              return null
            })
            .filter((logo): logo is NonNullable<typeof logo> => logo !== null)}
        />
      )}

      {/* Stats Section - Full Viewport Immersive (CMS-driven, bilingual) */}
      <ImpactStatsSection
        badge={homepageContent?.impactStats?.badge}
        badgeAr={homepageContent?.impactStats?.badgeAr}
        heading={homepageContent?.impactStats?.heading}
        headingAr={homepageContent?.impactStats?.headingAr}
        stats={
          homepageContent?.impactStats?.stats && homepageContent.impactStats.stats.length > 0
            ? homepageContent.impactStats.stats.map((s) => ({
                value: typeof s.value === 'number' ? s.value : Number(s.value) || 0,
                suffix: s.suffix ?? '',
                prefix: s.prefix ?? '',
                label: s.label ?? '',
                labelAr: s.labelAr ?? '',
              }))
            : undefined
        }
      />

      {/* Services Overview Section - Scrollable Carousel with Parallax */}
      <ScrollSection id="services" flexible bgVariant="1" parallax>
        {/* Background Image */}
        {homepageContent?.servicesOverview?.backgroundImage &&
          typeof homepageContent.servicesOverview.backgroundImage === 'object' &&
          'url' in homepageContent.servicesOverview.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={homepageContent.servicesOverview.backgroundImage.url as string}
                alt={
                  (homepageContent.servicesOverview.backgroundImage as any).alt ||
                  'Services background'
                }
                fill
                className="object-cover opacity-20"
                priority={false}
                quality={85}
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          )}
        <div className="container mx-auto px-4 relative z-10">
          <ParallaxElement speed={0.3} direction="up">
            <CinematicReveal delay={0.2} duration={1.2}>
              <HomeServicesOverviewSection
                title={homepageContent?.servicesOverview?.title}
                titleAr={homepageContent?.servicesOverview?.titleAr}
                description={homepageContent?.servicesOverview?.description}
                descriptionAr={homepageContent?.servicesOverview?.descriptionAr}
              />
            </CinematicReveal>
          </ParallaxElement>
          <ScrollReveal direction="up" delay={0.3} duration={1}>
            <ServicesCarousel services={serializeServices(services.docs)} />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4} duration={1}>
          <div className="text-center mt-12">
            <ViewAllServicesButton />
          </div>
          </ScrollReveal>
        </div>
      </ScrollSection>

      {/* Sectors — pinned scroll stack animation */}
      <div id="sectors">
        <SectorsPinnedSection
        usePinnedScroll={true}
        badge={homepageContent?.sectors?.badge}
        badgeAr={homepageContent?.sectors?.badgeAr}
        title={homepageContent?.sectors?.title || 'SECTORS WE SERVE'}
        titleAr={homepageContent?.sectors?.titleAr}
        description={homepageContent?.sectors?.description}
        descriptionAr={homepageContent?.sectors?.descriptionAr}
        sectors={orderedSectors}
        backgroundImage={
          homepageContent?.sectors?.backgroundImage &&
          typeof homepageContent.sectors.backgroundImage === 'object' &&
          homepageContent.sectors.backgroundImage !== null
            ? (() => {
                const bgImg = homepageContent.sectors.backgroundImage as any
                // PayloadCMS upload fields have 'url' property when populated with depth > 0
                const url = bgImg?.url
                return url && typeof url === 'string'
                  ? {
                      url: url,
                      alt: bgImg?.alt || bgImg?.altText || 'Sectors We Serve Background',
                    }
                  : undefined
              })()
            : undefined
        }
        />
      </div>

      {/* About Preview Section - Full Viewport with Parallax (CMS-driven, bilingual) */}
      <AboutPreviewSection
        badge={homepageContent?.aboutPreview?.badge}
        badgeAr={homepageContent?.aboutPreview?.badgeAr}
        title={homepageContent?.aboutPreview?.title}
        titleAr={homepageContent?.aboutPreview?.titleAr}
        description={homepageContent?.aboutPreview?.description}
        descriptionAr={homepageContent?.aboutPreview?.descriptionAr}
        textColumn={homepageContent?.aboutPreview?.textColumn}
        textColumnAr={homepageContent?.aboutPreview?.textColumnAr}
        imageColumn={homepageContent?.aboutPreview?.imageColumn as any}
        ctaText={homepageContent?.aboutPreview?.ctaText}
        ctaTextAr={homepageContent?.aboutPreview?.ctaTextAr}
        backgroundImage={
          homepageContent?.aboutPreview?.backgroundImage &&
          typeof homepageContent.aboutPreview.backgroundImage === 'object' &&
          'url' in homepageContent.aboutPreview.backgroundImage
            ? {
                url: homepageContent.aboutPreview.backgroundImage.url as string,
                alt: (homepageContent.aboutPreview.backgroundImage as any).alt,
              }
            : undefined
        }
      />

      {/* Blog Preview Section - Full Viewport Insights (bilingual) */}
      <ScrollSection id="blog" fullViewport bgVariant="1" parallax>
        <BlogPreviewSection
          title={homepageContent?.blogPreview?.title}
          titleAr={homepageContent?.blogPreview?.titleAr}
          description={homepageContent?.blogPreview?.description}
          descriptionAr={homepageContent?.blogPreview?.descriptionAr}
          ctaText={homepageContent?.blogPreview?.ctaText}
          ctaTextAr={homepageContent?.blogPreview?.ctaTextAr}
          blogPosts={blogPostsToDisplay}
          backgroundImage={
            homepageContent?.blogPreview?.backgroundImage &&
            typeof homepageContent.blogPreview.backgroundImage === 'object' &&
            'url' in homepageContent.blogPreview.backgroundImage
              ? {
                  url: homepageContent.blogPreview.backgroundImage.url as string,
                  alt: (homepageContent.blogPreview.backgroundImage as any).alt,
                }
              : undefined
          }
        />
      </ScrollSection>

      {/* Contact CTA Section - Full Viewport Final CTA (CMS-driven, bilingual) */}
      <ContactCTASection
        badge={homepageContent?.contactCTA?.badge}
        badgeAr={homepageContent?.contactCTA?.badgeAr}
        title={homepageContent?.contactCTA?.title}
        titleAr={homepageContent?.contactCTA?.titleAr}
        description={homepageContent?.contactCTA?.description}
        descriptionAr={homepageContent?.contactCTA?.descriptionAr}
        primaryCtaText={homepageContent?.contactCTA?.ctaText}
        primaryCtaTextAr={homepageContent?.contactCTA?.ctaTextAr}
        secondaryCtaText={homepageContent?.contactCTA?.secondaryCtaText}
        secondaryCtaTextAr={homepageContent?.contactCTA?.secondaryCtaTextAr}
        backgroundImage={
          homepageContent?.contactCTA?.backgroundImage &&
          typeof homepageContent.contactCTA.backgroundImage === 'object' &&
          'url' in homepageContent.contactCTA.backgroundImage
            ? {
                url: homepageContent.contactCTA.backgroundImage.url as string,
                alt: (homepageContent.contactCTA.backgroundImage as any).alt,
              }
            : undefined
        }
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteSettings?.siteName || 'Shamal Technologies',
            description:
              siteSettings?.siteDescription ||
              'Pioneering provider of drone and geospatial solutions in Saudi Arabia',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa',
            logo:
              siteSettings?.logo &&
              typeof siteSettings.logo === 'object' &&
              'url' in siteSettings.logo
                ? siteSettings.logo.url
                : undefined,
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: siteSettings?.contactInfo?.phone || '+966 (0) 53 030 1370',
              contactType: 'Customer Service',
              email: siteSettings?.contactInfo?.email || 'hello@shamal.sa',
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: siteSettings?.contactInfo?.address || '11th floor, Office no:1109',
              addressLocality: 'Jeddah',
              addressRegion: 'Makkah',
              postalCode: '23511',
              addressCountry: 'SA',
            },
          }),
        }}
      />
    </main>
  )
}
