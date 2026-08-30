import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Career } from './collections/Career'
import { AnalyticsEvents } from './collections/AnalyticsEvents'
import { ChatSummaries } from './collections/ChatSummaries'
import { TrainingAssignmentSubmissions } from './collections/TrainingAssignmentSubmissions'
import { TrainingInterestSubmissions } from './collections/TrainingInterestSubmissions'
import { TrainingCertificates } from './collections/TrainingCertificates'
import { TrainingCourses } from './collections/TrainingCourses'
import { TrainingEnrollments } from './collections/TrainingEnrollments'
import { TrainingProgress } from './collections/TrainingProgress'
import { TrainingStudents } from './collections/TrainingStudents'
import { ProcurementApprovedDomains } from './collections/ProcurementApprovedDomains'
import { ProcurementAuditLogs } from './collections/ProcurementAuditLogs'
import { ProcurementRequests } from './collections/ProcurementRequests'
import { ensurePermanentInternalDomain } from './lib/procurement/domains'
import { Employees } from './collections/Employees'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { EventClientSubmissions } from './collections/EventClientSubmissions'
import { IssueReports } from './collections/IssueReports'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { NewsletterSubscriptions } from './collections/NewsletterSubscriptions'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Orders } from './collections/Orders'
import { Products } from './collections/Products'
import { SEOKeywords } from './collections/SEOKeywords'
import { Services } from './collections/Services'
import { Users } from './collections/Users'

import { AboutPageContent } from './globals/AboutPageContent'
import { CareersPageContent } from './globals/CareersPageContent'
import { ContactPageContent } from './globals/ContactPageContent'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { HomepageContent } from './globals/HomepageContent'
import { PostsPageContent } from './globals/PostsPageContent'
import { ProductsPageContent } from './globals/ProductsPageContent'
import { PromoPopupContent } from './globals/PromoPopupContent'
import { SEOSettings } from './globals/SEOSettings'
import { SectorsContent } from './globals/SectorsContent'
import { ServicesPageContent } from './globals/ServicesPageContent'
import { SiteSettings } from './globals/SiteSettings'
import { VisitorsFormSettings } from './globals/VisitorsFormSettings'
import { FormNotificationSettings } from './globals/FormNotificationSettings'
import { ProcurementFormSettings } from './globals/ProcurementFormSettings'

import { plugins } from './plugins'
import { defaultLexical } from './fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import {
  getSmtpTransportOptions,
  readSmtpEnv,
  shouldSkipSmtpVerify,
} from './lib/email/smtpEnv'

const mongoFromEnv = process.env.MONGODB_URI || process.env.DATABASE_URI || ''
/** Local builds may omit env; Vercel must define MONGODB_URI (also for the build step). */
const mongoURL =
  mongoFromEnv ||
  (process.env.VERCEL === '1' ? '' : 'mongodb://127.0.0.1:27017/shamal-payload')

