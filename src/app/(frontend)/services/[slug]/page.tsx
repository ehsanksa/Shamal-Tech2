import type { Metadata } from 'next'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { ServiceHeroSection } from '../../../../components/sections/ServiceHeroSection.client'
import { ServiceDetailContent } from '../../../../components/sections/ServiceDetailContent.client'
import { ServiceBreadcrumb } from '../../../../components/sections/ServiceBreadcrumb.client'
import { allArabicKeywordsFlat } from '../../../../lib/seo/arabicKeywords'
import { getRequestLocale } from '../../../../lib/i18n/getRequestLocale'
import { buildLanguageAlternates } from '../../../../lib/seo/alternates'

export const revalidate = 3600

async function getServiceBySlugPublished(slug: string) {
  const payload = await getPayload({ config: configPromise })
  
  const where: any = {
    slug: {
      equals: slug,
    },
  }
  
  where._status = {
    equals: 'published',
  }
  
  const result = await payload.find({
    collection: 'services',
    where,
    limit: 1,
    depth: 1,
    draft: false,
    overrideAccess: false,
  })
  return result.docs[0] || null
}

const getServiceBySlugCached = (slug: string) =>
  unstable_cache(() => getServiceBySlugPublished(slug), ['services', 'bySlug', slug], {
    tags: ['collection_services'],
    revalidate,
  })()

export async function generateStaticParams() {
  try {
    // Add timeout to prevent build hangs
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    )

    const payloadPromise = getPayload({ config: configPromise })
    const payload = await Promise.race([payloadPromise, timeoutPromise]) as Awaited<ReturnType<typeof getPayload>>

    const services = await payload.find({
      collection: 'services',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
      },
    })
    return services.docs.map((service) => ({ slug: service.slug }))
  } catch (error) {
    // Log error but don't fail the build
    console.warn('Failed to generate static params for services:', error)
    // Return empty array to allow build to continue
    // Services will be generated dynamically at runtime
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlugCached(slug)
  const locale = await getRequestLocale()

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  const titleAr = (service as { titleAr?: string }).titleAr
  const descriptionAr = (service as { heroDescriptionAr?: string }).heroDescriptionAr
  const isAr = locale === 'ar'

  return {
    title: isAr
      ? `${titleAr || service.title} | شمل للتقنيات`
      : service.seo?.title || `${service.title} | Shamal Technologies`,
    description: isAr
      ? descriptionAr || service.seo?.description || service.heroDescription || ''
      : service.seo?.description || service.heroDescription || '',
    keywords: [
      service.title,
      titleAr,
      ...allArabicKeywordsFlat().slice(0, 8),
    ].filter(Boolean) as string[],
    alternates: buildLanguageAlternates(`/services/${slug}`, locale),
    openGraph: titleAr
      ? {
          alternateLocale: ['ar_SA'],
        }
      : undefined,
    other: titleAr
      ? {
          'og:title:ar': titleAr,
          ...(descriptionAr ? { 'og:description:ar': descriptionAr } : {}),
        }
      : undefined,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlugCached(slug)

  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <main className="flex flex-col relative">
      {/* Hero Section - Full Viewport */}
      <ServiceHeroSection
        slug={slug}
        title={service.title}
        titleAr={(service as { titleAr?: string }).titleAr}
        heroDescription={service.heroDescription}
        heroDescriptionAr={(service as { heroDescriptionAr?: string }).heroDescriptionAr}
      />

      <ServiceDetailContent service={service} />

      {/* Breadcrumb */}
      <ServiceBreadcrumb
        title={service.title}
        titleAr={(service as { titleAr?: string }).titleAr}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.heroDescription || service.seo?.description || '',
            provider: {
              '@type': 'Organization',
              name: 'Shamal Technologies',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Saudi Arabia',
            },
          }),
        }}
      />
    </main>
  )
}

