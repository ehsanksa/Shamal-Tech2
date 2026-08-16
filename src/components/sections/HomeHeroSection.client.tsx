'use client'

import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { CinematicReveal } from '../../utilities/animations'

interface HomeHeroSectionProps {
  hero?: {
    title?: string
    titleAr?: string
    subtitle?: string
    subtitleAr?: string
  }
}

export function HomeHeroSection({ hero }: HomeHeroSectionProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const title = getLocalizedValue(hero?.title, hero?.titleAr, language)
  const subtitle = getLocalizedValue(hero?.subtitle, hero?.subtitleAr, language)

  return (
    <div className="relative z-10 container mx-auto px-4 py-20 w-full">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <CinematicReveal delay={0.15} duration={1.2}>
          <p className="text-sm md:text-base font-semibold tracking-wide text-white/90 uppercase">
            {t.seoIntro.badge} · {t.seoIntro.sellerKicker}
          </p>
        </CinematicReveal>
        <CinematicReveal delay={0.2} duration={1.5}>
          <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
            {title?.replace(/^Heading Text - /i, '') || 'Shamal Technologies'}
          </h1>
        </CinematicReveal>
        {subtitle && (
          <CinematicReveal delay={0.4} duration={1.2}>
            <p className="text-body-large text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              {subtitle}
            </p>
          </CinematicReveal>
        )}
      </div>
    </div>
  )
}
