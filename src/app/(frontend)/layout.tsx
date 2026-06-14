import type { Metadata } from 'next'

import { cn } from '../../utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Rajdhani, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import React, { Suspense } from 'react'

const diodrumArabic = localFont({
  src: '../../assets/fonts/DiodrumArabic-Regular.ttf',
  variable: '--font-diodrum-arabic',
  display: 'swap',
  weight: '400',
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
import { mergeOpenGraph } from '../../utilities/mergeOpenGraph'
import { PublicSiteAnalytics } from '../../components/PublicSiteAnalytics'

import './globals.css'
import { getServerSideURL } from '../../utilities/getURL'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, rajdhani.variable, inter.variable, diodrumArabic.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <InitLanguage />
        <link href="/favicon-32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            <PublicSiteAnalytics />
          </Suspense>
          <AdminBar adminBarProps={{ preview: false }} />
          <LayoutChrome>{children}</LayoutChrome>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
