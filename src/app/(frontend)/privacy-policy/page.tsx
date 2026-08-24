import type { Metadata } from 'next'

import { LegalPageLayout } from '../../../components/legal/LegalPageLayout'
import { getCachedSiteSettings } from '../../../lib/cms/cached-queries'
import { privacyPolicyDocument } from '../../../lib/legal/privacy-policy'
import { LEGAL_COMPANY } from '../../../lib/legal/types'
import { buildLegalJsonLd, buildLegalMetadata } from '../../../lib/legal/seo'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return buildLegalMetadata(privacyPolicyDocument)
}

export default async function PrivacyPolicyPage() {
  const siteSettings = (await getCachedSiteSettings()) as {
    contactInfo?: { phone?: string; email?: string; address?: string }
  } | null

  const email = siteSettings?.contactInfo?.email || LEGAL_COMPANY.email
  const phone = siteSettings?.contactInfo?.phone || LEGAL_COMPANY.phone
  const address = siteSettings?.contactInfo?.address || LEGAL_COMPANY.address

  return (
    <>
      <LegalPageLayout document={privacyPolicyDocument} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildLegalJsonLd({
              document: privacyPolicyDocument,
              email,
              phone,
              address,
            }),
          ),
        }}
      />
    </>
  )
}
