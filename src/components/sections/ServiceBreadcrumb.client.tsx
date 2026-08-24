'use client'

import { LocalizedLink as Link } from '../LocalizedLink'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'

interface ServiceBreadcrumbProps {
  title?: string
  titleAr?: string
}

export function ServiceBreadcrumb({ title, titleAr }: ServiceBreadcrumbProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayTitle = getLocalizedValue(title, titleAr, language)

  return (
    <section className="container mx-auto px-4 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{t.nav.home}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/services">{t.nav.services}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  )
}
