'use client'

import Image from 'next/image'
import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { translateUiString } from '../../lib/localization'
import {
  COMPANY_PROFILE_CERT_LOGOS,
  COMPANY_PROFILE_CLIENT_LOGOS,
} from '../../lib/company-profile/assets'

type LogosProps = {
  className?: string
  label?: string
}

/** Client logos — used only on the dedicated clients slide. */
export function CompanyProfileClientLogos({ className, label }: LogosProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && <p className="sr-only">{label}</p>}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        {COMPANY_PROFILE_CLIENT_LOGOS.map((logo) => (
          <div
            key={logo.src}
            className="relative aspect-[5/3] rounded-lg border border-white/15 bg-white/95 px-2 py-2 shadow-sm"
          >
            <Image src={logo.src} alt={logo.alt} fill className="object-contain p-1.5" sizes="120px" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Accreditation logos — qualifications slide only. */
export function CompanyProfileCertLogos({
  className,
  label = 'Accreditations & compliance',
}: LogosProps) {
  const { language } = useLanguage()
  const heading = translateUiString(label, language)
  return (
    <div className={cn('w-full', className)}>
      {heading && (
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">{heading}</p>
      )}
      <div className="flex flex-wrap items-center gap-6 md:gap-10">
        {COMPANY_PROFILE_CERT_LOGOS.map((logo) => (
          <div
            key={logo.src}
            className="relative h-12 w-28 md:h-14 md:w-36 rounded-lg bg-white/95 px-3 py-2"
          >
            <Image src={logo.src} alt={logo.alt} fill className="object-contain p-1" sizes="144px" />
          </div>
        ))}
      </div>
    </div>
  )
}
