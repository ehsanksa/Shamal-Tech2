import type { Payload, PayloadRequest } from 'payload'

const CATEGORY_TAG_AR_MAP: Record<string, string> = {
  'Autonomous Docking': 'الإرساء الذاتي',
  'Enterprise Drones': 'طائرات الأعمال',
  'Cargo Drones': 'طائرات الشحن',
  'Thermal Drones': 'طائرات حرارية',
  'Compact Drones': 'طائرات مدمجة',
  'Heavy-Lift Drones': 'طائرات الحمولة الثقيلة',
  'LiDAR Sensor': 'مستشعر LiDAR',
  'Survey Sensor': 'مستشعر مساحي',
  'Visual Sensor': 'مستشعر بصري',
  'Hybrid Sensor': 'مستشعر هجين',
  'Mapping System': 'نظام رسم خرائط',
  'Satellite Solutions': 'حلول الأقمار الصناعية',
}

const FEATURE_AR_MAP: Record<string, string> = {
  'Autonomous operation': 'تشغيل ذاتي',
  'Weather resistant': 'مقاومة للعوامل الجوية',
  'Remote monitoring': 'مراقبة عن بُعد',
  'Scheduled missions': 'مهام مجدولة',
  'Enhanced reliability': 'اعتمادية محسّنة',
  'Extended range': 'مدى تشغيل ممتد',
  'Cloud integration': 'تكامل سحابي',
  'Multi-mission support': 'دعم مهام متعددة',
  '55-min flight time': 'زمن طيران 55 دقيقة',
  'RTK positioning': 'تحديد موقع RTK',
  'IP55 weather rating': 'تصنيف حماية IP55',
  '6-directional sensing': 'استشعار سداسي الاتجاهات',
  '30kg payload': 'حمولة حتى 30 كجم',
  'Long range delivery': 'توصيل بعيد المدى',
  'Precision landing': 'هبوط دقيق',
  'Thermal camera': 'كاميرا حرارية',
  'Zoom camera': 'كاميرا تقريب',
  'Laser rangefinder': 'مقياس مدى ليزري',
  'Portable design': 'تصميم محمول',
  'Quick deployment': 'نشر سريع',
  'Advanced sensors': 'مستشعرات متقدمة',
  'Long flight time': 'زمن طيران طويل',
  'Advanced AI': 'ذكاء اصطناعي متقدم',
  'Multiple payloads': 'دعم حمولات متعددة',
  'Enhanced stability': 'ثبات محسّن',
  'Professional grade': 'جودة احترافية',
  'Heavy payload': 'حمولة ثقيلة',
  'Extended flight time': 'زمن طيران ممتد',
  'Professional reliability': 'موثوقية احترافية',
  'Modular design': 'تصميم معياري',
  'High precision LiDAR': 'LiDAR عالي الدقة',
  '3D mapping': 'رسم خرائط ثلاثية الأبعاد',
  'Survey grade accuracy': 'دقة مساحية احترافية',
  'Long range scanning': 'مسح بعيد المدى',
  'Survey accuracy': 'دقة مساحية',
  'Geospatial data': 'بيانات جيومكانية',
  'High resolution': 'دقة عالية',
  'Visual inspection': 'فحص بصري',
  'Detailed mapping': 'رسم خرائط تفصيلي',
  'Professional quality': 'جودة مهنية',
  'Thermal imaging': 'تصوير حراري',
  'Visual camera': 'كاميرا مرئية',
  'Zoom capability': 'قدرة تقريب',
  'Multi-sensor': 'مستشعرات متعددة',
  'Autonomous navigation': 'ملاحة ذاتية',
  'Complex environments': 'بيئات معقدة',
  'Real-time processing': 'معالجة فورية',
  'Large-scale coverage': 'تغطية واسعة النطاق',
  'High resolution imagery': 'صور عالية الدقة',
  'Multi-temporal analysis': 'تحليل متعدد الأزمنة',
  'Custom solutions': 'حلول مخصصة',
}

