'use client'

import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

export function ProductsSeoIntro() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language).productsSeo

  return (
    <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
      <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
        <span className="text-gradient">{t.heading}</span>
      </h2>
      <p className="text-body-large text-logo-navy font-medium leading-relaxed">{t.body}</p>
    </div>
  )
}
