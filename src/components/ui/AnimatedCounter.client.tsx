'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  const targetValue = typeof value === 'number' && !Number.isNaN(value) ? value : 0

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated.current || typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(targetValue)
      hasAnimated.current = true
      return
    }

    const startAnimation = () => {
      if (hasAnimated.current) return
      hasAnimated.current = true
      animateCounter(targetValue, duration, decimals, setCount)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(element)

    const rect = element.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0
    if (isInView) {
      startAnimation()
      observer.disconnect()
    }

    return () => observer.disconnect()
  }, [targetValue, duration, decimals])

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals)
    }
    return Math.floor(num).toString()
  }

  return (
    <div ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  )
}

function animateCounter(
  target: number,
  duration: number,
  decimals: number,
  setCount: (value: number) => void
) {
  const start = 0
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = start + (target - start) * easeOut

    setCount(current)

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      setCount(target)
    }
  }

  requestAnimationFrame(update)
}
