'use client'

import { useEffect, useRef, useState } from 'react'

const HERO_VIDEO_SRC = '/media/hero-banners/hero-video.mp4'
const HERO_POSTER_SRC = '/media/hero-banners/hero-contact.jpg'

/**
 * Defers loading the large hero MP4 until the section is near the viewport.
 */
export function HomeHeroBackgroundVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-black">
      {shouldLoad ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_POSTER_SRC}
          className="h-full w-full object-cover"
          style={{ minHeight: '100%', minWidth: '100%' }}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={HERO_POSTER_SRC}
          alt=""
          className="h-full w-full object-cover"
          style={{ minHeight: '100%', minWidth: '100%' }}
          fetchPriority="high"
          decoding="async"
        />
      )}
    </div>
  )
}
