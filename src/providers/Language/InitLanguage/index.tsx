import Script from 'next/script'
import React from 'react'

/** URL prefix wins over localStorage so crawlers and `/ar/` pages stay Arabic. */
export const InitLanguage: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    var path = window.location.pathname || '/'
    var isArabicUrl = path === '/ar' || path.indexOf('/ar/') === 0
    var languageToSet = isArabicUrl ? 'ar' : 'en'
    var directionToSet = languageToSet === 'ar' ? 'rtl' : 'ltr'
    try {
      window.localStorage.setItem('language', languageToSet)
    } catch (e) {}
    document.documentElement.setAttribute('lang', languageToSet)
    document.documentElement.setAttribute('dir', directionToSet)
  })();
  `,
      }}
      id="language-script"
      strategy="beforeInteractive"
    />
  )
}
