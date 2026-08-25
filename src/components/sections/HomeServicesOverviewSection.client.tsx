'use client'

import { Badge } from '../ui/badge'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'

type HomeServicesOverviewSectionProps = {
  title?: string | null
  titleAr?: string | null
  description?: string | null
  descriptionAr?: string | null
}

/**
 * Renders the Our Services section header with localized badge, title, and description.
 */
export function HomeServicesOverviewSection({
  title = 'Our Services',
  titleAr,
  description,
  descriptionAr,
}: HomeServicesOverviewSectionProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(title, titleAr, language) || t.ourServices
  const displayTitle = getLocalizedValue(title, titleAr, language) || t.comprehensiveSolutions
  const displayDescription = getLocalizedValue(description, descriptionAr, language)

  return (
    <div className="text-center mb-16 space-y-6">
      <Badge
        variant="outline"
        className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
      >
        {displayBadge}
      </Badge>
      <h2 className="text-display-large font-display font-bold tracking-tight text-foreground">
        <span className="text-gradient">{displayTitle}</span>
      </h2>
      {displayDescription && (
        <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
          {displayDescription}
        </p>
      )}
    </div>
  )
}
