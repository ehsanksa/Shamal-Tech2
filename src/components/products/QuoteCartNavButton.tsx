'use client'

import { LocalizedLink as Link } from '@/components/LocalizedLink'
import { ClipboardList } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/providers/Language/LanguageContext'
import { useQuoteCart } from '@/providers/QuoteCart/QuoteCartContext'
import { getCommonTranslations } from '@/lib/translations/common'

export function QuoteCartNavButton() {
  const { itemCount } = useQuoteCart()
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  if (itemCount === 0) return null

  return (
    <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex gap-1.5">
      <Link href="/products/quote">
        <ClipboardList className="h-4 w-4" />
        {t.viewQuoteCart} ({itemCount})
      </Link>
    </Button>
  )
}
