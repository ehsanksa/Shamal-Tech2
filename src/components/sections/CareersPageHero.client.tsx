'use client'

import { Badge } from '../ui/badge'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'

interface CareersPageHeroProps {
  badge?: string | null
  badgeAr?: string | null
  title?: string | null
  titleAr?: string | null
  description?: string | null
  descriptionAr?: string | null
}

export function CareersPageHero({
  badge,
  badgeAr,
  title = 'Careers',
  titleAr,
  description,
  descriptionAr,
}: CareersPageHeroProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(badge, badgeAr, language) || t.joinOurTeam
  const displayTitle = getLocalizedValue(title, titleAr, language) || t.nav.careers
  const displayDescription = getLocalizedValue(description, descriptionAr, language)

  return (
    <ParallaxElement speed={0.2} direction="up">
      <CinematicReveal delay={0.1} duration={1.2}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="mb-4 text-sm border-logo-navy/30 text-logo-navy bg-white/95 backdrop-blur-sm dark:border-white/30 dark:text-white dark:bg-white/10">
            {displayBadge}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            {displayTitle}
          </h1>
          {displayDescription && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {displayDescription}
            </p>
          )}
        </div>
      </CinematicReveal>
    </ParallaxElement>
  )
}
