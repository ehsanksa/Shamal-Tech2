import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { revalidateTag } from 'next/cache'

import { expandSitemapWithArabic } from '../../../../lib/seo/sitemapLocales'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const payload = await getPayload({ config: configPromise })

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
      updatedAt: true,
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shamal.sa'
  const entries = expandSitemapWithArabic(
    [
      {
        loc: `${baseUrl}/services`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9,
      },
      ...services.docs.map((service) => ({
        loc: `${baseUrl}/services/${service.slug}`,
        lastmod: new Date(service.updatedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      })),
    ],
    baseUrl,
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq || 'weekly'}</changefreq>
    <priority>${entry.priority ?? 0.8}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

