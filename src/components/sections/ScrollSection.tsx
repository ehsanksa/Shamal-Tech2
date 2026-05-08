import React, { ReactNode } from 'react'
import { cn } from '../../utilities/ui'

interface ScrollSectionProps {
  children: ReactNode
  className?: string
  id?: string
  fullViewport?: boolean
  heroHeight?: boolean // Reduced height for hero sections (non-homepage)
  flexible?: boolean
  bgVariant?: '1' | '2' | '3' | 'gradient'
  parallax?: boolean
}

/**
 * ScrollSection - Enhanced section component with full-viewport or flexible heights
 * Supports parallax, background variants, and smooth scroll integration
 */
export const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  className,
  id,
  fullViewport = false,
  heroHeight = false,
  flexible = false,
  bgVariant,
  parallax = false,
}) => {
  const bgClasses = {
    '1': 'section-bg-1',
    '2': 'section-bg-2',
    '3': 'section-bg-3',
    gradient: 'gradient-bg',
  }

  const sectionClasses = cn(
    'relative w-full',
    fullViewport && 'min-h-screen flex items-center justify-center py-12 md:py-16',
    heroHeight && 'min-h-[60vh] md:min-h-[70vh] flex items-center justify-center py-12 md:py-16',
    flexible && 'section-flexible',
    bgVariant && bgClasses[bgVariant],
    parallax && 'parallax-container',
    className,
  )

  return (
    <section id={id} className={sectionClasses}>
      {children}
    </section>
  )
}

