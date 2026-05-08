'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import Image from 'next/image'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined' && gsap && ScrollTrigger) {
  try {
    gsap.registerPlugin(ScrollTrigger)
  } catch (e) {
    console.warn('ScrollTrigger registration warning:', e)
  }
}

interface WhyChooseItem {
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  content?: string
  contentAr?: string
  image?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    mimeType?: string
  } | string | null
}

interface WhyChooseShamalPinnedSectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  subtitle?: string
  subtitleAr?: string
  description?: string
  items: WhyChooseItem[]
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
}

export function WhyChooseShamalPinnedSection({
  badge = 'Advantages',
  badgeAr,
  title = 'Why Choose Shamal',
  titleAr,
  subtitle,
  subtitleAr,
  description,
  items,
  backgroundImage,
}: WhyChooseShamalPinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displaySubtitle = getLocalizedValue(subtitle, subtitleAr, language)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnWrapperRef = useRef<HTMLDivElement>(null)
  const rightColumnInnerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (
      !sectionRef.current ||
      !leftColumnRef.current ||
      !rightColumnWrapperRef.current ||
      !rightColumnInnerRef.current
    )
      return
    if (isInitializedRef.current) return

    if (typeof window === 'undefined') return
    if (!gsap || !ScrollTrigger) return

    try {
      gsap.registerPlugin(ScrollTrigger)
    } catch (e) {
      // Plugin already registered
    }

    const section = sectionRef.current
    const leftColumn = leftColumnRef.current
    const rightColumnWrapper = rightColumnWrapperRef.current
    const rightColumnInner = rightColumnInnerRef.current

    let pinTrigger: ScrollTrigger | null = null
    let scrollAnimation: gsap.core.Tween | null = null
    let handleResize: (() => void) | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const initScrollTrigger = () => {
      if (isInitializedRef.current) return
      if (window.innerWidth < 1024) return

      if (!section || !leftColumn || !rightColumnWrapper || !rightColumnInner) {
        console.warn('WhyChooseShamalPinnedSection: Elements not available')
        return
      }

      if (!ScrollTrigger || typeof ScrollTrigger.create !== 'function') {
        console.error('WhyChooseShamalPinnedSection: ScrollTrigger not loaded')
        return
      }

      try {
        // Wait for layout to stabilize, then calculate dimensions
        const initAnimation = () => {
          if (isInitializedRef.current) return

          const wrapperHeight = rightColumnWrapper.offsetHeight
          const innerHeight = rightColumnInner.scrollHeight
          const scrollDistance = Math.max(0, innerHeight - wrapperHeight)

          // Only proceed if there's content to scroll
          if (scrollDistance <= 0) {
            return
          }

          // Kill any existing ScrollTriggers for this section
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section) {
                trigger.kill()
              }
            } catch (e) {
              // Ignore cleanup errors
            }
          })

          // Pin the entire section
          // Pin duration equals the scroll distance needed to scroll through all content
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

          // Animate the inner wrapper based on scroll progress
          // As we scroll, translate the inner wrapper upward
          // This creates the effect of scrolling through the cards
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

          // Mark as initialized
          isInitializedRef.current = true

          // Refresh ScrollTrigger after animations are set up
          ScrollTrigger.refresh()
        }

        // Wait for layout to stabilize
        requestAnimationFrame(() => {
          requestAnimationFrame(initAnimation)
        })

      } catch (error) {
        console.error('WhyChooseShamalPinnedSection: Error initializing ScrollTrigger:', error)
      }
    }

    // Wait for DOM and Lenis to be ready
    const attemptInit = () => {
      const lenisReady = (window as any).lenisReady
      const lenisInstance = (window as any).lenis
      const isScrollTriggerReady =
        ScrollTrigger && typeof ScrollTrigger.create === 'function'

      if (isScrollTriggerReady && (lenisReady || lenisInstance)) {
        initScrollTrigger()
      } else {
        const attempts = (attemptInit as any).attempts || 0
        if (attempts < 15) {
          ;(attemptInit as any).attempts = attempts + 1
          timeoutId = setTimeout(attemptInit, 100)
        } else {
          console.warn('Initializing ScrollTrigger without Lenis')
          initScrollTrigger()
        }
      }
    }

    timeoutId = setTimeout(attemptInit, 500)

    // Refresh ScrollTrigger on window resize
    handleResize = () => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      isInitializedRef.current = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (pinTrigger) {
        try {
          pinTrigger.kill()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (scrollAnimation) {
        try {
          scrollAnimation.kill()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize)
      }
      if (ScrollTrigger && ScrollTrigger.getAll) {
        try {
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              if (trigger.vars.trigger === section) {
                trigger.kill()
              }
            } catch (e) {
              // Ignore cleanup errors
            }
          })
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [items])

  const bgImageUrl = backgroundImage?.url

  if (!items || items.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-auto lg:h-[80vh] min-h-[680px] lg:min-h-[600px] overflow-visible lg:overflow-hidden"
    >
      {/* Background Image - Fixed, never stretches */}
      {bgImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageUrl}
            alt={backgroundImage.alt || 'Why Choose Shamal background'}
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
      <div className="relative z-10 h-full container mx-auto px-4 py-14 md:py-16 lg:py-20">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Column 1: Sticky Title - Stays visible for entire section */}
          <div
            ref={leftColumnRef}
            className="flex items-center lg:sticky lg:top-1/2 lg:-translate-y-1/2 self-start lg:self-center"
          >
            <div className="space-y-6 w-full pt-3 sm:pt-4 lg:pt-0">
              <Badge variant="secondary" className="mb-4">
                {displayBadge}
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground">
                {displayTitle}
              </h2>
              {displaySubtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                  {displaySubtitle}
                </p>
              )}
              {description && (
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Animated Scrollable Content */}
          <div
            ref={rightColumnWrapperRef}
            className="relative h-auto lg:h-full overflow-visible lg:overflow-hidden"
          >
            {/* Inner wrapper that moves with scroll */}
            <div
              ref={rightColumnInnerRef}
              className="space-y-6"
              style={{ willChange: 'transform' }}
            >
              {items.map((item, index) => {
                // Handle different image formats
                let itemImage: string | null = null
                if (item.image) {
                  if (typeof item.image === 'object' && item.image !== null) {
                    if ('url' in item.image && item.image.url) {
                      // Handle absolute or relative URLs
                      itemImage = item.image.url.startsWith('http')
                        ? item.image.url
                        : item.image.url.startsWith('/')
                          ? item.image.url
                          : `/${item.image.url}`
                    } else if ('filename' in item.image && item.image.filename) {
                      itemImage = `/media/${item.image.filename}`
                    }
                  }
                }

                return (
                  <div key={index} className="why-choose-item">
                    <Card className="hover:shadow-lg transition-shadow">
                      {/* Item Image */}
                      {itemImage && (
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                          <Image
                            src={itemImage}
                            alt={item.image && typeof item.image === 'object' ? (item.image.alt || getLocalizedValue(item.title, item.titleAr, language) || 'Why choose item image') : getLocalizedValue(item.title, item.titleAr, language) || 'Why choose item image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl md:text-2xl font-display font-bold text-foreground">
                          {getLocalizedValue(item.title, item.titleAr, language)}
                        </CardTitle>
                      </CardHeader>
                      {(getLocalizedValue(item.description, item.descriptionAr, language) || getLocalizedValue(item.content, item.contentAr, language)) && (
                        <CardContent>
                          <CardDescription className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            {getLocalizedValue(item.description, item.descriptionAr, language) || getLocalizedValue(item.content, item.contentAr, language)}
                          </CardDescription>
                        </CardContent>
                      )}
                    </Card>
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
