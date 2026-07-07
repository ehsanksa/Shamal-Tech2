import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Payload, PayloadRequest } from 'payload'

type KeywordCategory = 'primary' | 'secondary' | 'long-tail' | 'service-specific' | 'sector-specific'

const sectionToCategory: Array<{ match: string; category: KeywordCategory; priority: number }> = [
  { match: '🔹 Core Brand Keywords', category: 'primary', priority: 10 },
  { match: '🔹 Primary Service Keywords', category: 'primary', priority: 10 },
  { match: '🔹 Industry-Specific Keywords', category: 'sector-specific', priority: 9 },
  { match: '🔹 Advanced & Technical Keywords', category: 'secondary', priority: 8 },
  { match: '🔹 Trust & Compliance Keywords', category: 'secondary', priority: 8 },
  { match: '🔹 Suggested SEO', category: 'secondary', priority: 8 },
  { match: '🔹 Advanced Drone & Inspection', category: 'service-specific', priority: 9 },
  { match: '🔹 Geospatial, GIS & Mapping', category: 'service-specific', priority: 9 },
  { match: '🔹 Satellite Imagery & Remote Data', category: 'service-specific', priority: 9 },
  { match: '🔹 Construction, BIM & Mega Projects', category: 'service-specific', priority: 9 },
  { match: '🔹 AI, Analytics & Smart Solutions', category: 'service-specific', priority: 9 },
  { match: '🔹 Environment, Sustainability & ESG', category: 'sector-specific', priority: 9 },
  { match: '🔹 Security, Surveillance & Autonomous Systems', category: 'service-specific', priority: 9 },
  { match: '🔹 Marine, Bathymetry & Underwater', category: 'service-specific', priority: 9 },
  { match: '🔹 Authority & Trust-Building', category: 'secondary', priority: 8 },
]

const exactCategoryLabels: Record<string, KeywordCategory> = {
  'Primary Keyword': 'primary',
  'Secondary Keywords': 'secondary',
  'Long-Tail Keywords': 'long-tail',
  'Long-Tail Keywords:': 'long-tail',
}

const skipExact = new Set([
  'SEO Key Words',
  'Use these across homepage, meta titles, and About pages.',
  'These attract decision-makers actively looking for solutions.',
  'Target these on service landing pages.',
  'These position Shamal as a technology leader.',
  'Boost credibility and conversion.',
  'Use these together in pages/blogs for stronger ranking:',
  'High demand + strong conversion intent.',
  'Core authority positioning.',
  'Excellent for government & mega-project traffic.',
  'Perfect for NEOM, ROSHN, PIF-type clients.',
  'Positions Shamal as future-focused.',
  'Very strong for government, ESG, Vision 2030.',
  'High-value niche keywords.',
  'Low competition, high specialization.',
  'Important for rankings + credibility.',
  'Construction & Infrastructure',
  'Oil & Gas',
  'Government & Smart Cities',
  'Environment & Agriculture',
  'Drone Inspection Services',
  'Aerial & Land Surveying',
  'Construction Monitoring',
  'GIS & Remote Sensing',
  'Satellite Imagery Solutions',
  'Environmental Monitoring',
  'Oil & Gas Solutions',
  'Traffic Count & Analysis',
  'Security & Surveillance',
  'Marine & Underwater Survey',
])

