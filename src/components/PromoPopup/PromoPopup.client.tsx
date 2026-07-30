'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, ShoppingBag, X } from 'lucide-react'

import type { PromoPopupData, PromoPopupSectionData } from './types'
import { DEFAULT_PROMO_POPUP } from './types'

const STORAGE_KEY = 'shamal-promo-modal-dismissed-at'

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

function shouldShowFromStorage(intervalDays: number): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const dismissedAt = Number(raw)
    if (!Number.isFinite(dismissedAt)) return true
    const intervalMs = Math.max(1, intervalDays) * 24 * 60 * 60 * 1000
    return Date.now() - dismissedAt >= intervalMs
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

function stopLenis(): (() => void) | undefined {
  const lenis = (window as Window & { lenis?: { stop?: () => void; start?: () => void } }).lenis
  if (!lenis?.stop) return undefined
  lenis.stop()
  return () => {
    lenis.start?.()
  }
}

function SectionIcon({ id }: { id: PromoPopupSectionData['id'] }) {
  const Icon = id === 'academy' ? GraduationCap : ShoppingBag
  return <Icon className="h-3.5 w-3.5 text-[#7EB6E8]" aria-hidden />
}

type PromoPopupClientProps = {
  data?: PromoPopupData
}

export function PromoPopupClient({ data = DEFAULT_PROMO_POPUP }: PromoPopupClientProps) {
  const pathname = usePathname()
  const titleId = useId()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const hideForRoute = shouldHideForPath(pathname)
  const { enabled, showIntervalDays, openDelayMs, sections } = data

  const close = useCallback(() => {
    persistDismissal()
    setOpen(false)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!enabled || hideForRoute) {
      setOpen(false)
      return
    }

    if (!shouldShowFromStorage(showIntervalDays)) return

    const timer = window.setTimeout(() => setOpen(true), Math.max(0, openDelayMs))
    return () => window.clearTimeout(timer)
  }, [enabled, hideForRoute, openDelayMs, pathname, showIntervalDays])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    const resumeLenis = stopLenis()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
      resumeLenis?.()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  if (!mounted || !enabled || hideForRoute) return null

  // Avoid scale + backdrop-filter together — iOS Safari often renders that combo invisible.
  const overlayTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }

  const modalTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const }

  const modal = (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[10050] flex items-stretch justify-center md:items-center md:p-6"
          style={{ WebkitTransform: 'translateZ(0)' }}
        >
          <motion.button
            type="button"
            aria-label="Close promotion overlay"
            className="absolute inset-0 bg-[#020810]/80 md:bg-[#020810]/70 md:backdrop-blur-md"
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
            className="relative z-10 flex max-h-[100dvh] min-h-0 w-full flex-col overflow-y-auto overscroll-contain border border-white/15 bg-[linear-gradient(160deg,#0A3254_0%,#081c30_55%,#061220_100%)] shadow-[0_32px_80px_rgba(0,0,0,0.45)] md:max-h-[min(90vh,720px)] md:w-[1000px] md:max-w-[calc(100vw-3rem)] md:rounded-2xl md:bg-[linear-gradient(160deg,rgba(10,50,84,0.96)_0%,rgba(8,28,48,0.98)_55%,rgba(6,18,32,1)_100%)]"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={modalTransition}
          >
            <span id={titleId} className="sr-only">
              {sections.map((s) => s.title).join(' and ')}
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
              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  className={`relative flex flex-col justify-between gap-4 px-5 pb-6 pt-14 sm:px-7 sm:pb-8 sm:pt-16 md:min-h-0 md:gap-5 md:px-8 md:pb-9 md:pt-10 ${
                    index === 0
                      ? 'border-b border-white/10 md:border-b-0 md:border-r'
                      : 'pb-10 md:pb-9'
                  }`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { delay: 0.08 + index * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                      <SectionIcon id={section.id} />
                      {section.badge}
                    </div>
                    <h2 className="font-[family-name:var(--font-rajdhani)] text-[1.55rem] font-bold leading-tight tracking-wide text-white sm:text-2xl md:text-[1.65rem]">
                      {section.title}
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]">
                      {section.subtitle}
                    </p>
                  </div>

                  <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#061422] shadow-inner">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,96,147,0.28),transparent_60%)]" />
                    <div className="relative aspect-[16/10] w-full md:aspect-[5/3]">
                      <Image
                        src={section.imageSrc}
                        alt={section.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className={
                          section.imageFit === 'contain'
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
              ))}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
