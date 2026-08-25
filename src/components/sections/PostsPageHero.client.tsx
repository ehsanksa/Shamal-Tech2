'use client'

import { Badge } from '../ui/badge'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'

interface PostsPageHeroProps {
  badge?: string | null
  badgeAr?: string | null
  title?: string | null
  titleAr?: string | null
  description?: string | null
  descriptionAr?: string | null
}

export function PostsPageHero({
  badge,
  badgeAr,
  title = 'Blog Posts',
  titleAr,
  description,
  descriptionAr,
}: PostsPageHeroProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayBadge = getLocalizedValue(badge, badgeAr, language) || t.insights
  const displayTitle = getLocalizedValue(title, titleAr, language) || t.nav.blogs
  const displayDescription = getLocalizedValue(description, descriptionAr, language)

  return (
    <ParallaxElement speed={0.2} direction="up">
      <CinematicReveal delay={0.1} duration={1.2}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge
            variant="outline"
            className="mb-6 border-white/30 text-white bg-white/10 mt-20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold"
          >
            {displayBadge}
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-white drop-shadow-lg">
            {displayTitle}
          </h1>
          {displayDescription && (
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
              {displayDescription}
            </p>
          )}
        </div>
      </CinematicReveal>
    </ParallaxElement>
  )
}
