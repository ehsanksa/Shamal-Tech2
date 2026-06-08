import { getCachedFooterServices, getCachedSiteSettings } from '../lib/cms/cached-queries'

import { FooterContent } from '../components/FooterContent/FooterContent.client'

export async function Footer() {
  const [siteSettings, services] = await Promise.all([
    getCachedSiteSettings(),
    getCachedFooterServices(),
  ])

  const siteSettingsTyped = siteSettings as {
    siteDescription?: string
    siteDescriptionAr?: string
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
  } | null

  return (
    <FooterContent
      services={services.docs.map((s) => ({
        id: String(s.id),
        title: s.title,
        titleAr: (s as { titleAr?: string }).titleAr,
        slug: s.slug,
      }))}
      contactInfo={siteSettingsTyped?.contactInfo}
      socialMedia={siteSettingsTyped?.socialMedia}
      footerTagline={siteSettingsTyped?.siteDescription}
      footerTaglineAr={siteSettingsTyped?.siteDescriptionAr}
    />
  )
}
