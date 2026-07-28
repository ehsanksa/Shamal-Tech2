import catalogJson from './catalog-products-data.json'

export type ProductCategory = 'drones' | 'payloads' | 'other'

export type CatalogProduct = {
  name: string
  source: 'primary' | 'secondary'
  category: ProductCategory
  categoryTag: string
  compatibility: string
  description: string
  inTheBox: string[]
  specifications: Record<string, string>
  keyFeatures: string[]
  imagePath?: string | null
  featured: boolean
}

export const catalogProductsData = catalogJson as CatalogProduct[]

/** Alternate names that refer to the same catalog product (for deduplication on sync). */
export const PRODUCT_NAME_ALIASES: Record<string, string[]> = {
  'DJI Matrice 30T': ['DJI M30T', 'DJI Matrice 30T'],
  'DJI Zenmuse V1 Speaker': [
    'Zenmuse V1 Speaker',
    'DJI Zenmuse V1',
    'Zenmuse V1',
  ],
  'DJI Zenmuse S1 Spotlight': [
    'Zenmuse S1 Spotlight',
    'DJI Zenmuse S1',
    'Zenmuse S1',
  ],
  'Zenmuse L3': ['DJI Zenmuse L3'],
  'Zenmuse H30': ['DJI Zenmuse H30'],
  'Zenmuse H30T': ['DJI Zenmuse H30T'],
  'Zenmuse L2': ['DJI Zenmuse L2'],
  'Zenmuse P1': ['DJI Zenmuse P1'],
  'TB65 Intelligent Flight Battery': ['DJI TB65 Intelligent Flight Battery'],
}

/** Products kept in CMS as drafts (not deleted) — must not appear on /products. */
export const UNPUBLISHED_CATALOG_NAMES = new Set([
  'DJI Terra',
  'DJI FlightHub 2',
  'DJI Mavic 3 Intelligent Flight Battery',
  'DJI Mavic 3 Battery Charging Hub',
])

/** SAR list prices keyed by catalog or live product name. */
export const PRODUCT_LIST_PRICES: Record<string, number> = {
  'D-RTK 3 Multifunctional Station': 8274.5,
  'D-RTK 3 Survey Pole & Tripod Kit': 2074.8,
  'DJI Zenmuse S1 Spotlight': 5876,
  'TB100 Tethered Battery': 8119.8,
  'BS100 Intelligent Battery Station': 6897.8,
  'DJI Matrice 4D Series Battery': 1592.5,
  'D-RTK 3 Relay Fixed Deployment Version': 12517.7,
  'DJI Zenmuse V1 Speaker': 4416.1,
  'DJI Zenmuse H30': 15971.8,
  'Zenmuse H30': 15971.8,
  'DJI Zenmuse L2': 65568.1,
  'Zenmuse L2': 65568.1,
  'DJI Zenmuse L3': 86660.6,
  'Zenmuse L3': 86660.6,
  'DJI Zenmuse P1': 31058.3,
  'Zenmuse P1': 31058.3,
  'DJI AS1 Speaker': 998.4,
  'DJI Mavic 3 Enterprise': 12489.1,
  'Zenmuse H30T Infrared Density Filter': 620.1,
  'DJI Matrice 4 Series Propellers': 114.4,
  'DJI Matrice 4D Series 240W Charging Hub': 366.6,
  'Matrice 400 Dual Gimbal Connector': 1047.8,
  'DJI AL1 Spotlight': 1378,
  'TB65 Intelligent Flight Battery': 5012.8,
  'BS65 Intelligent Battery Station': 5712.2,
  'WB37 Intelligent Battery': 469.3,
  'TB30 Intelligent Flight Battery': 1505.4,
  'M400 2510F Propeller': 171.6,
  'Matrice 400 Third Gimbal Connector': 586.3,
  'DJI Dock 3 Vehicle-Mounted Gimbal Mount': 1326,
  'DJI RC Plus 2 Strap & Stand Kit': 305.5,
  'DJI Mavic 3 Multispectral': 17678.7,
  'DJI Matrice 30T': 23226.33,
  'DJI Zenmuse H30T': 42357.9,
  'Zenmuse H30T': 42357.9,
  'DJI Matrice 400': 28241.28,
  'DJI Matrice 400 with extended warranty': 28241.28,
  'DJI Dock 3 (Overseas Edition)': 94330.6,
  'DJI Matrice 4D with extended warranty': 15917.94,
  'DJI Matrice 4D (SP Plus+)': 15917.94,
  'DJI Matrice 4TD with extended warranty': 22424.27,
  'DJI Matrice 4TD (SP Plus+)': 22424.27,
}

export const EXCLUDED_PRODUCT_NAMES = new Set([
  'DJI Dock 2',
  'DJI Dock 3',
  'DJI M350',
  'DJI Matrice 4 Series',
  'DJI FlyCart 30',
  'Hovermap',
  'DJI AS1 Speaker',
  'DJI AL1 Spotlight',
])
