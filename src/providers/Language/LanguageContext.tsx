'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Locale } from '../../lib/i18n/locale'

type Language = Locale

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

function applyDocumentLanguage(lang: Language) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
}

export function LanguageProvider({
  children,
  initialLanguage = 'en',
}: {
  children: React.ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  useEffect(() => {
    setLanguageState(initialLanguage)
    applyDocumentLanguage(initialLanguage)
    try {
      window.localStorage.setItem('language', initialLanguage)
    } catch {
      // ignore
    }
  }, [initialLanguage])

  const setLanguage = useCallback((lang: Language) => {
    try {
      window.localStorage.setItem('language', lang)
      applyDocumentLanguage(lang)
    } catch (e) {
      console.warn('LanguageContext: Error updating language attributes', e)
    }
    refreshScrollTriggerAfterLayoutChange()
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
