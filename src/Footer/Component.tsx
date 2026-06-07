import { getCachedGlobal } from '../utilities/getGlobals'
import { safePayloadFind } from '../utilities/safePayloadQuery'

import { FooterContent } from '../components/FooterContent/FooterContent.client'

export async function Footer() {
  const [siteSettings, services] = await Promise.all([
    getCachedGlobal('site-settings', 2)(),
    safePayloadFind({
      collection: 'services',
      limit: 6,
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: 'createdAt',
      depth: 0,
      draft: false,
      overrideAccess: false,
    }),
  ])

  // Type assertion for site settings
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

  const contactInfo = siteSettingsTyped?.contactInfo
  const socialMedia = siteSettingsTyped?.socialMedia

  return (
    <FooterContent
      services={services.docs.map((s) => ({
        id: String(s.id),
        title: s.title,
        titleAr: (s as { titleAr?: string }).titleAr,
        slug: s.slug,
      }))}
      contactInfo={contactInfo}
      socialMedia={socialMedia}
      footerTagline={siteSettingsTyped?.siteDescription}
      footerTaglineAr={siteSettingsTyped?.siteDescriptionAr}
    />
  )
}