function toArabicDescription(name: string, categoryTag: string): string {
  return `${name} هو حل احترافي ضمن فئة ${CATEGORY_TAG_AR_MAP[categoryTag] || categoryTag}، مصمم لدعم مشاريع الطيران والبيانات الجيومكانية بكفاءة واعتمادية عالية في المملكة العربية السعودية.`
}

export const productsData = [
  // Drones
  {
    name: 'DJI Dock 2',
    category: 'drones',
    categoryTag: 'Autonomous Docking',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Next-generation autonomous drone docking station with advanced weather resistance and remote operation capabilities.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Autonomous operation' },
      { feature: 'Weather resistant' },
      { feature: 'Remote monitoring' },
      { feature: 'Scheduled missions' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI Dock 3',
    category: 'drones',
    categoryTag: 'Autonomous Docking',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Latest autonomous docking solution with enhanced reliability and extended operational capabilities for enterprise deployment.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Enhanced reliability' },
      { feature: 'Extended range' },
      { feature: 'Cloud integration' },
      { feature: 'Multi-mission support' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI M350',
    category: 'drones',
    categoryTag: 'Enterprise Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Professional flagship drone with advanced AI capabilities, multiple payload support, and superior flight performance for industrial applications.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: '55-min flight time' },
      { feature: 'RTK positioning' },
      { feature: 'IP55 weather rating' },
      { feature: '6-directional sensing' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI FlyCart 30',
    category: 'drones',
    categoryTag: 'Cargo Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Heavy-duty cargo delivery drone with impressive payload capacity and long-range capabilities for logistics operations.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: '30kg payload' },
      { feature: 'Long range delivery' },
      { feature: 'Precision landing' },
      { feature: 'Weather resistant' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI M30T',
    category: 'drones',
    categoryTag: 'Thermal Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Versatile enterprise drone with integrated thermal imaging, zoom camera, and laser rangefinder in a compact, portable design.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Thermal camera' },
      { feature: 'Zoom camera' },
      { feature: 'Laser rangefinder' },
      { feature: 'Portable design' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Mavic Enterprise',
    category: 'drones',
    categoryTag: 'Compact Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Portable enterprise solution combining compact design with professional features for rapid deployment in the field.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Portable design' },
      { feature: 'Quick deployment' },
      { feature: 'Advanced sensors' },
      { feature: 'Long flight time' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Matrice 4 Series',
    category: 'drones',
    categoryTag: 'Enterprise Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Next-generation professional drone platform with cutting-edge technology and enhanced payload capabilities.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Advanced AI' },
      { feature: 'Multiple payloads' },
      { feature: 'Enhanced stability' },
      { feature: 'Professional grade' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Matrice 400',
    category: 'drones',
    categoryTag: 'Heavy-Lift Drones',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'High-performance heavy-lift platform designed for demanding industrial missions requiring maximum payload capacity.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Heavy payload' },
      { feature: 'Extended flight time' },
      { feature: 'Professional reliability' },
      { feature: 'Modular design' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  // Payloads
  {
    name: 'DJI Zenmuse L3',
    category: 'payloads',
    categoryTag: 'LiDAR Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Advanced LiDAR sensor for precise 3D mapping and surveying applications.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'High precision LiDAR' },
      { feature: '3D mapping' },
      { feature: 'Survey grade accuracy' },
      { feature: 'Long range scanning' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'DJI Zenmuse S1',
    category: 'payloads',
    categoryTag: 'Survey Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Professional survey sensor designed for accurate geospatial data collection.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Survey accuracy' },
      { feature: 'Geospatial data' },
      { feature: 'Professional grade' },
      { feature: 'High resolution' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Zenmuse V1',
    category: 'payloads',
    categoryTag: 'Visual Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'High-resolution visual sensor for detailed inspection and mapping applications.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'High resolution' },
      { feature: 'Visual inspection' },
      { feature: 'Detailed mapping' },
      { feature: 'Professional quality' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  {
    name: 'DJI Zenmuse H30',
    category: 'payloads',
    categoryTag: 'Hybrid Sensor',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Multi-sensor payload combining thermal, visual, and zoom capabilities for comprehensive inspection.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Thermal imaging' },
      { feature: 'Visual camera' },
      { feature: 'Zoom capability' },
      { feature: 'Multi-sensor' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
  {
    name: 'Hovermap',
    category: 'payloads',
    categoryTag: 'Mapping System',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Advanced mapping and navigation system for autonomous drone operations in complex environments.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Autonomous navigation' },
      { feature: 'Complex environments' },
      { feature: '3D mapping' },
      { feature: 'Real-time processing' },
    ],
    ctaText: 'Request Quote',
    featured: false,
  },
  // Other
  {
    name: 'Satellite Imagery Services',
    category: 'other',
    categoryTag: 'Satellite Solutions',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Comprehensive satellite imagery solutions for large-scale mapping, monitoring, and analysis projects.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    keyFeatures: [
      { feature: 'Large-scale coverage' },
      { feature: 'High resolution imagery' },
      { feature: 'Multi-temporal analysis' },
      { feature: 'Custom solutions' },
    ],
    ctaText: 'Request Quote',
    featured: true,
  },
]

export async function seedProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— Seeding Products...')

  // Get a media item for product images (use first available or create a placeholder)
  const mediaItems = await payload.find({
    collection: 'media',
    limit: 1,
  })
  const defaultImageId = mediaItems.docs[0]?.id

  for (const productData of productsData) {
    const existing = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: productData.name.toLowerCase().replace(/\s+/g, '-'),
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      const productDoc = await payload.create({
        collection: 'products',
        data: {
          name: productData.name,
          nameAr: productData.name,
          category: productData.category as 'drones' | 'payloads' | 'other',
          categoryTag: productData.categoryTag,
          categoryTagAr: CATEGORY_TAG_AR_MAP[productData.categoryTag] || productData.categoryTag,
          description: productData.description as any,
          descriptionAr: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: toArabicDescription(productData.name, productData.categoryTag),
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      version: 1,
                    },
                  ],
                  direction: 'rtl',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'rtl',
              format: '',
              indent: 0,
              version: 1,
            },
          },
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
        } as any,
        draft: false,
        context: {
          disableRevalidate: true,
        },
        req,
      })
      
      // Publish the document if it was created as draft
      if (productDoc._status !== 'published') {
        await payload.update({
          collection: 'products',
          id: productDoc.id,
          data: {
            _status: 'published',
          },
          context: {
            disableRevalidate: true,
          },
          req,
        })
      }
      payload.logger.info(`✓ Created product: ${productData.name}`)
    } else {
      await payload.update({
        collection: 'products',
        id: existing.docs[0]!.id,
        data: {
          nameAr: existing.docs[0]!.nameAr || productData.name,
          categoryTagAr:
            existing.docs[0]!.categoryTagAr ||
            CATEGORY_TAG_AR_MAP[productData.categoryTag] ||
            productData.categoryTag,
          descriptionAr:
            existing.docs[0]!.descriptionAr ||
            {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: toArabicDescription(productData.name, productData.categoryTag),
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      },
                    ],
                    direction: 'rtl',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'rtl',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          keyFeatures:
            existing.docs[0]!.keyFeatures?.map((item: any) => ({
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
          ctaTextAr: existing.docs[0]!.ctaTextAr || 'اطلب عرض سعر',
        } as any,
        context: {
          disableRevalidate: true,
        },
        req,
      })
      payload.logger.info(`✓ Product already exists: ${productData.name}`)
    }
  }

  payload.logger.info('✓ Products seeding completed!')
}