if (!mongoURL) {
  throw new Error(
    'Missing MONGODB_URI or DATABASE_URI on Vercel. Add your Atlas connection string under Project → Settings → Environment Variables (Production, Preview, and Build).',
  )
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ---------------- EMAIL CONFIG ---------------- */
const smtpTransportOptions = getSmtpTransportOptions()

const emailAdapter = smtpTransportOptions
  ? nodemailerAdapter({
      defaultFromAddress:
        readSmtpEnv('SMTP_FROM') || readSmtpEnv('SMTP_USER')!,
      defaultFromName:
        readSmtpEnv('SMTP_FROM_NAME') || 'Shamal Technologies',
      // Avoid SMTP verify on every Vercel serverless cold start (log noise + M365 rate limits).
      skipVerify: shouldSkipSmtpVerify(),
      transportOptions: smtpTransportOptions,
    })
  : undefined

/* ---------------- PAYLOAD CONFIG ---------------- */

export default buildConfig({
  /** 🔑 REQUIRED FOR PROD ADMIN */
  serverURL: getServerSideURL(),

  // Body parser limits for multipart/form-data - must stay under Lambda's 6MB request body limit
  // For AWS Amplify SSR (Lambda-based), the hard limit is 6MB.
  // bodyParser uses BusboyConfig (multipart only); limits are in bytes. 5MB = 5242880
  bodyParser: {
    limits: {
      fieldSize: 5 * 1024 * 1024, // 5MB for field values (e.g. JSON in _payload)
      fileSize: 5 * 1024 * 1024,  // 5MB for file uploads
    },
  },

  admin: {
    user: Users.slug,
    avatar: {
      Component: '/components/AdminProfileMenu#default',
    },
    meta: {
      titleSuffix: ' - Shamal Technologies',
      icons: {
        icon: [
          { url: '/favicon.svg', type: 'image/svg+xml' },
          { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon-32.png',
        apple: '/apple-touch-icon.png',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['/components/BeforeLogin'],
      beforeDashboard: ['/components/AdminDashboardBefore#default'],
      graphics: {
        Icon: '/components/AdminIcon#default',
        Logo: '/components/AdminLogo#default',
      },
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const baseURL = getServerSideURL()
  
        if (collectionConfig?.slug === 'pages') {
          const slug =
            typeof data?.slug === 'string' ? data.slug : 'home'
          return `${baseURL}/${slug === 'home' ? '' : slug}`
        }
  
        if (collectionConfig?.slug === 'posts') {
          return `${baseURL}/posts/${data?.slug ?? ''}`
        }
  
        if (collectionConfig?.slug === 'services') {
          return `${baseURL}/services/${data?.slug ?? ''}`
        }
  
        if (collectionConfig?.slug === 'career') {
          return `${baseURL}/careers/${data?.slug ?? ''}`
        }

        if (collectionConfig?.slug === 'employees') {
          return `${baseURL}/profile/${data?.slug ?? ''}`
        }
  
        if (globalConfig?.slug === 'homepage-content') return baseURL
        if (globalConfig?.slug === 'about-page-content') return `${baseURL}/about`
        if (globalConfig?.slug === 'posts-page-content') return `${baseURL}/posts`
        if (globalConfig?.slug === 'careers-page-content') return `${baseURL}/careers`
        if (globalConfig?.slug === 'contact-page-content') return `${baseURL}/contact`
        if (globalConfig?.slug === 'products-page-content') return `${baseURL}/products`
        if (globalConfig?.slug === 'services-page-content') return `${baseURL}/services`
  
        return baseURL
      },
    },
  },
  

  editor: defaultLexical,

  email: emailAdapter,

  db: mongooseAdapter({
    url: mongoURL,
    // Atlas M0 allows 500 connections cluster-wide. Default mongoose pool is 100
    // per process; Vercel serverless can spawn many processes and trip the alert.
    connectOptions: {
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 10_000,
    },
  }),

  collections: [
    AnalyticsEvents,
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Services,
    Products,
    Orders,
    Career,
    ContactSubmissions,
    EventClientSubmissions,
    Employees,
    Leads,
    NewsletterSubscriptions,
    SEOKeywords,
    IssueReports,
    ChatSummaries,
    TrainingStudents,
    TrainingCourses,
    TrainingEnrollments,
    TrainingProgress,
    TrainingCertificates,
    TrainingAssignmentSubmissions,
    TrainingInterestSubmissions,
    ProcurementApprovedDomains,
    ProcurementRequests,
    ProcurementAuditLogs,
  ],

  // CORS configuration - allow frontend requests from the server URL and localhost
  cors: (() => {
    const origins: string[] = []
    const serverURL = getServerSideURL()
    
    // Add the server URL (handles NEXT_PUBLIC_SERVER_URL, Vercel, AWS Amplify, or localhost)
    if (serverURL) {
      origins.push(serverURL)
    }
    
    // Add specific Vercel domain if different from serverURL
    if (process.env.VERCEL_URL) {
      const vercelURL = `https://${process.env.VERCEL_URL}`
      if (!origins.includes(vercelURL)) {
        origins.push(vercelURL)
      }
    }
    
    // Add Vercel production URL if available
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      const prodURL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      if (!origins.includes(prodURL)) {
        origins.push(prodURL)
      }
    }
    
    // Note: Payload doesn't support wildcard patterns in CORS/CSRF
    // Each specific domain must be added explicitly via NEXT_PUBLIC_SERVER_URL
    
    // Add localhost for development
    if (process.env.NODE_ENV === 'development') {
      origins.push('https://localhost:3000')
    }
    
    return origins
  })(),

  // CSRF configuration - same as CORS for consistency
  csrf: (() => {
    const origins: string[] = []
    const serverURL = getServerSideURL()
    
    // Add the server URL (handles NEXT_PUBLIC_SERVER_URL, Vercel, AWS Amplify, or localhost)
    if (serverURL) {
      origins.push(serverURL)
    }
    
    // Add specific Vercel domain if different from serverURL
    if (process.env.VERCEL_URL) {
      const vercelURL = `https://${process.env.VERCEL_URL}`
      if (!origins.includes(vercelURL)) {
        origins.push(vercelURL)
      }
    }
    
    // Add Vercel production URL if available
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      const prodURL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      if (!origins.includes(prodURL)) {
        origins.push(prodURL)
      }
    }
    
    // Note: Payload doesn't support wildcard patterns in CORS/CSRF
    // Each specific domain must be added explicitly via NEXT_PUBLIC_SERVER_URL
    
    // Add localhost for development
    if (process.env.NODE_ENV === 'development') {
      origins.push('https://localhost:3000')
    }
    
    return origins
  })(),

  globals: [
    Header,
    Footer,
    SiteSettings,
    HomepageContent,
    AboutPageContent,
    PostsPageContent,
    CareersPageContent,
    ContactPageContent,
    ProductsPageContent,
    PromoPopupContent,
    ServicesPageContent,
    SectorsContent,
    SEOSettings,
    VisitorsFormSettings,
    FormNotificationSettings,
    ProcurementFormSettings,
  ],

  plugins,

  secret: process.env.PAYLOAD_SECRET,

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  onInit: async (payload) => {
    try {
      await ensurePermanentInternalDomain(payload)
    } catch (error) {
      payload.logger.error({ err: error }, 'Failed to ensure permanent procurement domain')
    }
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }) => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
