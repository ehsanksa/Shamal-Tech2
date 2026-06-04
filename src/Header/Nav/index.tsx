'use client'

import React from 'react'

import type { Header as HeaderType } from '../../payload-types'

import { CMSLink } from '../../components/Link'
import Link from 'next/link'
import { GraduationCap, Menu } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { cn } from '../../utilities/ui'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '../../components/ThemeToggle'
import { LanguageToggle } from '../../components/LanguageToggle'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { QuoteCartNavButton } from '../../components/products/QuoteCartNavButton'

function isDuplicatePrimaryNavLink(
  link: NonNullable<NonNullable<HeaderType['navItems']>[number]['link']>,
): boolean {
  if (link.type === 'custom' && link.url) {
    const raw = link.url.trim()
    const path = (raw.startsWith('http') ? new URL(raw).pathname : raw).replace(/\/$/, '') || '/'
    if (path === '/posts' || path === '/contact') return true
  }
  if (link.type === 'reference' && link.reference?.relationTo === 'pages') {
    const v = link.reference.value
    if (typeof v === 'object' && v !== null && 'slug' in v && v.slug === 'contact') return true
  }
  return false
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  const primaryNavItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.services, href: '/services' },
    { label: t.nav.products, href: '/products' },
    { label: t.nav.careers, href: '/careers' },
    { label: t.nav.blogs, href: '/posts' },
    { label: t.nav.contact, href: '/contact' },
  ]

  const extraNavItems = navItems.filter(({ link }) => link && !isDuplicatePrimaryNavLink(link))

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const trainingActive = pathname?.startsWith('/training')

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        isActive(href)
          ? 'text-primary border-b-2 border-primary pb-1'
          : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
        {extraNavItems.map(({ link }, i) => {
          if (link?.type === 'reference' || link?.type === 'custom') {
            return (
              <CMSLink
                key={`cms-${i}`}
                {...link}
                appearance="link"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  'text-muted-foreground'
                )}
              />
            )
          }
          return null
        })}

        <QuoteCartNavButton />

        <Link
          href="/training"
          className={cn(
            'relative flex flex-col items-center gap-0.5 text-muted-foreground transition-colors hover:text-primary',
            trainingActive && 'text-primary',
          )}
          aria-label="Training — New"
        >
          <span className="rounded bg-primary px-1 py-px text-[9px] font-bold uppercase leading-none text-primary-foreground">
            NEW
          </span>
          <GraduationCap className="h-5 w-5 shrink-0" aria-hidden />
        </Link>

        {/* Theme Toggle */}
        <div className="ml-4">
          <ThemeToggle />
        </div>

        {/* Language Toggle */}
        <div className="ml-2">
          <LanguageToggle />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">{t.toggleMenu}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetTitle className="sr-only">{t.navigationMenu}</SheetTitle>
          <nav className="flex flex-col gap-6 mt-8">
            {primaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-lg font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
            {extraNavItems.map(({ link }, i) => {
              if (link?.type === 'reference' || link?.type === 'custom') {
                return (
                  <CMSLink
                    key={`cms-mobile-${i}`}
                    {...link}
                    appearance="link"
                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                  />
                )
              }
              return null
            })}
            <Link
              href="/products/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-muted-foreground hover:text-primary"
            >
              {t.viewQuoteCart}
            </Link>
            <Link
              href="/training"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 text-lg font-medium transition-colors',
                trainingActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
              )}
            >
              <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                NEW
              </span>
              <GraduationCap className="h-6 w-6 shrink-0" aria-hidden />
              <span>Training</span>
            </Link>

            {/* Theme Toggle - Mobile */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">{t.theme}</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Language Toggle - Mobile */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{t.language}</span>
                <LanguageToggle />
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
