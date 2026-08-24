import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '../../../../utilities/getURL'
import { expandSitemapWithArabic } from '../../../../lib/seo/sitemapLocales'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
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

    const dateFallback = new Date().toISOString()

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/products`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/services`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/about`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/contact`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/company-profile`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/training`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/careers`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/privacy-policy`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/terms-and-conditions`,
        lastmod: dateFallback,
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    return [...defaultSitemap, ...sitemap].filter((entry, index, all) => {
      return all.findIndex((item) => item.loc === entry.loc) === index
    })
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(expandSitemapWithArabic(sitemap, getServerSideURL()))
}
