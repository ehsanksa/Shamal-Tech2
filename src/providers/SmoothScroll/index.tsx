'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { shouldUseSmoothScroll } from '../../lib/perf/smooth-scroll'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!shouldUseSmoothScroll(pathname)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let cleanupTicker: (() => void) | undefined

    const init = async () => {
      try {
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])

        if (cancelled) return

        gsap.registerPlugin(ScrollTrigger)

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        })

        lenisRef.current = lenis
        ;(window as Window & { lenis?: typeof lenis; lenisReady?: boolean }).lenis = lenis
        ;(window as Window & { lenis?: typeof lenis; lenisReady?: boolean }).lenisReady = true

        lenis.on('scroll', ScrollTrigger.update)

        let tickerCallback: ((time: number) => void) | null = null
        if (gsap?.ticker) {
          tickerCallback = (time: number) => {
            lenis.raf(time * 1000)
          }
          gsap.ticker.add(tickerCallback)
          gsap.ticker.lagSmoothing(0)
          cleanupTicker = () => {
            if (tickerCallback) gsap.ticker.remove(tickerCallback)
          }
        }

        ScrollTrigger.refresh()
        lenis.scrollTo(0, { immediate: true })
      } catch (error) {
        console.error('SmoothScrollProvider: Error initializing Lenis:', error)
      }
    }

    const runInit = () => {
      void init()
    }

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(runInit, { timeout: 2500 })
    } else {
      timeoutId = setTimeout(runInit, 150)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId) clearTimeout(timeoutId)
      cleanupTicker?.()
      lenisRef.current?.destroy()
      lenisRef.current = null
      const w = window as Window & { lenis?: unknown; lenisReady?: boolean }
      delete w.lenis
      delete w.lenisReady
    }
  }, [pathname])

  return <>{children}</>
}
