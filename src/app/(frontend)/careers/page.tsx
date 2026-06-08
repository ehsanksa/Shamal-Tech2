import type { Metadata } from 'next'

import Image from 'next/image'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import { CareersPageHero } from '../../../components/sections/CareersPageHero.client'
import { CareersPageContent } from '../../../components/sections/CareersPageContent.client'
import { safePayloadFindCached } from '../../../utilities/safePayloadQuery'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function CareersPage() {
  const [careersPageContent, careers] = await Promise.all([
    getCachedGlobal('careers-page-content', 2)(),
    safePayloadFindCached({
      cacheKeyParts: ['careers-page', 'career', 'published', 'limit:50', 'sort:-createdAt', 'depth:1'],
      tags: ['collection_career'],
      revalidate,
      options: {
        collection: 'career',
        limit: 50,
        where: { status: { equals: 'published' } },
        sort: '-createdAt',
        depth: 1,
        draft: false,
        overrideAccess: false,
      },
    }),
  ])

  const pageContent = careersPageContent as {
    hero?: {
      badge?: string
      badgeAr?: string
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      backgroundImage?:
        | {
            url?: string
            alt?: string
          }
        | string
        | null
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

  const heroBackgroundImage = pageContent?.hero?.backgroundImage

  // Use URL from API (S3 in production) or filename fallback for local storage
  let heroBackgroundImageSrc: string | null = null
  if (heroBackgroundImage && typeof heroBackgroundImage === 'object') {
    const media = heroBackgroundImage as { url?: string; filename?: string }
    if (media.url) {
      heroBackgroundImageSrc = media.url.startsWith('http')
        ? media.url
        : media.url.startsWith('/')
          ? media.url
          : `/${media.url}`
    } else if (media.filename) {
      heroBackgroundImageSrc = `/media/${media.filename}`
    }
  }
  if (!heroBackgroundImageSrc) {
    heroBackgroundImageSrc = '/media/hero-banners/hero-careers.png'
  }
  const heroBackgroundAlt =
    heroBackgroundImage && typeof heroBackgroundImage === 'object'
      ? (heroBackgroundImage as { alt?: string }).alt || 'Careers hero background'
      : 'Careers hero background'

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden py-12 md:py-16">
        {heroBackgroundImageSrc ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={heroBackgroundImageSrc}
                alt={heroBackgroundAlt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        )}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <CareersPageHero
            badge={pageContent?.hero?.badge}
            badgeAr={pageContent?.hero?.badgeAr}
            title={pageContent?.hero?.title}
            titleAr={pageContent?.hero?.titleAr}
            description={pageContent?.hero?.description}
            descriptionAr={pageContent?.hero?.descriptionAr}
          />
        </div>
      </section>

      {/* Careers List + CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <CareersPageContent
            careers={careers.docs.map((c) => ({
              id: String(c.id),
              title: c.title,
              titleAr: (c as { titleAr?: string }).titleAr,
              slug: c.slug,
              department: c.department,
              employmentType: c.employmentType,
              location: c.location,
              locationAr: (c as { locationAr?: string }).locationAr,
              applicationDeadline: c.applicationDeadline,
              featuredImage: c.featuredImage,
            }))}
          />
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Careers at Shamal Technologies',
            description: pageContent?.seo?.metaDescription || 'Open job positions at Shamal Technologies',
            itemListElement: careers.docs.map((career, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'JobPosting',
                title: career.title,
                description: career.seo?.description || '', // Use SEO description (string) instead of rich text description
                jobLocation: {
                  '@type': 'Place',
                  address: career.location || 'Saudi Arabia',
                },
                employmentType: career.employmentType || '',
                datePosted: career.createdAt,
                validThrough: career.applicationDeadline || undefined,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa'}/careers/${career.slug}`,
              },
            })),
          }),
        }}
      />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const careersPageContent = (await getCachedGlobal('careers-page-content', 2)()) as {
    seo?: {
      metaTitle?: string
      metaDescription?: string
      ogImage?: {
        url?: string
        alt?: string
      } | null
    }
  } | null

  const metaTitle = careersPageContent?.seo?.metaTitle || 'Careers | Shamal Technologies'
  const metaDescription = careersPageContent?.seo?.metaDescription || 'Join our team and help shape the future of drone and geospatial solutions in Saudi Arabia.'

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: careersPageContent?.seo?.ogImage?.url
        ? [
            {
              url: careersPageContent.seo.ogImage.url,
              alt: careersPageContent.seo.ogImage.alt || metaTitle,
            },
          ]
        : undefined,
    },
  }
}

