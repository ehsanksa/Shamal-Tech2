'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

import { Button } from '../ui/button'
import { cn } from '../../utilities/ui'
import {
  exportCompanyProfilePdf,
  exportCompanyProfilePptx,
  type PresentationExportFormat,
} from '../../lib/company-profile/export-presentation'
import { COMPANY_PROFILE_SLIDES, type CompanyProfileSlide } from '../../lib/company-profile/slides'
import { CompanyProfileClientLogos } from './CompanyProfileClientLogos.client'
import { CompanyProfileSlideBody } from './CompanyProfileSlideBody.client'
import { CompanyProfileSlideFrame } from './CompanyProfileSlideFrame.client'

type ContactInfo = {
  phone?: string
  email?: string
  address?: string
  website?: string
}

type CompanyProfileDeckProps = {
  contactInfo?: ContactInfo
}

function getSlideSection(slide: CompanyProfileSlide): string | undefined {
  if (slide.kind === 'cover') return undefined
  return slide.section
}

function SlideContent({ slide, contactInfo }: { slide: CompanyProfileSlide; contactInfo?: ContactInfo }) {
  if (slide.kind === 'cover') {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70 mb-3">
          {slide.subtitle}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-5">
          {slide.title}
        </h1>
        <p className="text-base md:text-lg text-white/85 font-medium leading-relaxed max-w-3xl mb-6">
          {slide.tagline}
        </p>
        <p className="text-sm text-white/60 leading-relaxed max-w-md flex items-start gap-2 justify-center">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-logo-blue" aria-hidden />
          <span>{slide.address}</span>
        </p>
      </div>
    )
  }

  if (slide.kind === 'clients') {
    return (
      <div className="max-w-5xl mx-auto px-4 w-full">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-3 md:mb-4 text-center">
          {slide.title}
        </h2>
        {slide.lead && (
          <p className="text-sm md:text-base text-white/80 font-medium mb-6 leading-relaxed text-center max-w-3xl mx-auto">
            {slide.lead}
          </p>
        )}
        <CompanyProfileClientLogos />
      </div>
    )
  }

  if (slide.kind === 'contact') {
    const website = contactInfo?.website ?? `https://${slide.website}`
    const websiteDisplay = slide.website

    return (
      <div className="max-w-4xl mx-auto px-4 w-full">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">{slide.title}</h2>

        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {slide.contacts.map((person) => (
            <a
              key={person.email}
              href={`mailto:${person.email}`}
              className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-logo-blue/50 hover:bg-white/10"
            >
              <p className="text-base font-display font-bold text-white">{person.name}</p>
              <p className="text-xs text-logo-blue font-semibold mt-0.5">{person.role}</p>
              <p className="text-sm text-white/75 mt-2 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {person.email}
              </p>
            </a>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {contactInfo?.address && (
            <div className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm sm:col-span-2">
              <MapPin className="h-5 w-5 shrink-0 text-logo-blue" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                  Head office
                </p>
                <p className="text-sm text-white/90 leading-relaxed">{contactInfo.address}</p>
              </div>
            </div>
          )}
          {contactInfo?.phone && (
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
              className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10"
            >
              <Phone className="h-5 w-5 shrink-0 text-logo-blue" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">Phone</p>
                <p className="text-sm text-white/90">{contactInfo.phone}</p>
              </div>
            </a>
          )}
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10"
          >
            <ExternalLink className="h-5 w-5 shrink-0 text-logo-blue" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">Website</p>
              <p className="text-sm text-white/90">{websiteDisplay}</p>
            </div>
          </a>
        </div>

      </div>
    )
  }

  return <CompanyProfileSlideBody slide={slide} />
}

export function CompanyProfileDeck({ contactInfo }: CompanyProfileDeckProps) {
  const total = COMPANY_PROFILE_SLIDES.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exportingFormat, setExportingFormat] = useState<PresentationExportFormat | null>(null)
  const touchStartX = useRef<number | null>(null)
  const captureRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, total - 1)))
  }, [total])

  const goNext = useCallback(() => {
    goTo(currentIndex + 1)
  }, [currentIndex, goTo])

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1)
  }, [currentIndex, goTo])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(total - 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev, goTo, total])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current
    if (start == null) return
    const end = e.changedTouches[0]?.clientX
    if (end == null) return
    const delta = end - start
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  const isCoverSlide = currentIndex === 0

  const isExporting = exportingFormat !== null

  const handleDownload = useCallback(
    async (format: PresentationExportFormat) => {
      if (isExporting) return

      const savedIndex = currentIndex
      setExportingFormat(format)

      try {
        const options = {
          slideCount: total,
          setSlideIndex: goTo,
          captureRef,
        }

        if (format === 'pdf') {
          await exportCompanyProfilePdf(options)
        } else {
          await exportCompanyProfilePptx(options)
        }
      } catch (error) {
        console.error(`Company profile ${format.toUpperCase()} export failed:`, error)
        window.alert(`Could not generate the ${format.toUpperCase()}. Please try again.`)
      } finally {
        goTo(savedIndex)
        setExportingFormat(null)
      }
    },
    [currentIndex, goTo, isExporting, total],
  )

  return (
    <section
      className={cn(
        'relative flex h-full w-full min-h-0 flex-col overflow-hidden',
        isCoverSlide ? 'bg-black' : 'bg-gradient-to-br from-logo-navy via-[#0c1f3d] to-logo-blue',
      )}
      aria-roledescription="carousel"
      aria-label="Company profile presentation"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {!isCoverSlide && (
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-logo-blue/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-logo-navy/60 blur-3xl" />
        </div>
      )}

      {!isExporting && (
        <div className="relative z-10 flex items-center justify-between gap-4 px-4 md:px-8 py-3 border-b border-white/10 shrink-0">
          <span className="text-sm font-medium text-white/70 tabular-nums">
            {currentIndex + 1} / {total}
          </span>
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => void handleDownload('pdf')}
              disabled={isExporting}
              className="inline-flex items-center gap-2 text-sm font-semibold text-logo-blue hover:text-white transition-colors disabled:opacity-60 disabled:pointer-events-none"
            >
              <Download className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => void handleDownload('pptx')}
              disabled={isExporting}
              className="inline-flex items-center gap-2 text-sm font-semibold text-logo-blue hover:text-white transition-colors disabled:opacity-60 disabled:pointer-events-none"
            >
              <Download className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Download PPTX</span>
            </button>
          </div>
        </div>
      )}

      <div
        ref={captureRef}
        className={cn(
          'relative z-10 min-h-0 flex-1 overflow-hidden',
          isCoverSlide ? 'bg-black' : 'bg-gradient-to-br from-logo-navy via-[#0c1f3d] to-logo-blue',
        )}
      >
        {!isCoverSlide && (
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-logo-blue/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-logo-navy/60 blur-3xl" />
          </div>
        )}

        <div
          className={cn(
            'relative z-10 flex h-full min-h-full',
            isExporting ? 'transition-none' : 'transition-transform duration-500 ease-out',
          )}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {COMPANY_PROFILE_SLIDES.map((s, i) => (
            <div
              key={s.id}
              className="h-full min-h-full w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={i !== currentIndex}
            >
              <CompanyProfileSlideFrame section={getSlideSection(s)} heroLogo={s.kind === 'cover'}>
                <SlideContent slide={s} contactInfo={contactInfo} />
              </CompanyProfileSlideFrame>
            </div>
          ))}
        </div>
      </div>

      {isExporting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Generating {exportingFormat?.toUpperCase()} from presentation…
          </p>
        </div>
      )}

      {!isExporting && (
        <div className="relative z-10 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="border-white/25 bg-white/5 text-white hover:bg-white/15 disabled:opacity-40"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goNext}
            disabled={currentIndex === total - 1}
            className="border-white/25 bg-white/5 text-white hover:bg-white/15 disabled:opacity-40"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <span className="hidden sm:inline text-xs text-white/50 ml-2">Arrow keys · swipe · space</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[50vw] sm:max-w-none overflow-x-auto" role="tablist" aria-label="Slide navigation">
          {COMPANY_PROFILE_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}: ${s.kind === 'cover' ? 'Cover' : 'title' in s ? s.title : ''}`}
              onClick={() => goTo(idx)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 shrink-0',
                idx === currentIndex ? 'w-6 bg-logo-blue' : 'w-2 bg-white/35 hover:bg-white/55',
              )}
            />
          ))}
        </div>

        {currentIndex < total - 1 && (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Next
            <ChevronDown className="h-4 w-4 rotate-[-90deg]" aria-hidden />
          </button>
        )}
      </div>
      )}
    </section>
  )
}
