'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'

type LeadershipMember = {
  name?: string
  nameAr?: string
  position?: string
  positionAr?: string
  role?: string
  bio?: string
  bioAr?: string
  imageUrl?: string | null
  imageAlt?: string
}

interface LeadershipCarouselProps {
  members: LeadershipMember[]
}

export function LeadershipCarousel({ members }: LeadershipCarouselProps) {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate how many slides to show based on screen size
  const getSlidesToShow = () => {
    if (typeof window === 'undefined') return 1
    if (window.innerWidth >= 1024) return 3 // lg
    if (window.innerWidth >= 768) return 2 // md
    return 1 // mobile
  }

  const [slidesToShow, setSlidesToShow] = useState(1)

  useEffect(() => {
    const updateSlidesToShow = () => {
      setSlidesToShow(getSlidesToShow())
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)
    return () => window.removeEventListener('resize', updateSlidesToShow)
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered && members.length > slidesToShow) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, members.length - slidesToShow)
          return prev >= maxIndex ? 0 : prev + 1
        })
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, isHovered, members.length, slidesToShow])


  const scrollNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, members.length - slidesToShow)
      if (maxIndex === 0) return 0
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const scrollPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, members.length - slidesToShow)
      if (maxIndex === 0) return 0
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const maxIndex = Math.max(0, members.length - slidesToShow)
  const canScrollPrev = currentIndex > 0 || (maxIndex > 0 && currentIndex === maxIndex)
  const canScrollNext = currentIndex < maxIndex || (maxIndex > 0 && currentIndex === 0)

  // Calculate translate percentage based on slide basis
  const getTranslatePercent = () => {
    if (slidesToShow === 1) return currentIndex * 100
    if (slidesToShow === 2) return currentIndex * 50
    return currentIndex * (100 / 3) // For 3 slides
  }

  if (members.length === 0) return null

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden" ref={carouselRef}>
        <div
          className="flex md:-ml-4 -ml-2 transition-transform duration-500 ease-in-out"
          dir="ltr"
          style={{
            transform: `translateX(-${getTranslatePercent()}%)`,
          }}
        >
          {members.map((member, index) => {
            const displayName = getLocalizedValue(member.name, member.nameAr, language)
            const displayPosition = getLocalizedValue(
              member.position || member.role,
              member.positionAr,
              language
            )
            const displayBio = getLocalizedValue(member.bio, member.bioAr, language)
            const imageUrl = member.imageUrl ?? undefined

            return (
              <div
                key={index}
                role="group"
                aria-roledescription="slide"
                className="min-w-0 shrink-0 grow-0 basis-full pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 py-3"
              >
                <div className="people-item-main select-none lg:p-5 p-[10px] duration-300 lg:bg-[#fafafa] bg-[#f5f5f5] lg:shadow-none rounded-[10px] relative group overflow-hidden h-full flex flex-col">
                  {/* Image Container */}
                  <div className="img-div w-full 3xl:h-[450px] 2xl:h-[380px] xl:h-[320px] lg:h-[280px] md:h-[330px] h-[300px] rounded-lg overflow-hidden relative bg-white">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={member.imageAlt || displayName || 'Team member'}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                        loading="lazy"
                        unoptimized={imageUrl.includes('?v=')}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-logo-blue/20 to-logo-navy/20 flex items-center justify-center">
                        <span className="text-logo-navy font-medium">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Name and Position (visible by default, moves on hover) */}
                  <div className="flex flex-col relative z-10">
                    <h5 className="2xl:text-2xl xl:text-xl lg:text-lg md:text-lg text-base max-[380px]:text-sm font-bold pt-2 opacity-100 group-hover:opacity-0 transition-all duration-300 lg:text-start text-center text-logo-navy">
                      {displayName}
                    </h5>
                    <h6 className="xl:text-base lg:text-sm md:text-sm text-xs max-[380px]:text-xs font-normal opacity-100 group-hover:opacity-0 transition-all duration-300 lg:text-start text-center text-logo-blue">
                      {displayPosition}
                    </h6>
                  </div>

                  {/* Hover Overlay with Bio - covers entire card */}
                  <div className="people-overlay bg-[#002340ea] flex flex-col justify-center w-full h-full lg:p-[30px] p-5 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 rounded-[10px]">
                    <h6 className="3xl:text-[28px] 2xl:text-2xl md:text-lg xl:text-xl lg:text-lg text-base max-[380px]:text-sm font-bold text-white text-start mb-4">
                      {displayName}
                    </h6>
                    {displayBio && (
                      <div className="main-para 3xl:!text-lg 2xl:!text-base lg:!text-sm md:!text-sm !text-white font-light text-start leading-relaxed overflow-y-auto">
                        {displayBio}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev && currentIndex === 0}
        className={cn(
          'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none absolute rounded-full top-1/2 -translate-y-1/2 md:flex hidden carousel-prev left-[-15px] 3xl:size-10 size-[30px] justify-center items-center border border-slate-200 bg-white hover:bg-logo-blue hover:border-0 hover:text-white shadow-lg disabled:opacity-0 z-10'
        )}
        aria-label="Previous slide"
      >
        <ArrowLeft className="3xl:w-5 3xl:h-5 w-4 h-4" />
        <span className="sr-only">Previous slide</span>
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          'whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none absolute rounded-full top-1/2 -translate-y-1/2 md:flex hidden carousel-next right-[-15px] 3xl:size-10 size-[30px] justify-center items-center border border-slate-200 bg-white hover:bg-logo-blue hover:border-0 hover:text-white shadow-lg disabled:opacity-0 z-10'
        )}
        aria-label="Next slide"
      >
        <ArrowRight className="3xl:w-5 3xl:h-5 w-4 h-4" />
        <span className="sr-only">Next slide</span>
      </button>
    </div>
  )
}

