'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Brain,
  Car,
  Droplets,
  Fuel,
  HardHat,
  Layers3,
  Leaf,
  Map,
  Mountain,
  Plane,
  ScanSearch,
  Shield,
  Sparkles,
  Sprout,
} from 'lucide-react'

import { cn } from '../../utilities/ui'
import type { CompanyProfileServiceItem } from '../../lib/company-profile/slides'

const SERVICE_ICON_MAP: Record<CompanyProfileServiceItem['icon'], LucideIcon> = {
  inspection: ScanSearch,
  'cad-bim': Layers3,
  agriculture: Sprout,
  construction: HardHat,
  environmental: Leaf,
  ai: Brain,
  bathymetric: Droplets,
  mining: Mountain,
  special: Sparkles,
  aerial: Plane,
  security: Shield,
  gis: Map,
  'oil-gas': Fuel,
  traffic: Car,
}

type CompanyProfileServicesGridProps = {
  services: CompanyProfileServiceItem[]
  className?: string
}

export function CompanyProfileServicesGrid({ services, className }: CompanyProfileServicesGridProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3', className)}>
      {services.map((service) => {
        const Icon = SERVICE_ICON_MAP[service.icon]
        return (
          <div
            key={service.label}
            className="flex flex-col items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-2 py-3 md:px-3 md:py-4 backdrop-blur-sm text-center"
          >
            <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-logo-blue/20 text-logo-blue">
              <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
            </div>
            <p className="text-[11px] md:text-xs font-semibold text-white/90 leading-snug">{service.label}</p>
          </div>
        )
      })}
    </div>
  )
}
