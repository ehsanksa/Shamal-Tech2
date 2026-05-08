'use client'

import { Badge } from '../ui/badge'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'
import { LeadershipCarousel } from './LeadershipCarousel.client'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

interface LeadershipMember {
  name?: string
  nameAr?: string
  position?: string
  positionAr?: string
  role?: string
  bio?: string
  bioAr?: string
  image?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
  } | string | null
  imageWhiteBg?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
  } | string | null
}

interface LeadershipSectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  members: LeadershipMember[]
}

const DEFAULT_DESCRIPTION =
  'Built upon over 25 years of industry experience, our team actively forms trusted partnerships, fosters a culture of innovation, and relentlessly pursues excellence.'

export function LeadershipSection({
  badge = 'OUR PEOPLE',
  badgeAr,
  title = 'Meet the Team Driving the Vision',
  titleAr,
  description = DEFAULT_DESCRIPTION,
  descriptionAr,
  members,
}: LeadershipSectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)

  return (
    <>
      <ParallaxElement speed={0.3} direction="up">
        <CinematicReveal delay={0.2} duration={1.2}>
          <div className="text-center mb-16 space-y-6 pt-6 sm:pt-8">
            <Badge
              variant="outline"
              className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
            >
              {displayBadge}
            </Badge>
            <h2 className="text-display-large font-display font-bold tracking-tight text-foreground">
              {displayTitle}
            </h2>
            {displayDescription && (
              <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                {displayDescription}
              </p>
            )}
          </div>
        </CinematicReveal>
      </ParallaxElement>
      <div className="people-carousel-section md:pt-5 pt-0">
        <LeadershipCarousel members={members} />
      </div>
    </>
  )
}
