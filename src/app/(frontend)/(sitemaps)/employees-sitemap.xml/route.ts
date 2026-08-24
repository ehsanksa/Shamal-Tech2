import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { getServerSideURL } from '@/utilities/getURL'
import { expandSitemapWithArabic } from '@/lib/seo/sitemapLocales'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const employees = await payload.find({
    collection: 'employees',
    limit: 1000,
    where: {
      status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const baseUrl = getServerSideURL()
  const entries = expandSitemapWithArabic(
    employees.docs.map((emp) => ({
      loc: `${baseUrl}/profile/${(emp as { slug: string }).slug}`,
      lastmod: new Date((emp as { updatedAt: string }).updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    })),
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
    <priority>${entry.priority ?? 0.7}</priority>
  </url>`
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
