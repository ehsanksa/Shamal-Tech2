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
