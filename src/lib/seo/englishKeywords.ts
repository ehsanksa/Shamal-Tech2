/**
 * English SEO keywords used as fallback when CMS seo-settings has not been synced yet.
 * Target brand/search phrases are listed first so they always appear in meta keywords.
 */
export const TARGET_BRAND_KEYWORDS = [
  'DJI Products',
  'Drone company',
  'drone company in saudi',
  'Authorized DJI Drones Seller',
  'Authorized DJI Products Seller',
  'Drone Company in Saudi Arabia',
  'Drone Company Saudi Arabia',
  'Authorized DJI Seller Saudi Arabia',
  'Authorized DJI Seller KSA',
  'DJI Drones Saudi Arabia',
  'DJI Products Saudi Arabia',
] as const

export const ENGLISH_SEO_KEYWORDS = {
  primary: [
    ...TARGET_BRAND_KEYWORDS,
    'Shamal Technologies',
    'Shamal Technologies Saudi Arabia',
    'Saudi Geospatial Data Company',
    'Geospatial Solutions Saudi Arabia',
    'Smart Data Solutions KSA',
    'Vision 2030 Technology Partner',
    'Drone Surveying Services Saudi Arabia',
    'Aerial Survey Company KSA',
    'Geospatial Data Services Saudi Arabia',
    'GIS and Remote Sensing Saudi Arabia',
    'Satellite Imagery Services KSA',
    'LiDAR Survey Saudi Arabia',
    'AI Data Analytics Saudi Arabia',
    'Digital Twin Solutions Saudi Arabia',
  ],
  secondary: [
    'GACA Approved Drone Company',
    'ISO 9001 Certified Drone Services',
    'DJI Enterprise Dealer Saudi Arabia',
    'Buy DJI Drones Saudi Arabia',
  ],
} as const

export const SITE_SEO_TITLE =
  'Shamal Technologies | Drone Company in Saudi Arabia | Authorized DJI Seller'

export const SITE_SEO_DESCRIPTION =
  'Shamal Technologies is a drone company in Saudi Arabia and an authorized DJI products seller. Buy DJI products from an authorized DJI drones seller, plus expert drone survey and geospatial solutions for construction, infrastructure, mining, agriculture, and environmental sectors.'

export function allEnglishKeywordsFlat(): string[] {
  return [...ENGLISH_SEO_KEYWORDS.primary, ...ENGLISH_SEO_KEYWORDS.secondary]
}
