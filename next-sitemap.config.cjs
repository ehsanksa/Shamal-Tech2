// Get server URL with proper protocol handling
function getSiteURL() {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  // AWS Amplify support
  if (process.env.AWS_APP_ID && process.env.AWS_BRANCH) {
    const branch = process.env.AWS_BRANCH === 'main' ? 'main' : process.env.AWS_BRANCH
    return `https://${branch}.${process.env.AWS_APP_ID}.amplifyapp.com`
  }

  // Vercel support - ensure protocol is added
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const url = process.env.VERCEL_PROJECT_PRODUCTION_URL
    // Add protocol if missing
    return url.startsWith('http') ? url : `https://${url}`
  }

  // Fallback
  return 'https://example.com'
}

const SITE_URL = getSiteURL()

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/employees-sitemap.xml`,
    ],
  },
}
