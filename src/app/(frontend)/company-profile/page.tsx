import type { Metadata } from 'next'

import { CompanyProfileDeck } from '../../../components/company-profile/CompanyProfileDeck.client'
import { getCachedGlobal } from '../../../utilities/getGlobals'
import CompanyProfilePageClient from './page.client'

export const metadata: Metadata = {
  title: 'Company Profile | Shamal Technologies',
  description:
    'Interactive company profile for Shamal Technologies — Saudi drone survey, LiDAR mapping, volumetric analysis, and geospatial solutions for construction, mining, and infrastructure.',
}

export const dynamic = 'force-static'
export const revalidate = 600

export default async function CompanyProfilePage() {
  const siteSettings = (await getCachedGlobal('site-settings', 2)()) as {
    contactInfo?: {
      phone?: string
      email?: string
      address?: string
    }
  } | null

  const contactInfo = {
    phone: siteSettings?.contactInfo?.phone ?? '+966 (0) 53 030 1370',
    email: siteSettings?.contactInfo?.email ?? 'hello@shamal.sa',
    address:
      siteSettings?.contactInfo?.address ??
      'Office 1109, 11th Floor, The Headquarters Business Park, Jeddah 23511, Kingdom of Saudi Arabia',
    website: 'https://shamal.sa',
  }

  return (
    <main className="h-[100dvh] overflow-hidden">
      <CompanyProfilePageClient />
      <CompanyProfileDeck contactInfo={contactInfo} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Shamal Technologies',
            url: 'https://shamal.sa',
            description:
              'Saudi geospatial data company providing drone survey, LiDAR, and analytics for construction, mining, agriculture, and infrastructure.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: contactInfo.address,
              addressLocality: 'Jeddah',
              postalCode: '23511',
              addressCountry: 'SA',
            },
            telephone: contactInfo.phone,
            email: contactInfo.email,
          }),
        }}
      />
    </main>
  )
}
