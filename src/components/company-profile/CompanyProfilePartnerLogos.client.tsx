'use client'

import Image from 'next/image'
import { cn } from '../../utilities/ui'
import { COMPANY_PROFILE_PARTNER_LOGOS } from '../../lib/company-profile/assets'

type CompanyProfilePartnerLogosProps = {
  className?: string
}

export function CompanyProfilePartnerLogos({ className }: CompanyProfilePartnerLogosProps) {
  return (
    <div className={cn('w-full', className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-logo-blue mb-3">
        Business Partners
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {COMPANY_PROFILE_PARTNER_LOGOS.map((logo) => (
          <div
            key={logo.src}
            className={cn(
              'relative flex h-16 md:h-20 items-center justify-center rounded-lg border border-white/15 px-3 py-2',
              logo.darkTile ? 'bg-[#0a0a0a]' : 'bg-white/95',
            )}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={140}
              height={56}
              className="max-h-10 md:max-h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
