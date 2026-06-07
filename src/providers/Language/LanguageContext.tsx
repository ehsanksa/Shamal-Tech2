'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

/**
 * Refreshes GSAP ScrollTrigger after layout changes (e.g. RTL/LTR toggle).
 * Loads GSAP only when needed so it is not in the root client bundle.
 */
function refreshScrollTriggerAfterLayoutChange() {
  if (typeof window === 'undefined') return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      void import('gsap/ScrollTrigger')
        .then(({ ScrollTrigger }) => {
          try {
            ScrollTrigger.refresh(true)
          } catch {
            // Ignore - layout may still be settling
          }
        })
        .catch(() => {})
    })
  })
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('language')) || 'en'
    setLanguageState((saved === 'ar' ? 'ar' : 'en') as Language)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('language', lang)
        document.documentElement.setAttribute('lang', lang)
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
      } catch (e) {
        console.warn('LanguageContext: Error updating language attributes', e)
      }
      refreshScrollTriggerAfterLayoutChange()
    }
    setLanguageState(lang)
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return { language: 'en' as Language, setLanguage: () => {} }
  }
  return ctx
}
