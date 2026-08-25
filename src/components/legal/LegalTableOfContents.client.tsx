'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '../../utilities/ui'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { translateUiString } from '../../lib/localization'

export type LegalTocItem = {
  id: string
  title: string
}

type LegalTableOfContentsProps = {
  items: LegalTocItem[]
  label?: string
}

export function LegalTableOfContents({
  items,
  label = 'On this page',
}: LegalTableOfContentsProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const heading = label === 'On this page' ? t.onThisPage : translateUiString(label, language)
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label={heading} className="legal-toc">
      <details className="lg:hidden group rounded-xl border border-border bg-background/95 backdrop-blur-sm">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-logo-navy marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
          <span>{heading}</span>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-logo-blue transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <ul className="max-h-[min(60vh,24rem)] space-y-1 overflow-y-auto border-t border-border px-2 py-3">
          {items.map((item) => (
            <TocLink key={item.id} item={item} activeId={activeId} />
          ))}
        </ul>
      </details>

      <div className="hidden lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-logo-blue">
          {heading}
        </p>
        <ul className="max-h-[calc(100vh-10rem)] space-y-0.5 overflow-y-auto pr-2">
          {items.map((item) => (
            <TocLink key={item.id} item={item} activeId={activeId} />
          ))}
        </ul>
      </div>
    </nav>
  )
}

function TocLink({ item, activeId }: { item: LegalTocItem; activeId: string }) {
  const isActive = activeId === item.id

  return (
    <li>
      <a
        href={`#${item.id}`}
        aria-current={isActive ? 'location' : undefined}
        className={cn(
          'block rounded-md px-3 py-2 text-sm leading-snug min-h-11 lg:min-h-0 lg:py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-logo-blue/10 font-semibold text-logo-navy'
            : 'text-muted-foreground hover:bg-muted/40 hover:text-logo-navy',
        )}
      >
        {item.title}
      </a>
    </li>
  )
}
