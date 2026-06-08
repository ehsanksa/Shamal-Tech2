import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

function normalizePublicServerUrl(url) {
  const t = String(url).trim()
  if (!t) return ''
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

// Get server URL with support for AWS Amplify, Vercel, and localhost
function getServerURL() {
  // Priority: NEXT_PUBLIC_SERVER_URL > AWS Amplify > Vercel > localhost
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    const normalized = normalizePublicServerUrl(process.env.NEXT_PUBLIC_SERVER_URL)
    if (normalized) return normalized
  }

  // AWS Amplify support
  if (process.env.AWS_APP_ID && process.env.AWS_BRANCH) {
    const branch = process.env.AWS_BRANCH === 'main' ? 'main' : process.env.AWS_BRANCH
    return `https://${branch}.${process.env.AWS_APP_ID}.amplifyapp.com`
  }

  // Vercel support
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Vercel production URL (for backward compatibility)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Fallback
  return process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'
}

const NEXT_PUBLIC_SERVER_URL = getServerURL()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose maintenance + contact vars so Edge middleware receives them (otherwise
  // process.env.* can be undefined in the middleware bundle despite .env on disk).
  env: {
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE ?? '',
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE ?? '',
    MAINTENANCE_RETRY_AFTER: process.env.MAINTENANCE_RETRY_AFTER ?? '',
    MAINTENANCE_WHATSAPP_NUMBER: process.env.MAINTENANCE_WHATSAPP_NUMBER ?? '',
    CONTACT_EMAIL: process.env.CONTACT_EMAIL ?? '',
    CONTACT_PHONE: process.env.CONTACT_PHONE ?? '',
  },
  // Enable standalone output for AWS Amplify SSR support
  // This is required for Payload CMS to work properly in serverless environments
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // Allow images from the server URL
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        try {
          const url = new URL(item)
          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        } catch {
          // If URL parsing fails, skip this pattern
          return null
        }
      }).filter(Boolean),
      // S3 bucket image patterns for cloud storage
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      // Also allow direct S3 bucket URLs (bucket.s3.region.amazonaws.com format)
      ...(process.env.S3_BUCKET && process.env.S3_REGION
        ? [
            {
              protocol: 'https',
              hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
            },
          ]
        : []),
    ],
  },
  // Body size limit for server actions - must stay under Lambda's 6MB limit
  // For AWS Amplify SSR (Lambda-based), the hard limit is 6MB
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  serverExternalPackages: ['pptxgenjs'],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  // Security headers for Vercel/production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  typescript: {
    // Disable type checking during build to avoid issues with devDependencies
    // Types are still checked in development and by IDE
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build to avoid issues with devDependencies
    // ESLint is still run in development
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
