'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  className?: string
}

/**
 * ScrollReveal component - Animates elements on scroll
 */
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

    // Ensure GSAP and ScrollTrigger are available
    if (typeof window === 'undefined' || !gsap || !ScrollTrigger) {
      // Fallback: make element visible if GSAP isn't available
      element.style.opacity = '1'
      element.style.transform = 'none'
      return
    }

    // Set initial state based on direction
    const initialStates: Record<string, gsap.TweenVars> = {
      up: { y: 60, opacity: 0 },
      down: { y: -60, opacity: 0 },
      left: { x: 60, opacity: 0 },
      right: { x: -60, opacity: 0 },
      fade: { opacity: 0 },
    }

    const initialState = initialStates[direction] || initialStates.up

    // Set initial state
    gsap.set(element, initialState)

    // Animate on scroll
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

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill()
        }
      })
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

/**
 * StaggerReveal component - Animates multiple children with stagger effect
 */
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

    // Ensure GSAP and ScrollTrigger are available
    if (typeof window === 'undefined' || !gsap || !ScrollTrigger) {
      // Fallback: make children visible if GSAP isn't available
      const children = Array.from(element.children) as HTMLElement[]
      children.forEach((child) => {
        child.style.opacity = '1'
        child.style.transform = 'none'
      })
      return
    }

    const children = Array.from(element.children)

    // Set initial state based on direction
    const initialStates: Record<string, gsap.TweenVars> = {
      up: { y: 60, opacity: 0 },
      down: { y: -60, opacity: 0 },
      left: { x: 60, opacity: 0 },
      right: { x: -60, opacity: 0 },
      fade: { opacity: 0 },
    }

    const initialState = initialStates[direction] || initialStates.up

    // Set initial state for all children
    gsap.set(children, initialState)

    // Animate on scroll with stagger
    const animation = gsap.to(children, {
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

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [delay, stagger, duration, direction])

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      {children}
    </div>
  )
}

/**
 * Hook to manually trigger scroll animations
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  const animate = (
    direction: 'up' | 'down' | 'left' | 'right' | 'fade' = 'up',
    delay = 0,
    duration = 1,
  ) => {
    const element = ref.current
    if (!element) return

    const initialStates: Record<string, gsap.TweenVars> = {
      up: { y: 60, opacity: 0 },
      down: { y: -60, opacity: 0 },
      left: { x: 60, opacity: 0 },
      right: { x: -60, opacity: 0 },
      fade: { opacity: 0 },
    }

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
  }

  return { ref, animate }
}

/**
 * High-impact cinematic reveal animation
 * More dramatic than standard ScrollReveal for hero sections
 */
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

    if (typeof window === 'undefined' || !gsap || !ScrollTrigger) {
      element.style.opacity = '1'
      element.style.transform = 'none'
      return
    }

    const initialProps: gsap.TweenVars = {
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

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [delay, duration, scale])

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      {children}
    </div>
  )
}

