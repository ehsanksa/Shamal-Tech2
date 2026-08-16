'use client'

import { Badge } from '../ui/badge'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'

interface ProductsPageHeroProps {
  badge?: string | null
  badgeAr?: string | null
  title?: string | null
  titleAr?: string | null
  subtitle?: string | null
  subtitleAr?: string | null
}

export function ProductsPageHero({
  badge,
  badgeAr,
  title = 'DJI Products',
  titleAr,
  subtitle,
  subtitleAr,
}: ProductsPageHeroProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(badge, badgeAr, language) || t.nav.products
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displaySubtitle =
    getLocalizedValue(subtitle, subtitleAr, language) ||
    (language === 'ar'
      ? 'بائع طائرات DJI المعتمد وبائع منتجات DJI المعتمد في السعودية. تصفح طائرات المؤسسات والحمولات وتقنية الحلول الجيومكانية.'
      : 'Authorized DJI drones seller and authorized DJI products seller in Saudi Arabia. Browse enterprise drones, payloads, and geospatial technology.')

  return (
    <ParallaxElement speed={0.2} direction="up">
      <CinematicReveal delay={0.1} duration={1.2}>
        <div className="container mx-auto px-4 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge
              variant="outline"
              className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
            >
              {displayBadge}
            </Badge>
            <h1 className="text-hero font-display font-bold tracking-tight text-white drop-shadow-2xl">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="text-body-large text-white/95 max-w-3xl mx-auto font-medium drop-shadow-lg">
                {displaySubtitle}
              </p>
            )}
          </div>
        </div>
      </CinematicReveal>
    </ParallaxElement>
  )
}
