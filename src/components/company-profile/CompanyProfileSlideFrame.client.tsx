'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '../../utilities/ui'
import {
  COMPANY_PROFILE_COVER_WALLPAPER,
  SHAMAL_LOGO_WHITE,
} from '../../lib/company-profile/assets'

type CompanyProfileSlideFrameProps = {
  children: ReactNode
  section?: string
  /** Cover slide: full-bleed wallpaper, centered content. */
  heroLogo?: boolean
  className?: string
}

export function CompanyProfileSlideFrame({
  children,
  section,
  heroLogo = false,
  className,
}: CompanyProfileSlideFrameProps) {
  if (heroLogo) {
    return (
      <div className={cn('relative h-full w-full overflow-hidden', className)}>
        <div className="absolute inset-0">
          <Image
            src={COMPANY_PROFILE_COVER_WALLPAPER}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-black/75"
            aria-hidden
          />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl">
            <Image
              src={SHAMAL_LOGO_WHITE}
              alt="Shamal Technologies"
              width={320}
              height={60}
              className="h-14 sm:h-16 md:h-20 w-auto mx-auto opacity-95 drop-shadow-lg mb-6 md:mb-8 shrink-0"
              priority
            />
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative flex h-full w-full flex-col overflow-hidden', className)}>
      <header className="relative z-20 flex shrink-0 items-center justify-between gap-4 px-4 md:px-8 py-2">
        <Link
          href="/"
          className="shrink-0 opacity-95 hover:opacity-100 transition-opacity"
          aria-label="Shamal Technologies home"
        >
          <Image
            src={SHAMAL_LOGO_WHITE}
            alt="Shamal Technologies"
            width={200}
            height={38}
            className="h-7 w-auto sm:h-8 md:h-9"
            priority
          />
        </Link>
        {section && (
          <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/45 tabular-nums">
            {section}
          </span>
        )}
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-2 py-4">
        <div className="w-full max-w-5xl">{children}</div>
      </div>
    </div>
  )
}
