'use client'

import type { CompanyProfileSlide } from '../../lib/company-profile/slides'
import { CompanyProfileCertLogos } from './CompanyProfileClientLogos.client'
import { CompanyProfilePartnerLogos } from './CompanyProfilePartnerLogos.client'
import { CompanyProfileOrgChart } from './CompanyProfileOrgChart.client'
import { CompanyProfileServicesGrid } from './CompanyProfileServicesGrid.client'

type ContentSlide = Extract<CompanyProfileSlide, { kind: 'content' }>

export function CompanyProfileSlideBody({ slide }: { slide: ContentSlide }) {
  return (
    <div className="max-w-5xl mx-auto px-4 w-full">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3 md:mb-4">
        {slide.title}
      </h2>
      {slide.lead && (
        <p className="text-sm md:text-base text-white/80 font-medium mb-4 md:mb-5 leading-relaxed">
          {slide.lead}
        </p>
      )}

      {slide.showCertLogos && <CompanyProfileCertLogos className="mb-5" />}

      {slide.orgChart && <CompanyProfileOrgChart chart={slide.orgChart} className="mb-4" />}

      {!slide.orgChart && slide.staff && slide.staff.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-4">
          {slide.staff.map((member) => (
            <div
              key={member.name}
              className="rounded-lg border border-white/12 bg-white/5 px-3 py-2.5 backdrop-blur-sm"
            >
              <p className="text-sm font-display font-bold text-white leading-tight">{member.name}</p>
              <p className="text-xs text-logo-blue font-medium mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      )}

      {slide.highlights && slide.highlights.length > 0 && (
        <dl className="grid gap-2 sm:grid-cols-2 mb-4 md:mb-5">
          {slide.highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-white/55">{h.label}</dt>
              <dd className="mt-1 text-xs text-white/90 font-medium leading-snug">{h.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="space-y-2 mb-4 md:mb-5">
          {slide.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5 text-xs md:text-sm text-white/85 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-logo-blue" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {slide.tags && slide.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
          {slide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-logo-blue/40 bg-logo-blue/15 px-2.5 py-0.5 text-[11px] md:text-xs font-semibold text-logo-blue"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {slide.showPartnerLogos && <CompanyProfilePartnerLogos className="mb-4" />}

      {slide.services && slide.services.length > 0 && (
        <CompanyProfileServicesGrid services={slide.services} />
      )}

      {slide.items && slide.items.length > 0 && (
        <div className="space-y-2.5 md:space-y-3 mb-4">
          {slide.items.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-white/12 bg-white/5 p-3 md:p-4 backdrop-blur-sm"
            >
              <h3 className="text-sm md:text-base font-display font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs md:text-sm text-white/75 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      )}

      {slide.caseStudies && slide.caseStudies.length > 0 && (
        <div className="space-y-4">
          {slide.caseStudies.map((cs) => (
            <article
              key={cs.title}
              className="rounded-xl border border-white/12 bg-white/5 p-3 md:p-4 backdrop-blur-sm"
            >
              <h3 className="text-sm md:text-base font-display font-bold text-logo-blue mb-2">{cs.title}</h3>
              {cs.intro && (
                <p className="text-xs md:text-sm text-white/75 leading-relaxed mb-2">{cs.intro}</p>
              )}
              <p className="text-xs md:text-sm text-white/85 leading-relaxed font-medium">{cs.narrative}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
