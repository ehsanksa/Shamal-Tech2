import type { Payload, PayloadRequest } from 'payload'
import { ensureMediaFromPublicFile } from '../../lib/cms/ensureMediaFromPublicFile'
import {
  legacyProductsData,
  CATEGORY_TAG_AR_MAP as LEGACY_CATEGORY_TAG_AR_MAP,
  FEATURE_AR_MAP,
  toArabicDescription as legacyToArabicDescription,
} from './legacy-products-data'

function textToRichText(text: string, direction: 'ltr' | 'rtl' = 'ltr') {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction,
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

const NEW_CATEGORY_TAG_AR_MAP: Record<string, string> = {
  ...LEGACY_CATEGORY_TAG_AR_MAP,
  Accessories: 'ملحقات',
  'Power Solutions': 'حلول الطاقة',
  'Charging Solutions': 'حلول الشحن',
  'GNSS Solutions': 'حلول GNSS',
  Software: 'البرمجيات',
  'Multispectral Drones': 'طائرات متعددة الأطياف',
  'Thermal Drones': 'الطائرات الحرارية',
  'Broadcast Payloads': 'حمولات البث',
  'Lighting Payloads': 'حمولات الإضاءة',
}

function toArabicDescription(name: string, categoryTag: string): string {
  return `${name} هو حل احترافي ضمن فئة ${NEW_CATEGORY_TAG_AR_MAP[categoryTag] || categoryTag}، مصمم لدعم مشاريع الطيران والبيانات الجيومكانية بكفاءة واعتمادية عالية في المملكة العربية السعودية.`
}

type ProductSeed = {
  name: string
  category: 'drones' | 'payloads' | 'other'
  categoryTag: string
  description: string
  keyFeatures: string[]
  imagePath: string
  featured?: boolean
}

export const newProductsData: ProductSeed[] = [
  // Drones
  {
    name: 'DJI Mavic 3 Multispectral',
    category: 'drones',
    categoryTag: 'Multispectral Drones',
    description:
      'Professional multispectral drone for precision agriculture with a 20MP RGB camera, 4-band multispectral sensors, RTK support, and up to 43 minutes of flight time.',
    keyFeatures: [
      '20MP RGB camera with 4/3 CMOS sensor',
      '4-band multispectral imaging (G/R/RE/NIR)',
      'RTK module for centimeter-level positioning',
      'Up to 43 minutes max flight time',
      'Omnidirectional obstacle avoidance',
    ],
    imagePath: 'media/products-images/21.DJI Matrice 400.png',
    featured: true,
  },
  {
    name: 'DJI Matrice 30T',
    category: 'drones',
    categoryTag: 'Thermal Drones',
    description:
      'Enterprise-grade rugged quadrotor with integrated zoom, wide-angle, thermal, and FPV cameras, plus a laser rangefinder for all-weather operations.',
    keyFeatures: [
      'Integrated zoom, wide-angle, thermal, and FPV cameras',
      'Laser rangefinder up to 1200 m',
      'IP55 weather resistance',
      'Up to 41 minutes max flight time',
      'RTK centimeter-level positioning',
    ],
    imagePath: 'media/products-images/16. DJI Matrice 4TD (SP Plus+).jpg',
    featured: true,
  },
  // Payloads & cameras
  {
    name: 'Zenmuse V1 Speaker',
    category: 'payloads',
    categoryTag: 'Broadcast Payloads',
    description:
      "DJI's first drone-mounted speaker payload delivering up to 127 dB SPL at 1 m and a broadcast distance of up to 500 m for public safety operations.",
    keyFeatures: [
      '127 dB max sound pressure level at 1 m',
      '500 m effective broadcast distance',
      '30 W rated power',
      'Multiple broadcast modes',
      'IP54 protection',
    ],
    imagePath: 'media/products-images/1.DJI AS1 Speaker.jpg',
    featured: true,
  },
  {
    name: 'Zenmuse S1 Spotlight',
    category: 'payloads',
    categoryTag: 'Lighting Payloads',
    description:
      "DJI's first LEP drone spotlight with high-intensity illumination, multiple lighting modes, and effective nighttime operation for search and inspection missions.",
    keyFeatures: [
      'LEP (Laser Excited Phosphor) lighting technology',
      '35 lux central illuminance at 100 m',
      '500 m effective illumination distance',
      '68 W rated power',
      'IP54 protection',
    ],
    imagePath: 'media/products-images/2.DJI AL1 Spotlight.jpg',
    featured: true,
  },
  // Batteries & power
  {
    name: 'TB65 Intelligent Flight Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'High-capacity intelligent flight battery with self-heating and fast charging support for Matrice 350 RTK and Matrice 300 RTK platforms.',
    keyFeatures: [
      '5880 mAh capacity and 263.2 Wh energy',
      'Self-heating support for low temperatures',
      'Fast charging in around 60 minutes at 220V',
      'Wide operating range from -20C to 50C',
      'Designed for Matrice 350 RTK and Matrice 300 RTK',
    ],
    imagePath: 'media/products-images/14. DJI TB65 Intelligent Flight Battery.jpg',
    featured: false,
  },
  {
    name: 'BS65 Intelligent Battery Station',
    category: 'other',
    categoryTag: 'Charging Solutions',
    description:
      'Fleet charging and storage station for TB65 and WB37 batteries, delivering high output power for rapid field turnaround.',
    keyFeatures: [
      'Supports 8 x TB65 and 4 x WB37 batteries',
      'Up to 992 W output at 220V',
      'Input support for 100-120V and 220-240V',
      'Portable station for field deployments',
      'Compatible with Matrice 350 RTK',
    ],
    imagePath: 'media/products-images/8. BS100 Intelligent Battery Station1.jpg',
    featured: false,
  },
  {
    name: 'WB37 Intelligent Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'Compact intelligent 2S battery with strong low-temperature discharge performance for remote controllers and monitoring accessories.',
    keyFeatures: [
      '4920 mAh capacity',
      '37.39 Wh energy',
      '7.6 V nominal voltage',
      'Low-temperature discharge performance',
      'Compatible with DJI RC Plus and related devices',
    ],
    imagePath: 'media/products-images/12. DJI Matrice 4D Series Battery.jpg',
    featured: false,
  },
  {
    name: 'TB30 Intelligent Flight Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'Self-heating intelligent flight battery for Matrice 30 series with support for hot module replacement and up to 400 charge cycles.',
    keyFeatures: [
      '5880 mAh capacity',
      'Supports hot module replacement',
      'Rated for 400 cycles',
      'Operating range from -20C to 50C',
      'Built for Matrice 30 series',
    ],
    imagePath: 'media/products-images/7. TB100 Tethered Battery.jpg',
    featured: false,
  },
  {
    name: 'DJI Mavic 3 Intelligent Flight Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'Dedicated LiPo 4S battery for DJI Mavic 3 series drones, delivering up to 43 minutes of flight time for multispectral operations.',
    keyFeatures: [
      '5000 mAh capacity',
      '77 Wh energy',
      'Up to 43 minutes of flight time',
      'LiPo 4S chemistry',
      'Compatible with DJI Mavic 3 series',
    ],
    imagePath: 'media/products-images/12. DJI Matrice 4D Series Battery.jpg',
    featured: false,
  },
  {
    name: 'DJI Mavic 3 Battery Charging Hub',
    category: 'other',
    categoryTag: 'Charging Solutions',
    description:
      '100W charging hub for DJI Mavic 3 batteries that charges up to three batteries in sequence using USB-C input.',
    keyFeatures: [
      '100 W rated power',
      'Charges up to 3 batteries in rotation',
      'USB-C input support',
      'Battery port output up to 17.6V',
      'Designed for DJI Mavic 3 series batteries',
    ],
    imagePath: 'media/products-images/13. DJI Matrice 4D Series 240W Charging Hub.jpg',
    featured: false,
  },
  // Accessories
  {
    name: 'M400 2510F Propeller',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'Durable high-performance propellers engineered for stable and reliable flight on DJI Matrice 400 in demanding conditions.',
    keyFeatures: [
      'High-performance propeller set',
      'Designed for stable flight',
      'Durable construction for field conditions',
      'Optimized reliability for industrial missions',
      'Compatible with DJI Matrice 400',
    ],
    imagePath: 'media/products-images/15. DJI Matrice 4 Series Propellers.jpg',
    featured: false,
  },
  {
    name: 'Matrice 400 Third Gimbal Connector',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'OEM DJI connector enabling third stabilized payload mounting on Matrice 400 for professional multi-sensor missions.',
    keyFeatures: [
      'Supports third gimbal payload integration',
      'Up to 6 kg secured payload support',
      'Up to 3 kg quick-release payload support',
      'Compact and lightweight design',
      'Compatible with DJI Matrice 400',
    ],
    imagePath: 'media/products-images/9. Matrice 400 Dual Gimbal Connector.jpg',
    featured: false,
  },
  {
    name: 'DJI Dock 3 Vehicle-Mounted Gimbal Mount',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'Vehicle-mounted transport accessory for DJI Dock 3 that secures aircraft and gimbal, helping protect against vibration and impact during travel.',
    keyFeatures: [
      'Gimbal securing during transport',
      'Impact and vibration protection',
      'Supports rapid deployment workflows',
      'Maintains gimbal alignment in transit',
      'Compatible with DJI Dock 3',
    ],
    imagePath: 'media/products-images/10. DJI Dock 3 (Overseas Edition).jpg',
    featured: false,
  },
  {
    name: 'DJI RC Plus 2 Strap & Stand Kit',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'Ergonomic strap and bracket system for DJI RC Plus 2 that improves operator comfort and supports hands-free carry during long missions.',
    keyFeatures: [
      'Hands-free carrying support',
      'Ergonomic strap-and-bracket design',
      'Reduces operator fatigue',
      'Built for extended mission use',
      'Compatible with DJI RC Plus 2',
    ],
    imagePath: 'media/products-images/18. Storage Case for H30 Series.jpg',
    featured: false,
  },
  {
    name: 'D-RTK 3 Survey Pole & Tripod Kit',
    category: 'other',
    categoryTag: 'GNSS Solutions',
    description:
      'Precision surveying kit with adjustable self-locking pole and dual-lock tripod for D-RTK 3 base station and rover workflows.',
    keyFeatures: [
      'Self-locking survey pole (125-200 cm)',
      'Dual-lock tripod included',
      'Built for base and rover workflows',
      'Designed for accurate field surveying',
      'Compatible with D-RTK 3 Multifunctional Station',
    ],
    imagePath: 'media/products-images/11. D-RTK 3 Relay Fixed Deployment Version.jpg',
    featured: false,
  },
  {
    name: 'D-RTK 3 Multifunctional Station',
    category: 'other',
    categoryTag: 'GNSS Solutions',
    description:
      'High-performance multi-constellation GNSS station for centimeter-level positioning, range extension relay, and rover-based ground control workflows.',
    keyFeatures: [
      'Base, relay, and rover operating modes',
      'Centimeter-level RTK positioning',
      'Supports major global GNSS constellations',
      'Built-in high-performance IMU',
      'Compatible with DJI Enterprise app and DJI Terra',
    ],
    imagePath: 'media/products-images/11. D-RTK 3 Relay Fixed Deployment Version.jpg',
    featured: true,
  },
  // Software
  {
    name: 'DJI Terra',
    category: 'other',
    categoryTag: 'Software',
    description:
      'Professional mission planning and photogrammetry software for 2D and 3D mapping, point-cloud generation, and orthomosaic production from drone data.',
    keyFeatures: [
      '2D and 3D map generation',
      'Point cloud and orthomosaic processing',
      'Mission planning and execution support',
      'Works with DJI Enterprise drone lineup',
      'RTK-based georeferencing workflows',
    ],
    imagePath: 'media/products-images/20. Zenmuse L3.jpg',
    featured: true,
  },
  {
    name: 'DJI FlightHub 2',
    category: 'other',
    categoryTag: 'Software',
    description:
      'Cloud-based operations platform for mission planning, fleet supervision, remote collaboration, and DJI Dock operations with real-time situational awareness.',
    keyFeatures: [
      'Cloud-based fleet and mission management',
      'Real-time live view and panorama support',
      'Multi-device annotations and team collaboration',
      'DJI Dock remote operation and scheduling',
      'Centralized media and mission data review',
    ],
    imagePath: 'media/products-images/20. Zenmuse L3.jpg',
    featured: true,
  },
]

export const productsData = [...legacyProductsData, ...newProductsData]

async function seedLegacyProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  const mediaItems = await payload.find({ collection: 'media', limit: 1, req })
  const defaultImageId = mediaItems.docs[0]?.id

  for (const productData of legacyProductsData) {
    const existing = await payload.find({
      collection: 'products',
      where: { name: { equals: productData.name } },
      limit: 1,
      req,
    })

    if (existing.docs.length === 0) {
      const productDoc = await payload.create({
        collection: 'products',
        data: {
          name: productData.name,
          nameAr: productData.name,
          category: productData.category as 'drones' | 'payloads' | 'other',
          categoryTag: productData.categoryTag,
          categoryTagAr: LEGACY_CATEGORY_TAG_AR_MAP[productData.categoryTag] || productData.categoryTag,
          description: productData.description as any,
          descriptionAr: textToRichText(legacyToArabicDescription(productData.name, productData.categoryTag), 'rtl'),
          keyFeatures: productData.keyFeatures.map((item) => ({
            feature: item.feature,
            featureAr: FEATURE_AR_MAP[item.feature] || item.feature,
          })),
          images: defaultImageId ? [defaultImageId] : undefined,
          featured: productData.featured,
          ctaText: productData.ctaText,
          ctaTextAr: 'اطلب عرض سعر',
          seo: {
            title: `${productData.name} | Shamal Technologies`,
            description: `Professional ${productData.name} for sale or lease. ${productData.categoryTag} solutions in Saudi Arabia.`,
            keywords: `${productData.name}, ${productData.categoryTag}, drone equipment, Saudi Arabia`,
          },
          _status: 'published',
        } as any,
        draft: false,
        context: { disableRevalidate: true },
        req,
      })

      if (productDoc._status !== 'published') {
        await payload.update({
          collection: 'products',
          id: productDoc.id,
          data: { _status: 'published' },
          context: { disableRevalidate: true },
          req,
        })
      }
      payload.logger.info(`✓ Created legacy product: ${productData.name}`)
    } else {
      const current = existing.docs[0]!
      const restoreContent =
        productData.name === 'DJI Matrice 400'
          ? {
              description: productData.description,
              keyFeatures: productData.keyFeatures.map((item) => ({
                feature: item.feature,
                featureAr: FEATURE_AR_MAP[item.feature] || item.feature,
              })),
            }
          : {}

      await payload.update({
        collection: 'products',
        id: current.id,
        data: {
          _status: 'published',
          ...restoreContent,
          nameAr: current.nameAr || productData.name,
          categoryTagAr:
            current.categoryTagAr ||
            LEGACY_CATEGORY_TAG_AR_MAP[productData.categoryTag] ||
            productData.categoryTag,
          descriptionAr:
            current.descriptionAr ||
            textToRichText(legacyToArabicDescription(productData.name, productData.categoryTag), 'rtl'),
          keyFeatures:
            current.keyFeatures?.map((item: any) => ({
              ...item,
              featureAr:
                typeof item?.featureAr === 'string' && item.featureAr.trim()
                  ? item.featureAr
                  : FEATURE_AR_MAP[item?.feature] || item?.feature,
            })) ||
            productData.keyFeatures.map((item) => ({
              feature: item.feature,
              featureAr: FEATURE_AR_MAP[item.feature] || item.feature,
            })),
          ctaTextAr: current.ctaTextAr || 'اطلب عرض سعر',
        } as any,
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info(`✓ Restored legacy product: ${productData.name}`)
    }
  }
}

async function seedNewProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  for (const productData of newProductsData) {
    const imageId = await ensureMediaFromPublicFile({
      payload,
      req,
      relativePath: productData.imagePath,
      alt: productData.name,
    })

    const productPayload = {
      name: productData.name,
      nameAr: productData.name,
      category: productData.category,
      categoryTag: productData.categoryTag,
      categoryTagAr: NEW_CATEGORY_TAG_AR_MAP[productData.categoryTag] || productData.categoryTag,
      description: textToRichText(productData.description),
      descriptionAr: textToRichText(toArabicDescription(productData.name, productData.categoryTag), 'rtl'),
      keyFeatures: productData.keyFeatures.map((feature) => ({
        feature,
        featureAr: feature,
      })),
      images: imageId ? [imageId] : undefined,
      featured: productData.featured ?? false,
      ctaText: 'Add to Quote',
      ctaTextAr: 'أضف إلى عرض السعر',
      seo: {
        title: `${productData.name} | Shamal Technologies`,
        description: `Professional ${productData.name} for sale or lease. ${productData.categoryTag} solutions in Saudi Arabia.`,
        keywords: `${productData.name}, ${productData.categoryTag}, drone equipment, Saudi Arabia`,
      },
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'products',
      where: { name: { equals: productData.name } },
      limit: 1,
      req,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'products',
        data: productPayload as any,
        draft: false,
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info(`✓ Created product: ${productData.name}`)
    } else {
      await payload.update({
        collection: 'products',
        id: existing.docs[0]!.id,
        data: productPayload as any,
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info(`✓ Updated product: ${productData.name}`)
    }
  }
}

export async function seedProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— Seeding Products...')
  await seedLegacyProducts({ payload, req })
  await seedNewProducts({ payload, req })
  payload.logger.info('✓ Products seeding completed!')
}
