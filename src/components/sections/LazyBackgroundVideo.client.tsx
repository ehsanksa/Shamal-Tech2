'use client'

import { useEffect, useRef, useState } from 'react'

type LazyBackgroundVideoProps = {
  src: string
  poster?: string
  mimeType?: string
  className?: string
}

/**
 * Defers loading large background MP4s until the section is near the viewport.
 */
export function LazyBackgroundVideo({
  src,
  poster,
  mimeType = 'video/mp4',
  className = 'absolute inset-0 w-full h-full object-cover',
}: LazyBackgroundVideoProps) {
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
    <div ref={containerRef} className="absolute inset-0" style={{ minHeight: '100%', minWidth: '100%' }}>
      {shouldLoad ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          className={className}
          style={{ minHeight: '100%', minWidth: '100%' }}
        >
          <source src={src} type={mimeType} />
        </video>
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={className}
          style={{ minHeight: '100%', minWidth: '100%' }}
          fetchPriority="high"
          decoding="async"
        />
      ) : null}
    </div>
  )
}
