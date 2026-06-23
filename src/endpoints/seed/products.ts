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
    name: 'DJI Matrice 4TD (SP Plus+)',
    category: 'drones',
    categoryTag: 'Thermal Drones',
    description:
      'An IP55-rated, all-weather thermal drone with a 48MP multi-sensor camera, infrared thermal imaging, and an 1800m laser rangefinder. Powered by AI, it is built for public safety, search and rescue, and night operations.',
    keyFeatures: [
      'Multi-sensor Imaging System',
      'Advanced Night Vision',
      'Extended Laser Ranging',
      'Rugged & Long-Endurance',
      'AI-Powered Intelligence',
    ],
    imagePath: 'media/products-images/16. DJI Matrice 4TD (SP Plus+).jpg',
    featured: true,
  },
  {
    name: 'DJI Matrice 4D (SP Plus+)',
    category: 'drones',
    categoryTag: 'Enterprise Drones',
    description:
      'A high-precision, IP55-rated mapping drone with a 4/3 CMOS mechanical-shutter camera and 1800m laser rangefinder for professional surveying and construction.',
    keyFeatures: [
      'High-Precision Mapping Camera',
      'Multi-Sensor Capture',
      'Smart 3D Capture & Modeling',
      'Extended Laser Ranging',
      'Rugged & Long-Endurance',
    ],
    imagePath: 'media/products-images/17. DJI Matrice 4D (SP Plus+).jpg',
    featured: true,
  },
  {
    name: 'DJI Dock 3 (Overseas Edition)',
    category: 'drones',
    categoryTag: 'Autonomous Docking',
    description:
      'A next-generation drone-in-a-box solution for automated, remote operations. Enables rapid deployment and data acquisition without on-site pilots.',
    keyFeatures: [
      'Fully automated operation',
      'Remote mission control',
      'Weather-resistant design',
      'Onboard computing',
      'Enterprise workflow integration',
    ],
    imagePath: 'media/products-images/10. DJI Dock 3 (Overseas Edition).jpg',
    featured: true,
  },
  {
    name: 'Zenmuse H30T',
    category: 'payloads',
    categoryTag: 'Hybrid Sensor',
    description:
      'An all-weather multi-sensor flagship payload that builds on the H30 by adding a powerful infrared thermal camera. Ideal for firefighting, search and rescue, and energy inspection where thermal imaging and high-temperature measurement are critical.',
    keyFeatures: [
      'High-resolution thermal imaging',
      'Extreme temperature measurement',
      'Long-range zoom',
      'Full-color night vision with NIR auxiliary light',
      'All-weather operation',
    ],
    imagePath: 'media/products-images/3. Zenmuse H30T.jpg',
    featured: true,
  },
  {
    name: 'Zenmuse H30',
    category: 'payloads',
    categoryTag: 'Hybrid Sensor',
    description:
      'An all-weather multi-sensor flagship payload that integrates a wide-angle camera, zoom camera, laser rangefinder, and NIR auxiliary light. Designed to transcend the limits of day and night vision for public safety, emergency response, and infrastructure inspection missions.',
    keyFeatures: [
      'Long-range zoom',
      'High-resolution imaging',
      'Extended laser ranging',
      'Full-color night vision with NIR auxiliary light',
      'All-weather operation',
    ],
    imagePath: 'media/products-images/4. Zenmuse H30.jpg',
    featured: true,
  },
  {
    name: 'Zenmuse L2',
    category: 'payloads',
    categoryTag: 'LiDAR Sensor',
    description:
      'A high-precision aerial LiDAR system integrating a frame LiDAR, high-accuracy IMU, and a 4/3 CMOS mapping camera. Delivers efficient and reliable geospatial data acquisition for 3D mapping.',
    keyFeatures: [
      'High precision',
      'Wide coverage',
      'Extended detection range',
      'Dense point cloud capture',
      'IP54 weather protection',
    ],
    imagePath: 'media/products-images/5. Zenmuse L2.jpg',
    featured: false,
  },
  {
    name: 'Zenmuse P1',
    category: 'payloads',
    categoryTag: 'Survey Sensor',
    description:
      'A full-frame, high-precision photogrammetry camera with a 45 MP sensor. Delivers excellent performance for detailed inspection and 3D modeling missions.',
    keyFeatures: [
      'High-resolution imaging',
      'Smart Oblique Capture',
      'High-accuracy time synchronization',
      'Interchangeable lens mount',
      'Versatile mapping capabilities',
    ],
    imagePath: 'media/products-images/6. Zenmuse P1.jpg',
    featured: false,
  },
  {
    name: 'Zenmuse L3',
    category: 'payloads',
    categoryTag: 'LiDAR Sensor',
    description:
      'A next-generation long-range, high-accuracy aerial LiDAR system featuring a 1535nm LiDAR and dual 100MP RGB mapping cameras for advanced geospatial operations.',
    keyFeatures: [
      'Extended detection range',
      'High-precision',
      'Dual 100MP RGB mapping cameras',
      'High efficiency',
      'IP54 weather protection',
    ],
    imagePath: 'media/products-images/20. Zenmuse L3.jpg',
    featured: true,
  },
  // Accessories & other
  {
    name: 'DJI AS1 Speaker',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'Delivers loud, clear audio with a broadcast range of up to 300 meters. Supports real-time and pre-recorded messaging for effective ground communication from the sky.',
    keyFeatures: [
      'High volume (114 dB)',
      'Long broadcast range (300 m)',
      'Text-to-speech support',
      'Real-time broadcasting',
      'Weather protection (IP55 with M4D Series)',
    ],
    imagePath: 'media/products-images/1.DJI AS1 Speaker.jpg',
    featured: false,
  },
  {
    name: 'DJI AL1 Spotlight',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'Provides powerful illumination up to 100 meters away with gimbal-linked tracking for precise targeting. Features wide FOV coverage and dual lighting modes for search and inspection missions.',
    keyFeatures: [
      'Bright illumination (100 m range)',
      'Dual lighting modes',
      'Gimbal-linked tracking',
      'Wide FOV coverage',
      'Weather protection (IP55 with M4D Series)',
    ],
    imagePath: 'media/products-images/2.DJI AL1 Spotlight.jpg',
    featured: false,
  },
  {
    name: 'TB100 Tethered Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'A 977 Wh high-capacity battery designed to power the Matrice 400 for extended tethered missions. Ideal for long-duration operations like aerial lighting and communication relay.',
    keyFeatures: [
      'High-capacity power (977 Wh)',
      'Extended mission duration',
      'Tethered operation support',
      'Third-party device compatibility',
      'Exclusive M400 compatibility',
    ],
    imagePath: 'media/products-images/7. TB100 Tethered Battery.jpg',
    featured: false,
  },
  {
    name: 'BS100 Intelligent Battery Station',
    category: 'other',
    categoryTag: 'Charging Solutions',
    description:
      'A one-stop solution for charging, storing, and transporting TB100 and WB37 batteries. Features multiple charging modes and 360° movement wheels for convenient field transitions.',
    keyFeatures: [
      'Multi-battery charging',
      'Multiple charging modes',
      'Portable design (360° wheels)',
      'Wide temperature operation',
      'Simultaneous TB100 and WB37 charging',
    ],
    imagePath: 'media/products-images/8. BS100 Intelligent Battery Station1.jpg',
    featured: false,
  },
  {
    name: 'Matrice 400 Dual Gimbal Connector',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'Expands the Matrice 400 to support dual gimbal operations. Enables simultaneous payload mounting for maximum mission efficiency.',
    keyFeatures: [
      'Dual gimbal support',
      'High payload capacity',
      'Nose-mounted integration',
      'Seamless M400 compatibility',
      'Payload-dependent weather sealing',
    ],
    imagePath: 'media/products-images/9. Matrice 400 Dual Gimbal Connector.jpg',
    featured: false,
  },
  {
    name: 'D-RTK 3 Relay Fixed Deployment Version',
    category: 'other',
    categoryTag: 'GNSS Solutions',
    description:
      'A fixed base station providing high-precision GNSS correction data for enterprise drone operations. Enables centimeter-level positioning accuracy for reliable missions.',
    keyFeatures: [
      'High-precision GNSS correction',
      'Fixed deployment design',
      'Centimeter-level accuracy',
      'Comprehensive RTK coverage',
      'Reliable data transmission',
    ],
    imagePath: 'media/products-images/11. D-RTK 3 Relay Fixed Deployment Version.jpg',
    featured: false,
  },
  {
    name: 'DJI Matrice 4D Series Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'High-performance intelligent flight battery for the Matrice 4D series. Provides extended flight time and features real-time status monitoring for demanding missions.',
    keyFeatures: [
      'High-capacity power',
      'Intelligent battery management',
      'Real-time monitoring',
      'Fast charging support',
      'Exclusive 4D series compatibility',
    ],
    imagePath: 'media/products-images/12. DJI Matrice 4D Series Battery.jpg',
    featured: false,
  },
  {
    name: 'DJI Matrice 4D Series 240W Charging Hub',
    category: 'other',
    categoryTag: 'Charging Solutions',
    description:
      'High-power charging hub for Matrice 4D series batteries. Enables rapid recharging to minimize mission downtime.',
    keyFeatures: [
      'Fast charging (240W)',
      'Multi-battery charging',
      'Intelligent battery health management',
      'Compact field design',
      'Exclusive 4D series compatibility',
    ],
    imagePath: 'media/products-images/13. DJI Matrice 4D Series 240W Charging Hub.jpg',
    featured: false,
  },
  {
    name: 'DJI TB65 Intelligent Flight Battery',
    category: 'other',
    categoryTag: 'Power Solutions',
    description:
      'The standard high-capacity flight battery for the Matrice 400 platform. Delivers reliable power with intelligent management for extended flight missions.',
    keyFeatures: [
      'High-capacity power',
      'Intelligent management system',
      'Real-time monitoring',
      'Durable design',
      'Hot-swappable operation',
    ],
    imagePath: 'media/products-images/14. DJI TB65 Intelligent Flight Battery.jpg',
    featured: false,
  },
  {
    name: 'DJI Matrice 4 Series Propellers',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'High-efficiency replacement propellers with precision dynamic balancing. Designed for longer flight time, reduced noise, and enhanced safety.',
    keyFeatures: [
      'Precision dynamic balancing',
      'Low-noise operation',
      'High aerodynamic efficiency',
      'Enhanced safety design',
      'Complete set (CW and CCW)',
    ],
    imagePath: 'media/products-images/15. DJI Matrice 4 Series Propellers.jpg',
    featured: false,
  },
  {
    name: 'Storage Case for H30 Series',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'A protective hard case designed for the DJI Zenmuse H30/H30T with a compact design and double safety locks for secure transport.',
    keyFeatures: [
      'Compact and durable hard case design',
      'Double safety lock system',
      'Professional-grade transport protection',
      'Specifically designed for H30/H30T fit',
      'Lightweight & portable build',
    ],
    imagePath: 'media/products-images/18. Storage Case for H30 Series.jpg',
    featured: false,
  },
  {
    name: 'Zenmuse H30T Infrared Density Filter',
    category: 'other',
    categoryTag: 'Accessories',
    description:
      'An accessory that extends the Zenmuse H30T\'s temperature measurement range up to 1600°C for high-temperature industrial and firefighting applications.',
    keyFeatures: [
      'Extended temperature range',
      'High Gain mode range (-20° to 450°C)',
      'Lightweight design (10 g)',
      'Compatible with Zenmuse H30T only',
      'High-temperature measurement',
    ],
    imagePath: 'media/products-images/19. Zenmuse H30T Infrared Density Filter.jpg',
    featured: false,
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
