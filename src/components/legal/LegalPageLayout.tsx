import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { LegalBlock, LegalDocument, LegalSection } from '../../lib/legal/types'
import { Badge } from '../ui/badge'
import { LegalRichText } from './LegalRichText'
import { LegalTableOfContents } from './LegalTableOfContents.client'

type LegalPageLayoutProps = {
  document: LegalDocument
}

function flattenToc(sections: LegalSection[]) {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
  }))
}

function BlockList({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <LegalRichText
              key={index}
              text={block.text}
              className="text-base leading-relaxed text-foreground/90"
            />
          )
        }

        if (block.type === 'note') {
          return (
            <aside
              key={index}
              className="rounded-xl border border-logo-blue/20 bg-logo-blue/5 px-4 py-3 text-sm leading-relaxed text-logo-navy"
            >
              <LegalRichText text={block.text} className="text-sm leading-relaxed" />
            </aside>
          )
        }

        const ListTag = block.ordered ? 'ol' : 'ul'
        return (
          <ListTag
            key={index}
            className={
              block.ordered
                ? 'list-decimal space-y-2 pl-5 text-base leading-relaxed text-foreground/90'
                : 'list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground/90'
            }
          >
            {block.items.map((item, itemIndex) => (
              <LegalRichText key={itemIndex} as="li" text={item} className="pl-1" />
            ))}
          </ListTag>
        )
      })}
    </div>
  )
}

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  const tocItems = flattenToc(document.sections)

  return (
    <main className="flex flex-col">
      <a
        href="#legal-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        Skip to policy content
      </a>

      <header className="relative overflow-hidden bg-gradient-to-br from-logo-blue via-logo-navy to-logo-navy text-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/80">
              <li>
                <Link
                  href="/"
                  className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-sm"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden className="px-1">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-white font-medium" aria-current="page">
                {document.title}
              </li>
            </ol>
          </nav>

          <Badge
            variant="outline"
            className="mb-4 border-white/40 bg-white/10 text-white px-3 py-1"
          >
            {document.badge}
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            {document.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            Shamal Technologies — drone surveying, LiDAR, photogrammetry, GIS, and geospatial
            services in the Kingdom of Saudi Arabia.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <p className="text-sm text-white/80">
              Last updated:{' '}
              <time dateTime={document.lastUpdatedIso} className="font-semibold text-white">
                {document.lastUpdated}
              </time>
            </p>
            <Link
              href={document.related.href}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4 decoration-white/50 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              Related: {document.related.label}
            </Link>
          </div>
        </div>
      </header>

      <div className="section-bg-2">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <LegalTableOfContents items={tocItems} />
            </aside>

            <article
              id="legal-content"
              className="max-w-3xl rounded-2xl border border-border bg-background/90 p-5 shadow-sm md:p-10"
            >
              <LegalRichText
                text={document.intro}
                className="text-base leading-relaxed text-foreground/90 md:text-lg"
              />

              <div className="mt-10 space-y-14">
                {document.sections.map((section) => (
                  <section key={section.id} aria-labelledby={section.id}>
                    <h2
                      id={section.id}
                      className="scroll-mt-28 font-display text-2xl font-bold tracking-tight text-logo-navy md:text-3xl"
                    >
                      {section.title}
                    </h2>
                    <div className="mt-5">
                      <BlockList blocks={section.blocks} />
                    </div>
                    {section.subsections?.map((subsection) => (
                      <div key={subsection.id} className="mt-8">
                        <h3
                          id={subsection.id}
                          className="scroll-mt-28 text-lg font-semibold text-logo-navy md:text-xl"
                        >
                          {subsection.title}
                        </h3>
                        <div className="mt-4">
                          <BlockList blocks={subsection.blocks} />
                        </div>
                      </div>
                    ))}
                  </section>
                ))}
              </div>

              <footer className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
                <p>
                  Also read our{' '}
                  <Link
                    href={document.related.href}
                    className="font-medium text-logo-blue underline underline-offset-2"
                  >
                    {document.related.label}
                  </Link>
                  , or return to the{' '}
                  <Link href="/contact" className="font-medium text-logo-blue underline underline-offset-2">
                    Contact
                  </Link>{' '}
                  page.
                </p>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </main>
  )
}
