'use client'

import React, { useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { switchLocalePath } from '../../lib/i18n/locale'

export const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { language, setLanguage } = useLanguage()
  const isArabic = language === 'ar'
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleToggle = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const newLanguage = isArabic ? 'en' : 'ar'
    setLanguage(newLanguage)
    const current = typeof window !== 'undefined' ? window.location.pathname : pathname || '/'
    router.push(switchLocalePath(current, newLanguage))
    setTimeout(() => setIsTransitioning(false), 400)
  }, [isArabic, isTransitioning, setLanguage, router, pathname])

  return (
    <button
      type="button"
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle()
        }
      }}
      aria-label="Switch language"
      aria-disabled={isTransitioning}
      disabled={isTransitioning}
      dir="ltr"
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-250 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'cursor-pointer hover:scale-105 active:scale-95',
        isTransitioning && 'opacity-70 cursor-wait',
        // Light mode: subtle blue background with soft shadow
        'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(99,102,241,0.15)]',
        // Dark mode: darker blue background
        'dark:bg-gradient-to-br dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.4)]',
        className
      )}
    >
      {/* Sliding knob with neumorphic effect */}
      <span
        className={cn(
          'absolute h-7 w-7 rounded-full transition-all duration-250 ease-in-out',
          'flex items-center justify-center',
          'shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)]',
          'dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]',
          // English: knob on the left
          !isArabic && 'left-1 translate-x-0 bg-white dark:bg-slate-200',
          // Arabic: knob on the right
          isArabic && 'left-full -translate-x-8 bg-white dark:bg-slate-200'
        )}
      >
        {/* Letter inside knob */}
        <span
          className={cn(
            'text-sm font-bold transition-colors duration-250',
            !isArabic ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
          )}
        >
          {isArabic ? 'ع' : 'A'}
        </span>
      </span>

      {/* Background letters positioned on both sides - hidden when knob overlaps */}
      <div className="flex w-full items-center justify-between px-2.5 pointer-events-none">
        <span
          className={cn(
            'text-sm font-bold transition-all duration-250',
            !isArabic
              ? 'opacity-0' // Hide "A" when knob is on the left (English selected)
              : 'opacity-20 text-blue-400 dark:text-blue-500 scale-100' // Show muted "A" when Arabic is selected
          )}
        >
          A
        </span>
        <span
          className={cn(
            'text-sm font-bold transition-all duration-250',
            isArabic
              ? 'opacity-0' // Hide "ع" when knob is on the right (Arabic selected)
              : 'opacity-20 text-purple-400 dark:text-purple-500 scale-100' // Show muted "ع" when English is selected
          )}
        >
          ع
        </span>
      </div>
    </button>
  )
}

