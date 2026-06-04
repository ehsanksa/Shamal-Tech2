import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { LanguageProvider } from './Language/LanguageContext'
import { ThemeProvider } from './Theme'
import { SmoothScrollProvider } from './SmoothScroll'
import { QuoteCartProvider } from './QuoteCart/QuoteCartContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QuoteCartProvider>
          <HeaderThemeProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </HeaderThemeProvider>
        </QuoteCartProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