function normalize(line: string): string {
  return line
    .replace(/[“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function looksLikeKeyword(line: string): boolean {
  if (!line) return false
  if (skipExact.has(line)) return false
  if (line.startsWith('🔹')) return false
  if (exactCategoryLabels[line]) return false
  if (line.length < 5) return false
  if (!/[A-Za-z0-9]/.test(line)) return false
  return true
}

export function parseKeywordsTxt(raw: string): Map<string, { category: KeywordCategory; priority: number }> {
  const lines = raw.split('\n').map((line) => normalize(line)).filter(Boolean)

  let currentCategory: KeywordCategory = 'secondary'
  let currentPriority = 8
  const collected = new Map<string, { category: KeywordCategory; priority: number }>()

  for (const line of lines) {
    const matchedSection = sectionToCategory.find((entry) => line.includes(entry.match))
    if (matchedSection) {
      currentCategory = matchedSection.category
      currentPriority = matchedSection.priority
      continue
    }

    if (exactCategoryLabels[line]) {
      currentCategory = exactCategoryLabels[line]
      currentPriority = currentCategory === 'primary' ? 10 : currentCategory === 'long-tail' ? 7 : 8
      continue
    }

    if (!looksLikeKeyword(line)) continue
    if (!collected.has(line)) {
      collected.set(line, { category: currentCategory, priority: currentPriority })
    }
  }

  return collected
}

/** Service / vertical groupings for SEO Settings JSON fields (matches keywords.txt intent). */
export const structuredServiceKeywords = {
  droneInspection: {
    primary: 'Drone Inspection Services Saudi Arabia',
    secondary: [
      'Industrial Drone Inspection KSA',
      'Oil and Gas Drone Inspection Saudi Arabia',
      'Infrastructure Inspection Drones',
      'Thermal Drone Inspection KSA',
    ],
    longTail: [
      'GACA certified drone inspection company',
      'Confined space drone inspection Saudi Arabia',
      'Power line and tower inspection drones',
    ],
  },
  aerialLandSurveying: {
    primary: 'Aerial Survey Services Saudi Arabia',
    secondary: [
      'Drone Surveying Company KSA',
      'Topographic Survey Saudi Arabia',
      'LiDAR Survey Services KSA',
      '3D Mapping Services Saudi Arabia',
    ],
    longTail: ['High accuracy drone surveys for construction', 'LiDAR point cloud mapping Saudi Arabia'],
  },
  constructionMonitoring: {
    primary: 'Construction Monitoring Drones Saudi Arabia',
    secondary: [
      'Construction Progress Monitoring KSA',
      'Drone Monitoring for Mega Projects',
      'BIM and GIS Integration Saudi Arabia',
      'Digital Construction Monitoring',
    ],
    longTail: ['NEOM construction drone monitoring', 'Aerial construction progress reporting'],
  },
  gisRemoteSensing: {
    primary: 'GIS and Remote Sensing Services Saudi Arabia',
    secondary: [
      'Geospatial Data Services KSA',
      'Remote Sensing Solutions Saudi Arabia',
      'Spatial Data Analytics KSA',
      'GIS Mapping Company Saudi Arabia',
    ],
    longTail: ['Government GIS services Saudi Arabia', 'Enterprise geospatial intelligence KSA'],
  },
  satelliteImagerySolutions: {
    primary: 'Satellite Imagery Services Saudi Arabia',
    secondary: [
      'High Resolution Satellite Imagery KSA',
      'Stereo Satellite Imagery Saudi Arabia',
      'Tri-Stereo Mapping Services',
      'Satellite Monitoring for Construction',
    ],
    longTail: ['Satellite imagery for urban planning KSA', 'PIF and government satellite data services'],
  },
  environmentalMonitoring: {
    primary: 'Environmental Monitoring Drones Saudi Arabia',
    secondary: [
      'Environmental Survey Services KSA',
      'Mangrove Monitoring Saudi Arabia',
      'NDVI Analysis Drones KSA',
      'ESG Monitoring Solutions',
    ],
    longTail: [
      'Environmental compliance monitoring Saudi Arabia',
      'Wildlife and vegetation monitoring drones',
    ],
  },
  oilGasSolutions: {
    primary: 'Oil and Gas Drone Services Saudi Arabia',
    secondary: [
      'Asset Integrity Inspection KSA',
      'Thermal Inspection Oil and Gas',
      'OGI Methane Monitoring Saudi Arabia',
      'Industrial Inspection Drones',
    ],
    longTail: ['Drone inspection for refineries Saudi Arabia', 'GACA approved oil and gas drone company'],
  },
  trafficCountAnalysis: {
    primary: 'Traffic Count and Analysis Saudi Arabia',
    secondary: [
      'AI Traffic Analysis KSA',
      'Traffic Monitoring Drones',
      'Smart Traffic Solutions Saudi Arabia',
      'Urban Traffic Data Analytics',
    ],
    longTail: ['Traffic studies for municipalities Saudi Arabia', 'AI-based vehicle classification KSA'],
  },
  securitySurveillance: {
    primary: 'Drone Security Surveillance Saudi Arabia',
    secondary: [
      'Autonomous Drone Monitoring KSA',
      'Drone-in-a-Box Security Solutions',
      'Perimeter Security Drones',
      'AI Surveillance Systems Saudi Arabia',
    ],
    longTail: ['Critical infrastructure drone surveillance', 'Industrial site security drones KSA'],
  },
  marineUnderwaterSurvey: {
    primary: 'Bathymetric Survey Saudi Arabia',
    secondary: [
      'Underwater Drone Inspection KSA',
      'Marine Survey Services Saudi Arabia',
      'Coastal Monitoring Drones',
      'Port Inspection Drones',
    ],
    longTail: ['Jetty and bridge underwater inspection', 'Marine infrastructure monitoring Saudi Arabia'],
  },
} as const

export const structuredSectorKeywords = {
  constructionInfrastructure: [
    'Construction Monitoring Drones Saudi Arabia',
    'BIM and GIS Integration KSA',
    'Construction Progress Monitoring Saudi Arabia',
  ],
  oilAndGas: [
    'Oil and Gas Drone Inspection Saudi Arabia',
    'Asset Integrity Inspection KSA',
    'Thermal Inspection Oil and Gas Saudi Arabia',
    'OGI Methane Monitoring Saudi Arabia',
  ],
  governmentSmartCities: [
    'Smart City Geospatial Solutions Saudi Arabia',
    'Government GIS Services KSA',
    'Urban Planning Satellite Imagery Saudi Arabia',
  ],
  environmentAgriculture: [
    'Environmental Monitoring Drones Saudi Arabia',
    'Mangrove Monitoring Saudi Arabia',
    'NDVI Analysis Saudi Arabia',
    'Precision Agriculture Drones KSA',
  ],
} as const

const defaultMetaDescriptionTemplate =
  'Shamal Technologies - {title}. Professional drone and geospatial solutions in Saudi Arabia.'

export type SyncSeoKeywordsResult = {
  keywordsPath: string
  parsedCount: number
  collectionCreated: number
  collectionUpdated: number
  primaryKeywordsCount: number
  secondaryKeywordsCount: number
  longTailKeywordsCount: number
}

function keywordsFilePath(cwd: string = process.cwd()): string {
  return join(cwd, 'public', 'keywords.txt')
}

/**
 * Reads `public/keywords.txt`, upserts `seo-keywords`, and updates `seo-settings`.
 * By default replaces primary/secondary/long-tail arrays so stale defaults (e.g. 3 keywords) cannot linger on production.
 */
export async function syncSeoKeywordsFromPublicFile(args: {
  payload: Payload
  req: PayloadRequest
  cwd?: string
  /** If false, merges unique with existing globals instead of replacing the three keyword arrays. */
  replaceMainKeywordArrays?: boolean
}): Promise<SyncSeoKeywordsResult> {
  const { payload, req, cwd = process.cwd(), replaceMainKeywordArrays = true } = args

  const keywordsPath = keywordsFilePath(cwd)
  const raw = readFileSync(keywordsPath, 'utf8')
  const collected = parseKeywordsTxt(raw)

  let collectionCreated = 0
  let collectionUpdated = 0

  for (const [keyword, meta] of collected.entries()) {
    const existing = await payload.find({
      collection: 'seo-keywords',
      where: { keyword: { equals: keyword } },
      limit: 1,
      req,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'seo-keywords',
        data: {
          keyword,
          category: meta.category,
          priority: meta.priority,
          active: true,
        },
        context: { disableRevalidate: true },
        req,
      })
      collectionCreated++
    } else {
      await payload.update({
        collection: 'seo-keywords',
        id: existing.docs[0].id,
        data: {
          category: meta.category,
          priority: meta.priority,
          active: true,
        },
        context: { disableRevalidate: true },
        req,
      })
      collectionUpdated++
    }
  }

  const allKeywords = [...collected.keys()]
  const primaryFromFile = [...collected.entries()]
    .filter(([, meta]) => meta.category === 'primary')
    .map(([keyword]) => keyword)
  const secondaryFromFile = [...collected.entries()]
    .filter(
      ([, meta]) =>
        meta.category === 'secondary' ||
        meta.category === 'service-specific' ||
        meta.category === 'sector-specific',
    )
    .map(([keyword]) => keyword)
  const longTailFromFile = [...collected.entries()]
    .filter(([, meta]) => meta.category === 'long-tail')
    .map(([keyword]) => keyword)

  const unique = (items: string[]) => [...new Set(items)]

  const settings = await payload.findGlobal({ slug: 'seo-settings', req })

  const primaryKeywords = replaceMainKeywordArrays
    ? unique(primaryFromFile)
    : unique([...(settings.primaryKeywords || []), ...primaryFromFile])

  const secondaryKeywords = replaceMainKeywordArrays
    ? unique(secondaryFromFile)
    : unique([...(settings.secondaryKeywords || []), ...secondaryFromFile])

  const longTailKeywords = replaceMainKeywordArrays
    ? unique(longTailFromFile)
    : unique([...(settings.longTailKeywords || []), ...longTailFromFile])

  await payload.updateGlobal({
    slug: 'seo-settings',
    data: {
      primaryKeywords,
      secondaryKeywords,
      longTailKeywords,
      serviceKeywords: {
        ...(typeof settings.serviceKeywords === 'object' && settings.serviceKeywords !== null
          ? settings.serviceKeywords
          : {}),
        ...structuredServiceKeywords,
        _allFromKeywordsTxt: allKeywords,
      },
      sectorKeywords: {
        ...(typeof settings.sectorKeywords === 'object' && settings.sectorKeywords !== null
          ? settings.sectorKeywords
          : {}),
        ...structuredSectorKeywords,
      },
      metaDescriptionTemplate: settings.metaDescriptionTemplate || defaultMetaDescriptionTemplate,
    },
    context: { disableRevalidate: true },
    req,
  })

  return {
    keywordsPath,
    parsedCount: collected.size,
    collectionCreated,
    collectionUpdated,
    primaryKeywordsCount: primaryKeywords.length,
    secondaryKeywordsCount: secondaryKeywords.length,
    longTailKeywordsCount: longTailKeywords.length,
  }
}
