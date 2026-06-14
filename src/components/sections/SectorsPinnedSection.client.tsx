'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { loadGsap } from '../../lib/animations/loadGsap'

interface Sector {
  name?: string
  nameAr?: string
  slug?: string
  description?: string
  descriptionAr?: string
  image?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    mimeType?: string
  } | string | null
  ctaBlog?: string
  ctaContact?: string
  useCases?: Array<{
    title?: string
    titleAr?: string
    description?: string
    descriptionAr?: string
    id?: string
  }>
  solutionsDelivered?: Array<{
    title?: string
    titleAr?: string
    description?: string
    descriptionAr?: string
    id?: string
  }>
}

interface SectorsPinnedSectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  sectors: Sector[]
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
  /** When false, sectors render as a normal two-column layout without scroll-pinned animation */
  usePinnedScroll?: boolean
}

export function SectorsPinnedSection({
  badge = 'Industries',
  badgeAr,
  title = 'SECTORS WE SERVE',
  titleAr,
  description,
  descriptionAr,
  sectors,
  backgroundImage,
  usePinnedScroll = true,
}: SectorsPinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnWrapperRef = useRef<HTMLDivElement>(null)
  const rightColumnInnerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!usePinnedScroll) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 768px)').matches) return

    if (
      !sectionRef.current ||
      !leftColumnRef.current ||
      !rightColumnWrapperRef.current ||
      !rightColumnInnerRef.current
    )
      return
    if (isInitializedRef.current) return

    const section = sectionRef.current
    const leftColumn = leftColumnRef.current
    const rightColumnWrapper = rightColumnWrapperRef.current
    const rightColumnInner = rightColumnInnerRef.current

    let cancelled = false
    let pinTrigger: { kill: () => void } | null = null
    let scrollAnimation: { kill: () => void } | null = null
    let handleResize: (() => void) | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let scrollTriggerRef: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      scrollTriggerRef = ScrollTrigger

      const initScrollTrigger = () => {
        if (isInitializedRef.current) return

        if (!section || !leftColumn || !rightColumnWrapper || !rightColumnInner) {
          console.warn('SectorsPinnedSection: Elements not available')
          return
        }

        try {
          const initAnimation = () => {
            if (isInitializedRef.current) return

            const wrapperHeight = rightColumnWrapper.offsetHeight
            const innerHeight = rightColumnInner.scrollHeight
            const scrollDistance = Math.max(0, innerHeight - wrapperHeight)

            if (scrollDistance <= 0) return

            ScrollTrigger.getAll().forEach((trigger) => {
              try {
                if (trigger.vars.trigger === section) trigger.kill()
              } catch {
                // ignore
              }
            })

            const pinDuration = scrollDistance

            pinTrigger = ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              end: `+=${pinDuration}`,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              markers: false,
            })

            scrollAnimation = gsap.to(rightColumnInner, {
              y: -scrollDistance,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${pinDuration}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })

            isInitializedRef.current = true
            ScrollTrigger.refresh()
          }

          requestAnimationFrame(() => {
            requestAnimationFrame(initAnimation)
          })
        } catch (error) {
          console.error('SectorsPinnedSection: Error initializing ScrollTrigger:', error)
        }
      }

      const attemptInit = () => {
        const lenisReady = (window as Window & { lenisReady?: boolean }).lenisReady
        const lenisInstance = (window as Window & { lenis?: unknown }).lenis

        if (lenisReady || lenisInstance) {
          initScrollTrigger()
        } else {
          const attempts = (attemptInit as typeof attemptInit & { attempts?: number }).attempts || 0
          if (attempts < 15) {
            ;(attemptInit as typeof attemptInit & { attempts?: number }).attempts = attempts + 1
            timeoutId = setTimeout(attemptInit, 100)
          } else {
            initScrollTrigger()
          }
        }
      }

      timeoutId = setTimeout(attemptInit, 500)

      handleResize = () => {
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', handleResize)
    })

    return () => {
      cancelled = true
      isInitializedRef.current = false
      if (timeoutId) clearTimeout(timeoutId)
      pinTrigger?.kill()
      scrollAnimation?.kill()
      if (handleResize) window.removeEventListener('resize', handleResize)
      if (scrollTriggerRef?.getAll) {
        try {
          scrollTriggerRef.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section) trigger.kill()
            } catch {
              // ignore
            }
          })
        } catch {
          // ignore
        }
      }
    }
  }, [sectors, usePinnedScroll])

  const bgImageUrl = backgroundImage?.url

  return (
    <section
      ref={sectionRef}
      className={
        usePinnedScroll
          ? 'relative w-full overflow-hidden'
          : 'relative w-full overflow-hidden py-16 md:py-24'
      }
      style={usePinnedScroll ? { height: '80vh', minHeight: '600px' } : undefined}
    >
      {/* Background Image - Fixed, never stretches */}
      {bgImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageUrl}
            alt={backgroundImage.alt || 'Sectors background'}
            fill
            className="object-cover"
            style={{ opacity: 0.3 }}
            priority={false}
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
      )}

      {/* Content Container */}
      <div
        className={
          usePinnedScroll
            ? 'relative z-10 h-full container mx-auto px-4 py-12 md:py-16 lg:py-20'
            : 'relative z-10 container mx-auto px-4'
        }
      >
        <div className={usePinnedScroll ? 'h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16' : 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16'}>
          {/* Column 1: Sticky title when pinned; static intro when not */}
          <div
            ref={leftColumnRef}
            className={
              usePinnedScroll
                ? 'flex items-center lg:sticky lg:top-1/2 lg:-translate-y-1/2 self-start lg:self-center'
                : 'flex flex-col justify-center space-y-6'
            }
          >
            <div className="space-y-6 w-full">
              <Badge variant="secondary" className="mb-4">
                {displayBadge}
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {displayTitle}
              </h2>
              {displayDescription && (
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Animated Scrollable Content */}
          <div
            ref={rightColumnWrapperRef}
            className={usePinnedScroll ? 'relative h-full overflow-hidden' : 'relative'}
          >
            <div
              ref={rightColumnInnerRef}
              className="space-y-6"
              style={usePinnedScroll ? { willChange: 'transform' } : undefined}
            >
              {sectors.map((sector, index) => {
                // Handle different image formats
                let sectorImage: string | null = null
                if (sector.image) {
                  if (typeof sector.image === 'object' && sector.image !== null) {
                    if ('url' in sector.image && sector.image.url) {
                      // Handle absolute or relative URLs
                      sectorImage = sector.image.url.startsWith('http')
                        ? sector.image.url
                        : sector.image.url.startsWith('/')
                          ? sector.image.url
                          : `/${sector.image.url}`
                    } else if ('filename' in sector.image && sector.image.filename) {
                      sectorImage = `/media/${sector.image.filename}`
                    }
                  }
                }

                // Determine the primary link - prioritize contact, then blog
                const primaryLink = sector.ctaContact || sector.ctaBlog
                const hasLink = Boolean(primaryLink)

                const cardContent = (
                  <Card className={`hover:shadow-lg transition-shadow ${hasLink ? 'cursor-pointer hover:border-primary' : ''}`}>
                    {/* Sector Image */}
                    {sectorImage && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={sectorImage}
                          alt={getLocalizedValue(sector.name, sector.nameAr, language) || 'Sector image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{getLocalizedValue(sector.name, sector.nameAr, language)}</CardTitle>
                    </CardHeader>
                    {(getLocalizedValue(sector.description, sector.descriptionAr, language)) && (
                      <CardContent>
                        <CardDescription className="mb-4">
                          {getLocalizedValue(sector.description, sector.descriptionAr, language)}
                        </CardDescription>
                        {sector.useCases && sector.useCases.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-semibold">
                              {t.keyApplications}
                            </h4>
                            <ul className="space-y-1">
                              {sector.useCases.slice(0, 3).map((useCase, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start text-sm text-muted-foreground"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                                  <div>
                                    <div className="font-medium">{getLocalizedValue(useCase.title, useCase.titleAr, language)}</div>
                                    {(getLocalizedValue(useCase.description, useCase.descriptionAr, language)) && (
                                      <div className="text-xs text-muted-foreground/80 mt-0.5">
                                        {getLocalizedValue(useCase.description, useCase.descriptionAr, language)}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* CTA Buttons */}
                        {(sector.ctaBlog ||
                          sector.ctaContact) && (
                          <div 
                            className="flex flex-wrap gap-2 pt-2 border-t"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {sector.ctaBlog && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Link href={sector.ctaBlog}>
                                  Blog
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                            {sector.ctaContact && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Link href={sector.ctaContact}>
                                  Contact
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )

                return (
                  <div key={index} className="sector-item">
                    {hasLink ? (
                      <Link href={primaryLink as string} className="block">
                        {cardContent}
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
