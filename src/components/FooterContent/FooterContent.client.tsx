'use client'

import { LocalizedLink as Link } from '../LocalizedLink'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import {
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
} from 'lucide-react'

import { Logo } from '../Logo/Logo'
import { NewsletterForm } from '../NewsletterForm'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { getLocalizedValue } from '../../lib/localization'

type Service = {
  id: string
  title?: string | null
  titleAr?: string | null
  slug?: string | null
}

type FooterContentProps = {
  services: Service[]
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
    addressAr?: string
  }
  socialMedia?: {
    linkedin?: string
    facebook?: string
    youtube?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    snapchat?: string
  }
  footerTagline?: string
  footerTaglineAr?: string
}

export function FooterContent({
  services,
  contactInfo,
  socialMedia,
  footerTagline,
  footerTaglineAr,
}: FooterContentProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayTagline = getLocalizedValue(
    footerTagline ?? t.footer.footerTagline,
    footerTaglineAr,
    language
  )
  const displayAddress = getLocalizedValue(
    contactInfo?.address,
    contactInfo?.addressAr,
    language
  )

  // Default social URLs when not configured in CMS (user can update in Site Settings)
  const defaultSocialUrls = {
    linkedin: 'https://www.linkedin.com/company/shamal-technologies',
    facebook: 'https://www.facebook.com/shamaltechnologies',
    youtube: 'https://www.youtube.com/@shamaltechnologies',
    instagram: 'https://www.instagram.com/shamaltechnologies',
    twitter: 'https://x.com/shamaltechnologies',
    tiktok: 'https://www.tiktok.com/@shamaltechnologies',
    snapchat: 'https://www.snapchat.com/add/shamaldrones',
  }

  const socialIcons = [
    { key: 'linkedin', icon: Linkedin, url: socialMedia?.linkedin || defaultSocialUrls.linkedin },
    { key: 'facebook', icon: Facebook, url: socialMedia?.facebook || defaultSocialUrls.facebook },
    { key: 'youtube', icon: Youtube, url: socialMedia?.youtube || defaultSocialUrls.youtube },
    { key: 'tiktok', icon: null, url: socialMedia?.tiktok || defaultSocialUrls.tiktok },
    { key: 'instagram', icon: Instagram, url: socialMedia?.instagram || defaultSocialUrls.instagram },
    { key: 'twitter', icon: null, url: socialMedia?.twitter || defaultSocialUrls.twitter },
    { key: 'snapchat', icon: null, url: socialMedia?.snapchat || defaultSocialUrls.snapchat },
  ]

  const copyrightText = t.footer.copyright.replace(
    '{year}',
    String(new Date().getFullYear())
  )

  return (
    <footer className="relative z-[10000] isolate mt-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          <div className="space-y-4">
            <Link href="/" className="block">
              <Logo variant="primary" className="h-10 md:h-12 w-auto" />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {displayTagline}
            </p>
            <div className="space-y-3 text-sm">
              {contactInfo?.phone && (
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </a>
              )}
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
              )}
              {displayAddress && (
                <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{displayAddress}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t.footer.services}
            </h3>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {getLocalizedValue(service.title, service.titleAr, language)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline group"
            >
              {t.footer.viewAllServices}
              <ArrowRight
                className={
                  language === 'ar'
                    ? 'mr-1 h-4 w-4 group-hover:-translate-x-1 scale-x-[-1]'
                    : 'ml-1 h-4 w-4 group-hover:translate-x-1'
                }
              />
            </Link>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t.footer.company}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/company-profile"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.nav.companyProfile}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.nav.careers}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {t.footer.termsAndConditions}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t.footer.newsletter}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.footer.newsletterDescription}
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 pr-24 md:pr-28">
          <div className="flex flex-row flex-wrap justify-between items-center gap-x-4 gap-y-3 min-h-[2.5rem]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-shrink-0">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {copyrightText}
              </p>
              <nav aria-label={t.footer.legal} className="flex items-center gap-3 text-xs">
                <Link
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-primary dark:hover:text-primary underline-offset-2 hover:underline min-h-11 sm:min-h-0 inline-flex items-center"
                >
                  {t.footer.privacyPolicy}
                </Link>
                <span className="text-gray-300 dark:text-gray-700" aria-hidden>
                  |
                </span>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-500 hover:text-primary dark:hover:text-primary underline-offset-2 hover:underline min-h-11 sm:min-h-0 inline-flex items-center"
                >
                  {t.footer.termsAndConditions}
                </Link>
              </nav>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-shrink-0 relative z-[10001] [&_a]:pointer-events-auto">
              {socialIcons.map((social) => {
                const hasUrl = Boolean(social.url)
                const isDisabled = !hasUrl
                const baseClasses = isDisabled
                  ? 'text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed'
                  : 'text-gray-400 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer inline-flex items-center justify-center p-2 rounded-md -m-1 relative z-[10001] pointer-events-auto'
                const linkClasses = isDisabled
                  ? baseClasses
                  : `${baseClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
                const ariaLabel = social.key.charAt(0).toUpperCase() + social.key.slice(1)
                const title = isDisabled ? `${ariaLabel} - Link not configured` : ariaLabel

                const IconComponent = social.icon
                if (IconComponent) {
                  if (hasUrl) {
                    return (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                        aria-label={ariaLabel}
                        title={title}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    )
                  } else {
                    return (
                      <span
                        key={social.key}
                        className={baseClasses}
                        aria-label={ariaLabel}
                        title={title}
                      >
                        <IconComponent className="h-5 w-5" />
                      </span>
                    )
                  }
                }

                if (social.key === 'tiktok') {
                  if (hasUrl) {
                    return (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                        aria-label="TikTok"
                        title={title}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </a>
                    )
                  } else {
                    return (
                      <span
                        key={social.key}
                        className={baseClasses}
                        aria-label="TikTok"
                        title={title}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </span>
                    )
                  }
                }

                if (social.key === 'snapchat') {
                  if (hasUrl) {
                    return (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                        aria-label="Snapchat"
                        title={title}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.206.793c.99 0 4.347.276 5.866 3.821.529 1.193.403 3.219.299 4.847l-.003.15h.256c1.256 0 2.816.95 3.035 2.209.121.704.067 1.512-.367 2.364-.413.822-1.162 1.762-2.485 2.244-.092.033-.17.086-.208.15-.013.022-.013.08-.011.148.003.068.013.1.042.13.081.084.396.21.586.346.816.587 1.08 1.166.648 1.46-.32.22-.854.188-1.463.038-.237-.058-1.132-.339-1.398-.484-.09-.049-.16-.09-.202-.09-.113 0-.41.29-.765.52-.89.58-2.028 1.125-3.388 1.125h-.09c-1.36 0-2.499-.545-3.389-1.125-.354-.23-.651-.52-.765-.52-.04 0-.111.041-.201.09-.266.145-1.16.426-1.397.484-.61.15-1.144.182-1.464-.038-.432-.294-.168-.873.648-1.46.19-.136.505-.262.586-.346.03-.03.04-.062.042-.13.002-.068.002-.126-.01-.148-.039-.064-.117-.117-.21-.15-1.323-.482-2.072-1.422-2.485-2.244-.434-.852-.488-1.66-.367-2.364.219-1.259 1.779-2.209 3.035-2.209h.256l-.003-.15c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793zm0 0" />
                        </svg>
                      </a>
                    )
                  } else {
                    return (
                      <span
                        key={social.key}
                        className={baseClasses}
                        aria-label="Snapchat"
                        title={title}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.206.793c.99 0 4.347.276 5.866 3.821.529 1.193.403 3.219.299 4.847l-.003.15h.256c1.256 0 2.816.95 3.035 2.209.121.704.067 1.512-.367 2.364-.413.822-1.162 1.762-2.485 2.244-.092.033-.17.086-.208.15-.013.022-.013.08-.011.148.003.068.013.1.042.13.081.084.396.21.586.346.816.587 1.08 1.166.648 1.46-.32.22-.854.188-1.463.038-.237-.058-1.132-.339-1.398-.484-.09-.049-.16-.09-.202-.09-.113 0-.41.29-.765.52-.89.58-2.028 1.125-3.388 1.125h-.09c-1.36 0-2.499-.545-3.389-1.125-.354-.23-.651-.52-.765-.52-.04 0-.111.041-.201.09-.266.145-1.16.426-1.397.484-.61.15-1.144.182-1.464-.038-.432-.294-.168-.873.648-1.46.19-.136.505-.262.586-.346.03-.03.04-.062.042-.13.002-.068.002-.126-.01-.148-.039-.064-.117-.117-.21-.15-1.323-.482-2.072-1.422-2.485-2.244-.434-.852-.488-1.66-.367-2.364.219-1.259 1.779-2.209 3.035-2.209h.256l-.003-.15c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793zm0 0" />
                        </svg>
                      </span>
                    )
                  }
                }

                if (social.key === 'twitter') {
                  if (hasUrl) {
                    return (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                        aria-label="X (formerly Twitter)"
                        title={title}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )
                  } else {
                    return (
                      <span
                        key={social.key}
                        className={baseClasses}
                        aria-label="X (formerly Twitter)"
                        title={title}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </span>
                    )
                  }
                }

                return null
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
