'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, ShoppingBag, X } from 'lucide-react'

const STORAGE_KEY = 'shamal-promo-modal-dismissed-at'
const SHOW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000
const OPEN_DELAY_MS = 1200

const HIDDEN_PATH_PREFIXES = [
  '/training',
  '/products',
  '/admin',
  '/company-profile',
  '/profile/',
  '/employee/',
  '/api',
] as const

function shouldHideForPath(pathname: string | null): boolean {
  if (!pathname) return false
  return HIDDEN_PATH_PREFIXES.some((prefix) => {
    if (prefix.endsWith('/')) return pathname.startsWith(prefix)
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

function shouldShowFromStorage(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return true
    return Date.now() - dismissedAt >= SHOW_INTERVAL_MS
  } catch {
    return true
  }
}

function persistDismissal(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // Ignore quota / private-mode failures
  }
}

type PromoSection = {
  id: string
  eyebrowIcon: typeof GraduationCap
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
  imageObjectFit: 'cover' | 'contain'
}

const SECTIONS: PromoSection[] = [
  {
    id: 'academy',
    eyebrowIcon: GraduationCap,
    title: 'SHAMAL ACADEMY',
    subtitle: 'Learn Drone Technology, GIS, LiDAR, Mapping & Surveying',
    imageSrc: '/media/promo/academy-laptop-drone.png',
    imageAlt: 'Laptop mockup showing Shamal Academy training with a drone',
    ctaLabel: 'Join Training Platform',
    ctaHref: '/training',
    imageObjectFit: 'cover',
  },
  {
    id: 'dji',
    eyebrowIcon: ShoppingBag,
    title: 'DJI AUTHORIZED SELLER IN KSA',
    subtitle: 'Buy Enterprise Drones, DJI Dock, Payloads & Survey Solutions',
    imageSrc: '/media/promo/dji-enterprise-drone.png',
    imageAlt: 'DJI Enterprise drone available from Shamal Technologies',
    ctaLabel: 'Buy Products Now',
    ctaHref: '/products',
    imageObjectFit: 'contain',
  },
]

export function PromoPopup() {
  const pathname = usePathname()
  const titleId = useId()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)

  const hideForRoute = shouldHideForPath(pathname)

  const close = useCallback(() => {
    persistDismissal()
    setOpen(false)
  }, [])

  useEffect(() => {
    if (hideForRoute) {
      setOpen(false)
      return
    }

    if (!shouldShowFromStorage()) return

    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [hideForRoute, pathname])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  if (hideForRoute) return null

  const overlayTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }

  const modalTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, damping: 26, stiffness: 280 }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6">
          <motion.button
            type="button"
            aria-label="Close promotion overlay"
            className="absolute inset-0 bg-[#020810]/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex h-[100dvh] w-full max-w-none flex-col overflow-y-auto overflow-x-hidden border border-white/15 bg-[linear-gradient(160deg,rgba(10,50,84,0.92)_0%,rgba(8,28,48,0.96)_55%,rgba(6,18,32,0.98)_100%)] shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:h-auto md:max-h-[min(90vh,720px)] md:w-[1000px] md:max-w-[calc(100vw-3rem)] md:overflow-hidden md:rounded-2xl"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={modalTransition}
          >
            <span id={titleId} className="sr-only">
              Shamal Academy and DJI products announcement
            </span>

            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-4 md:top-4"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-2 md:overflow-hidden">
              {SECTIONS.map((section, index) => {
                const Icon = section.eyebrowIcon
                return (
                  <motion.section
                    key={section.id}
                    className={`relative flex flex-col justify-between gap-4 px-5 pb-6 pt-14 sm:px-7 sm:pb-8 sm:pt-16 md:min-h-0 md:gap-5 md:px-8 md:pb-9 md:pt-10 ${
                      index === 0 ? 'border-b border-white/10 md:border-b-0 md:border-r' : 'pb-10 md:pb-9'
                    }`}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { delay: 0.12 + index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                        <Icon className="h-3.5 w-3.5 text-[#7EB6E8]" aria-hidden />
                        {section.id === 'academy' ? 'Training' : 'Products'}
                      </div>
                      <h2 className="font-[family-name:var(--font-rajdhani)] text-[1.55rem] font-bold leading-tight tracking-wide text-white sm:text-2xl md:text-[1.65rem]">
                        {section.title}
                      </h2>
                      <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]">
                        {section.subtitle}
                      </p>
                    </div>

                    <div className="relative mx-auto w-full max-w-md flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#061422]/55 shadow-inner">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,96,147,0.28),transparent_60%)]" />
                      <div className="relative aspect-[16/10] w-full md:aspect-[5/3]">
                        <Image
                          src={section.imageSrc}
                          alt={section.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 500px"
                          className={
                            section.imageObjectFit === 'contain'
                              ? 'object-contain p-4 sm:p-6'
                              : 'object-cover'
                          }
                          priority={index === 0}
                        />
                      </div>
                    </div>

                    <Link
                      href={section.ctaHref}
                      onClick={close}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#226093] to-[#0A3254] px-5 py-3.5 text-center text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(10,50,84,0.45)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-[52px] sm:text-[15px]"
                    >
                      {section.ctaLabel}
                    </Link>
                  </motion.section>
                )
              })}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
