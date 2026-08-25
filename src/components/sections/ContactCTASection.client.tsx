'use client'

import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { CinematicReveal } from '../../utilities/animations'
import { ParallaxElement } from './ParallaxElement'
import { ScrollSection } from './ScrollSection'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ArrowRight } from 'lucide-react'

interface ContactCTASectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  primaryCtaText?: string
  primaryCtaTextAr?: string
  secondaryCtaText?: string
  secondaryCtaTextAr?: string
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
}

export function ContactCTASection({
  badge = 'Get In Touch',
  badgeAr,
  title = 'Ready to Get Started?',
  titleAr,
  description,
  descriptionAr,
  primaryCtaText = 'Contact Us Today',
  primaryCtaTextAr,
  secondaryCtaText = 'Explore Services',
  secondaryCtaTextAr,
  backgroundImage,
}: ContactCTASectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const displayPrimaryCta = getLocalizedValue(primaryCtaText, primaryCtaTextAr, language)
  const displaySecondaryCta = getLocalizedValue(secondaryCtaText, secondaryCtaTextAr, language)
  const isRtl = language === 'ar'

  return (
    <ScrollSection id="contact" fullViewport bgVariant="gradient" parallax>
      {backgroundImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'Contact CTA background'}
            fill
            className="object-cover opacity-20"
            priority={false}
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-logo-blue/20 via-logo-navy/10 to-background/80" />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.2} duration={1.2} scale>
            <Card className="max-w-4xl mx-auto border-2 border-logo-blue/30 shadow-2xl bg-background/95 backdrop-blur-sm">
              <CardHeader className="text-center space-y-6">
                <Badge
                  variant="outline"
                  className="w-fit mx-auto border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                >
                  {displayBadge}
                </Badge>
                <CardTitle className="text-display-large font-display font-bold text-foreground">
                  <span className="text-gradient">{displayTitle}</span>
                </CardTitle>
                {displayDescription && (
                  <CardDescription className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                    {displayDescription}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90"
                  >
                    <Link href="/contact">
                      {displayPrimaryCta}
                      <ArrowRight
                        className={isRtl ? 'mr-2 h-4 w-4 rotate-180' : 'ml-2 h-4 w-4'}
                      />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-14 border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
                  >
                    <Link href="/services">{displaySecondaryCta}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CinematicReveal>
        </ParallaxElement>
      </div>
    </ScrollSection>
  )
}
