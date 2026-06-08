'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { loadGsap } from '../lib/animations/loadGsap'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  className?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 1,
  direction = 'up',
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return

      const initialStates = {
        up: { y: 60, opacity: 0 },
        down: { y: -60, opacity: 0 },
        left: { x: 60, opacity: 0 },
        right: { x: -60, opacity: 0 },
        fade: { opacity: 0 },
      } as const

      const initialState = initialStates[direction] || initialStates.up
      gsap.set(element, initialState)

      const animation = gsap.to(element, {
        ...initialState,
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
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
  }, [delay, duration, direction])

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      {children}
    </div>
  )
}

interface StaggerRevealProps {
  children: ReactNode
  delay?: number
  stagger?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  className?: string
}

export function StaggerReveal({
  children,
  delay = 0,
  stagger = 0.1,
  duration = 0.8,
  direction = 'up',
  className = '',
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return

      const childEls = Array.from(element.children)
      const initialStates = {
        up: { y: 60, opacity: 0 },
        down: { y: -60, opacity: 0 },
        left: { x: 60, opacity: 0 },
        right: { x: -60, opacity: 0 },
        fade: { opacity: 0 },
      } as const

      const initialState = initialStates[direction] || initialStates.up
      gsap.set(childEls, initialState)

      const animation = gsap.to(childEls, {
        ...initialState,
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
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
  }, [delay, stagger, duration, direction])

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      {children}
    </div>
  )
}

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  const animate = (
    direction: 'up' | 'down' | 'left' | 'right' | 'fade' = 'up',
    delay = 0,
    duration = 1,
  ) => {
    const element = ref.current
    if (!element) return

    void loadGsap().then(({ gsap }) => {
      const initialStates = {
        up: { y: 60, opacity: 0 },
        down: { y: -60, opacity: 0 },
        left: { x: 60, opacity: 0 },
        right: { x: -60, opacity: 0 },
        fade: { opacity: 0 },
      } as const

      const initialState = initialStates[direction] || initialStates.up
      gsap.set(element, initialState)
      gsap.to(element, {
        ...initialState,
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }

  return { ref, animate }
}

interface CinematicRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  scale?: boolean
  className?: string
}

export function CinematicReveal({
  children,
  delay = 0,
  duration = 1.5,
  scale = false,
  className = '',
}: CinematicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return

      const initialProps = {
        y: 100,
        opacity: 0,
        ...(scale && { scale: 0.8 }),
      }

      gsap.set(element, initialProps)

      const animation = gsap.to(element, {
        y: 0,
        opacity: 1,
        ...(scale && { scale: 1 }),
        duration,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
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
  }, [delay, duration, scale])

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      {children}
    </div>
  )
}
