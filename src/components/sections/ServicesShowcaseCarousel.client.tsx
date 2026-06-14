'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import { getServiceImagePathBySlug } from '../../utilities/getServiceImage'

type Service = {
  id: string
  title: string
  titleAr?: string | null
  slug: string
  heroDescription?: string | null
  heroDescriptionAr?: string | null
}

interface ServicesShowcaseCarouselProps {
  services: Service[]
}

export function ServicesShowcaseCarousel({ services }: ServicesShowcaseCarouselProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentService = services[currentIndex]

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying && services.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length)
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, services.length])

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % services.length)
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  if (!currentService) return null

  const imageUrl = encodeURI(getServiceImagePathBySlug(currentService.slug))

  const displayTitle = getLocalizedValue(currentService.title, currentService.titleAr, language)
  const displayDescription = getLocalizedValue(
    currentService.heroDescription,
    currentService.heroDescriptionAr,
    language
  )

  return (
    <div className="w-full">
      {/* Main Carousel Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center space-y-6 lg:space-y-8 order-2 lg:order-1">
          {/* Badge */}
          <div>
          <Badge
            variant="outline"
            className="border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider"
          >
            {t.nav.services}
          </Badge>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-logo-navy leading-tight">
            {displayTitle}
          </h2>

          {/* Description */}
          {displayDescription && (
            <p className="text-lg md:text-xl text-logo-blue font-medium leading-relaxed max-w-2xl">
              {displayDescription}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-logo-blue hover:bg-logo-blue/90 text-white px-8 py-6 text-base font-semibold group"
            >
              <Link href={`/services/${currentService.slug}`}>
                {t.learnMore}
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 flex items-center justify-center border-2 border-logo-blue/30 hover:border-logo-blue hover:bg-logo-blue/10 transition-all duration-200 rounded-lg group"
              aria-label="Previous service"
            >
              <ArrowLeft className="h-5 w-5 text-logo-blue group-hover:text-logo-navy transition-colors" />
            </button>
            <button
              onClick={goToNext}
              className="w-12 h-12 flex items-center justify-center border-2 border-logo-blue/30 hover:border-logo-blue hover:bg-logo-blue/10 transition-all duration-200 rounded-lg group"
              aria-label="Next service"
            >
              <ArrowRight className="h-5 w-5 text-logo-blue group-hover:text-logo-navy transition-colors" />
            </button>
            {/* Slide Indicators */}
            <div className="flex items-center gap-2 ml-4">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'w-8 bg-logo-blue'
                      : 'w-2 bg-logo-blue/30 hover:bg-logo-blue/50'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden order-1 lg:order-2 bg-logo-gray/10">
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
            className="object-cover"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <p className="text-white text-xl lg:text-2xl font-display font-semibold">
              {displayTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

