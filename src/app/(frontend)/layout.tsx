import type { Metadata } from 'next'

import { cn } from '../../utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Rajdhani, Inter } from 'next/font/google'
import React, { Suspense } from 'react'

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
    <html className={cn(GeistSans.variable, GeistMono.variable, rajdhani.variable, inter.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <InitLanguage />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
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
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
