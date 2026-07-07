import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { getServerSideURL } from '../../../../utilities/getURL'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = getServerSideURL()

  const products = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      updatedAt: true,
    },
  })

  const lastmod = products.docs[0]?.updatedAt
    ? new Date(products.docs[0].updatedAt).toISOString()
    : new Date().toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}
