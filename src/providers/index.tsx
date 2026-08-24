import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { LanguageProvider } from './Language/LanguageContext'
import { ThemeProvider } from './Theme'
import { SmoothScrollProvider } from './SmoothScroll'
import { QuoteCartProvider } from './QuoteCart/QuoteCartContext'
import type { Locale } from '../lib/i18n/locale'

export const Providers: React.FC<{
  children: React.ReactNode
  initialLanguage?: Locale
}> = ({ children, initialLanguage = 'en' }) => {
  return (
    <ThemeProvider>
      <LanguageProvider initialLanguage={initialLanguage}>
        <QuoteCartProvider>
          <HeaderThemeProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </HeaderThemeProvider>
        </QuoteCartProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
