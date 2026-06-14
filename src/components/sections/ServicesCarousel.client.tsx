'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import { getServiceImagePathBySlug } from '../../utilities/getServiceImage'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

// Simplified service type for client component (serialized)
type SerializedService = {
  id: string
  title: string | null
  titleAr?: string | null
  slug: string | null
  heroDescription: string | null
  heroDescriptionAr?: string | null
}
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../ui/carousel'

interface ServicesCarouselProps {
  services: SerializedService[]
}

export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const { language } = useLanguage()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState<number | null>(null)
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  )

  // Validate and filter services data - ensure only valid services are used
  const validServices = React.useMemo(() => {
    if (!services || !Array.isArray(services)) {
      return []
    }
    return services.filter((s): s is SerializedService => {
      return s !== null && s !== undefined && typeof s === 'object' && 'id' in s && 'title' in s
    })
  }, [services])

  // Update current index when carousel scrolls
  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Pause autoplay on hover
  const handleMouseEnter = useCallback((index: number) => {
    setIsHovered(index)
    autoplayPlugin.current.stop()
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(null)
    autoplayPlugin.current.play()
  }, [])

  // Early return if no valid services
  if (validServices.length === 0) {
    return null
  }

  // Force LTR: carousel scrolls left-to-right regardless of page RTL (Arabic)
  return (
    <div className="relative w-full" dir="ltr">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
          direction: 'ltr', // Always LTR: carousel scrolls left-to-right regardless of page RTL
        }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {validServices.map((service, index) => {
            const isActive = isHovered === index || current === index
            const imageUrl = encodeURI(getServiceImagePathBySlug(service.slug))

            return (
              <CarouselItem
                key={service.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="relative transition-all duration-500 ease-out"
                  style={{
                    transform: isActive ? 'scale(1.05)' : 'scale(0.95)',
                    opacity: isActive ? 1 : 0.75,
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="block relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-xl overflow-hidden group cursor-pointer"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={imageUrl}
                        alt={getLocalizedValue(service.title, service.titleAr, language) || 'Service'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className={`object-cover transition-transform duration-700 ease-out ${
                          isActive ? 'scale-110' : 'scale-100'
                        }`}
                        quality={80}
                      />
                      {/* Overlay gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 transition-all duration-500 ${
                          isActive ? 'opacity-95' : 'opacity-80'
                        }`}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-10 text-white z-10">
                      {/* Service Title */}
                      <h3
                        className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 transition-all duration-500 ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
                        }`}
                      >
                        {getLocalizedValue(service.title, service.titleAr, language)}
                      </h3>

                      {/* Description - Shows on hover or when centered */}
                      {(service.heroDescription || service.heroDescriptionAr) && (
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            isActive
                              ? 'max-h-96 opacity-100 translate-y-0'
                              : 'max-h-0 opacity-0 translate-y-4'
                          }`}
                        >
                          <p className="text-white/95 text-sm md:text-base lg:text-lg leading-relaxed mb-4">
                            {getLocalizedValue(
                              service.heroDescription,
                              service.heroDescriptionAr,
                              language
                            )}
                          </p>
                          <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-2 transition-all">
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      )}

                      {/* Short preview for non-active items */}
                      {!isActive && (() => {
                        const desc = getLocalizedValue(
                          service.heroDescription,
                          service.heroDescriptionAr,
                          language
                        )
                        if (!desc) return null
                        return (
                          <p className="text-white/85 text-sm md:text-base line-clamp-2 mt-2">
                            {desc.length > 120 ? `${desc.substring(0, 120)}...` : desc}
                          </p>
                        )
                      })()}
                    </div>

                    {/* Center indicator - subtle glow effect */}
                    {current === index && (
                      <div className="absolute top-4 right-4 w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
                    )}
                  </Link>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {validServices.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to service ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
