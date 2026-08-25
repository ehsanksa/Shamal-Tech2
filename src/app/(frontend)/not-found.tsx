'use client'

import { LocalizedLink as Link } from '../../components/LocalizedLink'
import React from 'react'

import { Button } from '../../components/ui/button'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

export default function NotFound() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t.pageNotFound}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{t.goHome}</Link>
      </Button>
    </div>
  )
}
