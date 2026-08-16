import type { Metadata } from 'next'

import { cn } from '../../utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Rajdhani, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import React, { Suspense } from 'react'

const tajawal = localFont({
  src: [
    {
      path: '../../assets/fonts/Tajawal-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Tajawal-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Tajawal-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Tajawal-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Tajawal-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Tajawal-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Tajawal-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-tajawal',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

import { AdminBar } from '../../components/AdminBar/AdminBarDynamic'
import { LayoutChrome } from '../../components/LayoutChrome'
import { Providers } from '../../providers'
import { InitTheme } from '../../providers/Theme/InitTheme'
import { InitLanguage } from '../../providers/Language/InitLanguage'
import { PublicSiteAnalytics } from '../../components/PublicSiteAnalytics'
import { TurnstileSiteKeyProvider } from '../../components/forms/TurnstileWidget'

import './globals.css'
import { getSiteSeoMetadata } from '../../lib/seo/getSiteSeoMetadata'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ''

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, rajdhani.variable, inter.variable, tajawal.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <InitLanguage />
        <link href="/favicon-32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      </head>
      <body>
        <Providers>
          <TurnstileSiteKeyProvider siteKey={turnstileSiteKey}>
            <Suspense fallback={null}>
              <PublicSiteAnalytics />
            </Suspense>
            <AdminBar adminBarProps={{ preview: false }} />
            <LayoutChrome>{children}</LayoutChrome>
          </TurnstileSiteKeyProvider>
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return getSiteSeoMetadata()
}
