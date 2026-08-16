export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'note'; text: string }

export type LegalSubsection = {
  id: string
  title: string
  blocks: LegalBlock[]
}

export type LegalSection = {
  id: string
  title: string
  blocks: LegalBlock[]
  subsections?: LegalSubsection[]
}

export type LegalRelatedLink = {
  href: string
  label: string
}

export type LegalDocument = {
  slug: string
  title: string
  badge: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  lastUpdated: string
  lastUpdatedIso: string
  intro: string
  related: LegalRelatedLink
  sections: LegalSection[]
}

export const LEGAL_LAST_UPDATED_ISO = '2026-08-16'
export const LEGAL_LAST_UPDATED_DISPLAY = '16 August 2026'

export const LEGAL_COMPANY = {
  name: 'Shamal Technologies',
  website: 'https://shamal.sa',
  email: 'hello@shamal.sa',
  phone: '+966 (0) 53 030 1370',
  address:
    'Office 1109, 11th Floor, The Headquarters Business Park, Jeddah 23511, Kingdom of Saudi Arabia',
  locality: 'Jeddah',
  region: 'Makkah',
  postalCode: '23511',
  country: 'SA',
} as const
