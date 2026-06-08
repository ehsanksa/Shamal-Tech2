'use client'

import React, { useEffect, useRef, type ReactNode } from 'react'

import { loadGsap } from '../../lib/animations/loadGsap'
import { cn } from '../../utilities/ui'

interface ParallaxElementProps {
  children: ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return

      const multiplier = direction === 'up' ? -1 : 1
      const yValue = speed * 100 * multiplier

      const animation = gsap.to(element, {
        y: yValue,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      cleanup = () => {
        animation.kill()
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === element) trigger.kill()
        })
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [speed, direction])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
