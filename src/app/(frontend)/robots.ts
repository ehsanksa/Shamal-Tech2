import type { MetadataRoute } from 'next'

import { getServerSideURL } from '../../utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerSideURL()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/next/', '/products/quote', '/training/dashboard', '/training/admin'],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
      },
      {
        userAgent: 'msnbot',
        allow: '/',
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/pages-sitemap.xml`,
      `${siteUrl}/posts-sitemap.xml`,
      `${siteUrl}/services-sitemap.xml`,
      `${siteUrl}/products-sitemap.xml`,
      `${siteUrl}/employees-sitemap.xml`,
    ],
    host: siteUrl,
  }
}
