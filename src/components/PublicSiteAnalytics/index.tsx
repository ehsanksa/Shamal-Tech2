'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { trackPublicEvent } from '@/lib/analytics/client'

/**
 * Fires PAGE_VIEW on route changes for the public marketing site (not Payload admin).
 * Reads query strings from window.location to avoid useSearchParams in the root layout,
 * which can trigger Next.js 15 "Rendered more hooks than during the previous render".
 */
export function PublicSiteAnalytics() {
  const pathname = usePathname()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname.startsWith('/next/')) return

    const search = typeof window !== 'undefined' ? window.location.search : ''
    const full = search ? `${pathname}${search}` : pathname
    if (last.current === full) return
    last.current = full

    trackPublicEvent({
      eventType: 'PAGE_VIEW',
      pageUrl: full,
    })
  }, [pathname])

  return null
}
