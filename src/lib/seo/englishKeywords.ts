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
    'Aerial survey Saudi Arabia',
    'Drone mapping Saudi Arabia',
    'UAV surveying Saudi Arabia',
    'Geospatial Data Services Saudi Arabia',
    'GIS and Remote Sensing Saudi Arabia',
    'GIS services Saudi Arabia',
    'Satellite Imagery Services KSA',
    'LiDAR Survey Saudi Arabia',
    'LiDAR survey Saudi Arabia',
    'Drone inspection Saudi Arabia',
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
  'Shamal Technologies | Drone & Geospatial Solutions in Saudi Arabia'

export const SITE_SEO_DESCRIPTION =
  'Shamal Technologies delivers drone and geospatial solutions in Saudi Arabia: aerial survey, LiDAR, GIS, drone inspection, and construction monitoring, plus authorized DJI products from our Jeddah team.'

export function allEnglishKeywordsFlat(): string[] {
  return [...ENGLISH_SEO_KEYWORDS.primary, ...ENGLISH_SEO_KEYWORDS.secondary]
}
