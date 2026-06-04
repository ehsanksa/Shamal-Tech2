'use client'

import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/providers/Language/LanguageContext'
import { useQuoteCart } from '@/providers/QuoteCart/QuoteCartContext'
import { getCommonTranslations } from '@/lib/translations/common'

/** Sticky bar on /products when the quote cart has items. */
export function QuoteCartBar() {
  const { itemCount } = useQuoteCart()
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-center justify-between gap-3 rounded-full border border-primary/30 bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
        <span className="text-sm font-medium text-foreground">
          {t.viewQuoteCart} ({itemCount})
        </span>
        <Button asChild size="sm">
          <Link href="/products/quote">
            {t.reviewAndSubmit}
            <ClipboardList className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
