'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '../../utilities/ui'
import { loadGsap } from '../../lib/animations/loadGsap'

interface Logo {
  id?: string
  url?: string
  alt?: string
  filename?: string
}

interface LogoSliderProps {
  logos: Logo[]
  className?: string
}

/**
 * LogoSlider - Automatic infinite scrolling logo carousel
 * Displays client/partner logos in a smooth, continuous horizontal scroll
 */
export function LogoSlider({ logos, className }: LogoSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<{ kill: () => void; pause: () => void; resume: () => void } | null>(
    null,
  )

  useEffect(() => {
    if (!trackRef.current || !containerRef.current || logos.length === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const track = trackRef.current
    const container = containerRef.current
    let cancelled = false
    let animation: { kill: () => void; pause: () => void; resume: () => void } | null = null
    let cleanup: (() => void) | null = null
    let rafId = 0

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return

      const initAnimation = () => {
        const totalLogosInSet = logos.length
        let singleSetWidth = 0

        for (let i = 0; i < totalLogosInSet; i++) {
          const child = track.children[i] as HTMLElement
          if (child) {
            singleSetWidth += child.offsetWidth + 16
          }
        }

        if (singleSetWidth === 0) {
          singleSetWidth = track.scrollWidth / 3
        }

        const speed = 30

        animation = gsap.to(track, {
          x: -singleSetWidth,
          duration: singleSetWidth / speed,
          ease: 'none',
          repeat: -1,
        })

        animationRef.current = animation

        const handleMouseEnter = () => {
          animation?.pause()
        }

        const handleMouseLeave = () => {
          animation?.resume()
        }

        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        cleanup = () => {
          animation?.kill()
          container.removeEventListener('mouseenter', handleMouseEnter)
          container.removeEventListener('mouseleave', handleMouseLeave)
        }
      }

      rafId = requestAnimationFrame(() => {
        requestAnimationFrame(initAnimation)
      })
    })

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      cleanup?.()
      animation?.kill()
    }
  }, [logos])

  if (!logos || logos.length === 0) return null

  const logosToRender = [...logos, ...logos, ...logos]

  return (
    <section
      ref={containerRef}
      className={cn(
        'client-service-section md:py-[40px] py-[20px] md:px-[60px] px-[20px] bg-[#fafafa] overflow-hidden',
        className
      )}
      role="region"
      aria-label="Client logos"
      aria-roledescription="carousel"
    >
      <div className="relative" role="region" aria-roledescription="carousel">
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex md:-ml-4 -ml-8"
            dir="ltr"
            role="group"
          >
            {logosToRender.map((logo, index) => {
              const imageUrl =
                logo.url ||
                (logo.filename ? `/media/${logo.filename}` : '') ||
                ''

              if (!imageUrl) return null

              return (
                <div
                  key={`${logo.id || index}-${Math.floor(index / logos.length)}`}
                  role="group"
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 pl-4 2xl:basis-1/6 xl:basis-1/6 lg:basis-1/5 md:basis-1/4 basis-1/3 md:ps-4 ps-8 justify-center flex"
                >
                  <Image
                    src={imageUrl}
                    alt={logo.alt || `Client logo ${index + 1}`}
                    width={120}
                    height={80}
                    className="3xl:h-[80px] lg:h-[70px] h-[50px] w-auto object-contain select-none grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                    loading="lazy"
                    unoptimized
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
