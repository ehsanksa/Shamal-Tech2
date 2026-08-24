'use client'

import { LocalizedLink as Link } from '../LocalizedLink'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

export function ViewAllServicesButton() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
    >
      <Link href="/services">
        {t.footer.viewAllServices}
        <ArrowRight
          className={language === 'ar' ? 'mr-2 h-4 w-4 scale-x-[-1]' : 'ml-2 h-4 w-4'}
        />
      </Link>
    </Button>
  )
}
