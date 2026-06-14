'use client'

import { useEffect, useRef, useState } from 'react'

type LazyBackgroundVideoProps = {
  src: string
  poster?: string
  mimeType?: string
  className?: string
}

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px)').matches
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Defers loading large background MP4s until after first paint and near the viewport.
 * Skips video on mobile and reduced-motion — poster only.
 */
export function LazyBackgroundVideo({
  src,
  poster,
  mimeType = 'video/mp4',
  className = 'absolute inset-0 w-full h-full object-cover',
}: LazyBackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [showPosterOnly, setShowPosterOnly] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (prefersReducedMotion() || isMobileViewport()) {
      setShowPosterOnly(true)
      return
    }

    setShowPosterOnly(false)

    const scheduleLoad = () => {
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
    }

    let cleanupObserver: (() => void) | undefined
    const idleId =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(() => {
            cleanupObserver = scheduleLoad()
          })
        : (setTimeout(() => {
            cleanupObserver = scheduleLoad()
          }, 0) as unknown as number)

    return () => {
      if (typeof cancelIdleCallback !== 'undefined' && typeof idleId === 'number') {
        cancelIdleCallback(idleId)
      } else {
        clearTimeout(idleId as unknown as ReturnType<typeof setTimeout>)
      }
      cleanupObserver?.()
    }
  }, [])

  const posterClass = `${className}`
  const posterStyle = { minHeight: '100%', minWidth: '100%' } as const

  if (showPosterOnly && poster) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ minHeight: '100%', minWidth: '100%' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          className={posterClass}
          style={posterStyle}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    )
  }

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
          disablePictureInPicture
          className={className}
          style={posterStyle}
        >
          <source src={src} type={mimeType} />
        </video>
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={posterClass}
          style={posterStyle}
          fetchPriority="high"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
    </div>
  )
}
