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
import { Media } from '../Media'
import RichText from '../RichText'
import { ArrowRight } from 'lucide-react'

interface AboutPreviewSectionProps {
  badge?: string
  badgeAr?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  textColumn?: any
  textColumnAr?: any
  imageColumn?: {
    id?: string
    url?: string
    filename?: string
    alt?: string
    mimeType?: string
  } | string | null
  ctaText?: string
  ctaTextAr?: string
  backgroundImage?: {
    url?: string
    alt?: string
  } | null
}

export function AboutPreviewSection({
  badge = 'Who We Are?',
  badgeAr,
  title = 'About Shamal Technologies',
  titleAr,
  description,
  descriptionAr,
  textColumn,
  textColumnAr,
  imageColumn,
  ctaText = 'Learn More About Us',
  ctaTextAr,
  backgroundImage,
}: AboutPreviewSectionProps) {
  const { language } = useLanguage()
  const displayBadge = getLocalizedValue(badge, badgeAr, language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const displayCtaText = getLocalizedValue(ctaText, ctaTextAr, language)
  const textContent = language === 'ar' && textColumnAr ? textColumnAr : textColumn
  const isRtl = language === 'ar'

  return (
    <ScrollSection id="about" fullViewport bgVariant="3" parallax>
      {backgroundImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'About preview background'}
            fill
            className="object-cover opacity-20"
            priority={false}
            quality={85}
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <ParallaxElement speed={0.2} direction="up">
          <CinematicReveal delay={0.2} duration={1.2}>
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <Badge
                  variant="outline"
                  className="w-fit mx-auto border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 mt-20 text-sm font-semibold"
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

              {(imageColumn || textContent) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-12">
                  {imageColumn && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shadow-lg">
                      {typeof imageColumn === 'object' &&
                      imageColumn !== null &&
                      (imageColumn.url || imageColumn.filename || imageColumn.id) ? (
                        <Media
                          resource={imageColumn as any}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                          videoClassName="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No media selected
                        </div>
                      )}
                    </div>
                  )}

                  {textContent && (
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <RichText data={textContent} enableGutter={false} />
                    </div>
                  )}
                </div>
              )}

              <div className="text-center pt-8">
                <Button asChild size="lg" className="bg-logo-blue hover:bg-logo-blue/90">
                  <Link href="/about">
                    {displayCtaText}
                    <ArrowRight
                      className={isRtl ? 'mr-2 h-4 w-4 rotate-180' : 'ml-2 h-4 w-4'}
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </CinematicReveal>
        </ParallaxElement>
      </div>
    </ScrollSection>
  )
}
