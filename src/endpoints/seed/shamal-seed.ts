import type { Payload, PayloadRequest } from 'payload'
import { ensureMediaFromPublicFile } from '../../lib/cms/ensureMediaFromPublicFile'
import { syncSeoKeywordsFromPublicFile } from '../../lib/seo/syncKeywordsFromPublicTxt'
import { seedProducts } from './products'

const SERVICE_DEFINITIONS = [
  { name: 'Aerial Survey', slug: 'aerial-survey' },
  { name: 'Construction Monitoring', slug: 'construction-monitoring' },
  { name: 'Asset Inspection', slug: 'asset-inspection' },
  { name: 'Bathymetric & Underwater Survey', slug: 'bathymetric-underwater-survey' },
  { name: 'GIS & Remote Sensing', slug: 'gis-remote-sensing' },
  { name: 'Environmental Monitoring', slug: 'environmental-monitoring' },
  { name: 'SCAN/CAD to BIM', slug: 'scan-cad-to-bim' },
  { name: 'Mining & Exploration', slug: 'mining-exploration' },
  { name: 'Security Surveillance', slug: 'security-surveillance' },
  { name: 'AI Application Development', slug: 'ai-application-development' },
  { name: 'Agriculture Monitoring', slug: 'agriculture-monitoring' },
  { name: 'Special Projects', slug: 'special-projects' },
  { name: 'Traffic Count & Traffice Analysis', slug: 'traffic-count-traffice-analysis' },
]

const SERVICE_NAME_AR_MAP: Record<string, string> = {
  'Aerial Survey': 'المسح الجوي',
  'Construction Monitoring': 'مراقبة أعمال الإنشاء',
  'Asset Inspection': 'فحص الأصول',
  'Bathymetric & Underwater Survey': 'المسح الباثيمتري وتحت الماء',
  'GIS & Remote Sensing': 'نظم المعلومات الجغرافية والاستشعار عن بُعد',
  'Environmental Monitoring': 'المراقبة البيئية',
  'SCAN/CAD to BIM': 'تحويل SCAN/CAD إلى نماذج BIM',
  'Mining & Exploration': 'التعدين والاستكشاف',
  'Security Surveillance': 'المراقبة الأمنية',
  'AI Application Development': 'تطوير تطبيقات الذكاء الاصطناعي',
  'Agriculture Monitoring': 'مراقبة الزراعة',
  'Special Projects': 'المشاريع الخاصة',
  'Traffic Count & Traffice Analysis': 'عدّ المرور وتحليل الحركة المرورية',
}

export const shamalSeed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Shamal Technologies database...')

  // Check if admin user exists
  const existingAdmin = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: process.env.SEED_ADMIN_EMAIL || 'admin@shamal.sa',
      },
    },
    limit: 1,
  })

  let adminUser
  if (existingAdmin.docs.length === 0) {
    payload.logger.info('— Creating admin user...')
    adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin',
        email: process.env.SEED_ADMIN_EMAIL || 'admin@shamal.sa',
        password: process.env.SEED_ADMIN_PASSWORD || 'change-me-in-production',
        roles: ['admin'],
      },
      req,
    })
    payload.logger.info(`✓ Created admin user: ${adminUser.email}`)
  } else {
    adminUser = existingAdmin.docs[0]
    payload.logger.info(`✓ Admin user already exists: ${adminUser.email}`)
  }

  // Seed Services
  payload.logger.info('— Seeding Services...')
  const sharedServiceHeroImageId = await ensureMediaFromPublicFile({
    payload,
    req,
    relativePath: 'media/hero-banners/hero-services.png',
    alt: 'Services hero banner',
  })

  const services = []
  for (let i = 0; i < SERVICE_DEFINITIONS.length; i++) {
    const serviceName = SERVICE_DEFINITIONS[i]!.name
    const serviceSlug = SERVICE_DEFINITIONS[i]!.slug
    const serviceNameAr = SERVICE_NAME_AR_MAP[serviceName] || serviceName
    const existing = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceSlug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      const mediaItems = await payload.find({ collection: 'media', limit: 1, req })
      const heroImageId = sharedServiceHeroImageId || mediaItems.docs[0]?.id

      const service = await payload.create({
        collection: 'services',
        data: {
          _status: 'published',
          title: serviceName,
          slug: serviceSlug,
          heroImage: heroImageId || undefined,
          heroTitle: `${serviceName} - Professional Drone Services`,
          heroTitleAr: `${serviceNameAr} - خدمات طائرات بدون طيار احترافية`,
          heroDescription: `Expert ${serviceName} services in Saudi Arabia.`,
          heroDescriptionAr: `خدمات ${serviceNameAr} متقدمة باحترافية عالية داخل المملكة العربية السعودية.`,
          benefits: [
            {
              title: 'Expert Team',
              titleAr: 'فريق متخصص',
              description: 'Certified professionals with years of experience',
              descriptionAr: 'خبراء معتمدون بخبرة عملية واسعة في تنفيذ المشاريع.',
            },
            {
              title: 'Latest Technology',
              titleAr: 'أحدث التقنيات',
              description: 'State-of-the-art equipment and software',
              descriptionAr: 'معدات وأنظمة برمجية حديثة بمعايير تشغيل احترافية.',
            },
          ],
          applications: [
            {
              title: 'Industry Applications',
              titleAr: 'تطبيقات قطاعية',
              description: 'Wide range of industry applications',
              descriptionAr: 'حلول عملية تغطي نطاقاً واسعاً من احتياجات القطاعات المختلفة.',
            },
          ],
          technologies: [
            {
              name: 'Advanced Drones',
              nameAr: 'طائرات متقدمة بدون طيار',
              description: 'Latest drone technology',
              descriptionAr: 'تقنيات حديثة للطائرات بدون طيار تدعم الدقة والكفاءة.',
            },
          ],
          faqs: [
            {
              question: `What is ${serviceName}?`,
              questionAr: `ما هي خدمة ${serviceNameAr}؟`,
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: `${serviceName} is a specialized service we offer.`,
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
              answerAr: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: `${serviceNameAr} هي خدمة تخصصية نقدمها وفق أعلى المعايير المهنية.`,
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
            },
          ],
          ctaTitle: 'Get Started Today',
          ctaTitleAr: 'ابدأ اليوم',
          ctaDescription: 'Contact us to learn more about our services',
          ctaDescriptionAr: 'تواصل معنا لمعرفة المزيد حول خدماتنا وحلولنا المتكاملة.',
          ctaButtonText: 'Contact Us',
          ctaButtonTextAr: 'تواصل معنا',
          seo: {
            title: `${serviceName} | Shamal Technologies`,
            description: `Professional ${serviceName} services in Saudi Arabia.`,
            keywords: `${serviceName}, drone services, Saudi Arabia`,
          },
        },
        context: {
          disableRevalidate: true,
        },
        req,
      })
      services.push(service)
      payload.logger.info(`✓ Created service: ${serviceName}`)
    } else {
      const current = existing.docs[0]
      const patched = await payload.update({
        collection: 'services',
        id: current.id,
        data: {
          heroImage: current.heroImage || sharedServiceHeroImageId || undefined,
          heroTitle: current.heroTitle?.trim() ? current.heroTitle : `${serviceName} - Professional Drone Services`,
          heroTitleAr:
            current.heroTitleAr?.trim()
              ? current.heroTitleAr
              : `${serviceNameAr} - خدمات طائرات بدون طيار احترافية`,
          heroDescription:
            current.heroDescription?.trim() ? current.heroDescription : `Expert ${serviceName} services in Saudi Arabia.`,
          heroDescriptionAr:
            current.heroDescriptionAr?.trim()
              ? current.heroDescriptionAr
              : `خدمات ${serviceNameAr} متقدمة باحترافية عالية داخل المملكة العربية السعودية.`,
          benefits: current.benefits?.length
            ? current.benefits
            : [
                {
                  title: 'Expert Team',
                  titleAr: 'فريق متخصص',
                  description: 'Certified professionals with years of experience',
                  descriptionAr: 'خبراء معتمدون بخبرة عملية واسعة في تنفيذ المشاريع.',
                },
                {
                  title: 'Latest Technology',
                  titleAr: 'أحدث التقنيات',
                  description: 'State-of-the-art equipment and software',
                  descriptionAr: 'معدات وأنظمة برمجية حديثة بمعايير تشغيل احترافية.',
                },
              ],
          applications: current.applications?.length
            ? current.applications
            : [
                {
                  title: 'Industry Applications',
                  titleAr: 'تطبيقات قطاعية',
                  description: 'Wide range of industry applications',
                  descriptionAr: 'حلول عملية تغطي نطاقاً واسعاً من احتياجات القطاعات المختلفة.',
                },
              ],
          technologies: current.technologies?.length
            ? current.technologies
            : [
                {
                  name: 'Advanced Drones',
                  nameAr: 'طائرات متقدمة بدون طيار',
                  description: 'Latest drone technology',
                  descriptionAr: 'تقنيات حديثة للطائرات بدون طيار تدعم الدقة والكفاءة.',
                },
              ],
          faqs: current.faqs?.length
            ? current.faqs
            : [
                {
                  question: `What is ${serviceName}?`,
                  questionAr: `ما هي خدمة ${serviceNameAr}؟`,
                  answer: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: `${serviceName} is a specialized service we offer.`,
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
                  answerAr: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              text: `${serviceNameAr} هي خدمة تخصصية نقدمها وفق أعلى المعايير المهنية.`,
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
                },
              ],
          ctaTitle: current.ctaTitle?.trim() ? current.ctaTitle : 'Get Started Today',
          ctaTitleAr: current.ctaTitleAr?.trim() ? current.ctaTitleAr : 'ابدأ اليوم',
          ctaDescription:
            current.ctaDescription?.trim()
              ? current.ctaDescription
              : 'Contact us to learn more about our services',
          ctaDescriptionAr:
            current.ctaDescriptionAr?.trim()
              ? current.ctaDescriptionAr
              : 'تواصل معنا لمعرفة المزيد حول خدماتنا وحلولنا المتكاملة.',
          ctaButtonText: current.ctaButtonText?.trim() ? current.ctaButtonText : 'Contact Us',
          ctaButtonTextAr: current.ctaButtonTextAr?.trim() ? current.ctaButtonTextAr : 'تواصل معنا',
        },
        context: {
          disableRevalidate: true,
        },
        req,
      })
      services.push(patched)
      payload.logger.info(`✓ Service exists and was validated: ${serviceName}`)
    }
  }

  // Seed Sectors Content
  payload.logger.info('— Seeding Sectors Content...')
  const sectorDefinitions = [
    {
      name: 'Government',
      nameAr: 'القطاع الحكومي',
      slug: 'government',
      description:
        'Supporting public sector initiatives with aerial mapping, infrastructure monitoring, and data-driven planning insights.',
      descriptionAr:
        'ندعم مبادرات الجهات الحكومية عبر المسح الجوي ومراقبة البنية التحتية وتقديم رؤى تخطيطية مبنية على البيانات.',
    },
    {
      name: 'Transportation',
      nameAr: 'قطاع النقل',
      slug: 'transportation',
      description:
        'Improving transport planning and operations through corridor surveys, traffic intelligence, and asset condition monitoring.',
      descriptionAr:
        'نعزز تخطيط وتشغيل النقل من خلال مسح الممرات وتحليل الحركة المرورية ومراقبة حالة الأصول.',
    },
    {
      name: 'Mining',
      nameAr: 'قطاع التعدين',
      slug: 'mining',
      description:
        'Enabling safer and more efficient mining with volumetric analysis, site inspections, and terrain intelligence.',
      descriptionAr:
        'نمكن عمليات تعدين أكثر أماناً وكفاءة عبر التحليل الحجمي وفحوصات المواقع والتحليلات الطبوغرافية.',
    },
    {
      name: 'Construction',
      nameAr: 'قطاع الإنشاءات',
      slug: 'construction',
      description:
        'Helping project teams track progress, reduce risk, and make faster decisions with reliable site data.',
      descriptionAr:
        'نساعد فرق المشاريع على تتبع التقدم وخفض المخاطر واتخاذ قرارات أسرع بالاعتماد على بيانات موقع دقيقة.',
    },
    {
      name: 'Real Estate',
      nameAr: 'قطاع العقار',
      slug: 'real-estate',
      description:
        'Providing high-quality visual and spatial data for property development, marketing, and portfolio management.',
      descriptionAr:
        'نوفر بيانات بصرية ومكانية عالية الجودة لتطوير العقارات والتسويق وإدارة المحافظ العقارية.',
    },
    {
      name: 'Education',
      nameAr: 'قطاع التعليم',
      slug: 'education',
      description:
        'Supporting academic institutions with smart campus mapping, facility assessments, and technology-enabled learning projects.',
      descriptionAr:
        'ندعم المؤسسات التعليمية عبر خرائط الحرم الذكي وتقييم المرافق ومشاريع التعليم المدعومة بالتقنية.',
    },
    {
      name: 'Oil & Gas',
      nameAr: 'قطاع النفط والغاز',
      slug: 'oil-gas',
      description:
        'Enhancing operational safety and reliability with remote inspections, pipeline monitoring, and geospatial analytics.',
      descriptionAr:
        'نعزز السلامة التشغيلية والاعتمادية عبر الفحص عن بُعد ومراقبة خطوط الأنابيب والتحليلات الجيومكانية.',
    },
    {
      name: 'Heritage',
      nameAr: 'قطاع التراث',
      slug: 'heritage',
      description:
        'Preserving cultural and historical assets through non-intrusive documentation, 3D modeling, and condition tracking.',
      descriptionAr:
        'نحافظ على الأصول الثقافية والتاريخية من خلال التوثيق غير التدخلي والنمذجة ثلاثية الأبعاد وتتبع الحالة.',
    },
    {
      name: 'Marine',
      nameAr: 'القطاع البحري',
      slug: 'marine',
      description:
        'Delivering coastal and offshore insights for ports, shoreline assets, and marine infrastructure management.',
      descriptionAr:
        'نقدم رؤى للمناطق الساحلية والبحرية لدعم إدارة الموانئ والأصول الساحلية والبنية التحتية البحرية.',
    },
    {
      name: 'Agriculture & Environment',
      nameAr: 'قطاع الزراعة والبيئة',
      slug: 'agriculture',
      description:
        'Supporting sustainable land use with crop intelligence, environmental monitoring, and resource optimization.',
      descriptionAr:
        'ندعم الاستخدام المستدام للأراضي عبر ذكاء المحاصيل والمراقبة البيئية وتحسين استثمار الموارد.',
    },
    {
      name: 'Utilities',
      nameAr: 'قطاع المرافق',
      slug: 'utilities',
      description:
        'Improving utility network reliability through efficient inspections, vegetation risk detection, and asset mapping.',
      descriptionAr:
        'نرفع موثوقية شبكات المرافق من خلال الفحص الفعّال واكتشاف مخاطر الغطاء النباتي ورسم خرائط الأصول.',
    },
    {
      name: 'Application Development',
      nameAr: 'تطوير التطبيقات',
      slug: 'application-development',
      description:
        'Building tailored digital applications that transform geospatial and operational data into actionable workflows.',
      descriptionAr:
        'نطور تطبيقات رقمية مخصصة تحول البيانات الجيومكانية والتشغيلية إلى إجراءات عمل قابلة للتنفيذ.',
    },
  ]

  const sectorsData = sectorDefinitions.map(({ name, nameAr, slug, description, descriptionAr }) => ({
    name,
    nameAr,
    slug,
    description,
    descriptionAr,
    useCases: [
      {
        title: 'Sector-Specific Applications',
        titleAr: 'تطبيقات متخصصة للقطاع',
        description: `Tailored solutions for ${name} sector needs`,
        descriptionAr: `حلول مصممة خصيصاً لاحتياجات قطاع ${nameAr}`,
      },
    ],
    solutionsDelivered: [
      {
        title: 'Custom Solutions',
        titleAr: 'حلول مخصصة',
        description: `Specialized solutions for ${name} sector`,
        descriptionAr: `حلول متخصصة لقطاع ${nameAr}`,
      },
    ],
  }))
  const sectorsImageId = await ensureMediaFromPublicFile({
    payload,
    req,
    relativePath: 'media/hero-banners/hero-services.png',
    alt: 'Sectors default image',
  })

  const existingSectors = await payload.findGlobal({
    slug: 'sectors-content',
  })

  const existingSectorsList = existingSectors?.sectors || []
  const existingSectorsBySlug = new Map(
    existingSectorsList.map((sector) => [sector.slug?.toLowerCase().trim() || '', sector])
  )

  // Keep existing records intact; only prefill missing sectors and empty text fields.
  const mergedSectorsData = sectorDefinitions.map(({ name, nameAr, slug, description, descriptionAr }) => {
    const existing = existingSectorsBySlug.get(slug)
    if (!existing) {
      return sectorsData.find((sector) => sector.slug === slug)!
    }

    return {
      ...existing,
      name: existing.name?.trim() ? existing.name : name,
      nameAr: existing.nameAr?.trim() ? existing.nameAr : nameAr,
      slug: existing.slug?.trim() ? existing.slug : slug,
      description: existing.description?.trim() ? existing.description : description,
      descriptionAr: existing.descriptionAr?.trim() ? existing.descriptionAr : descriptionAr,
      image: existing.image || sectorsImageId || undefined,
      useCases: existing.useCases?.length
        ? existing.useCases
        : [
            {
              title: 'Sector-Specific Applications',
              titleAr: 'تطبيقات متخصصة للقطاع',
              description: `Tailored solutions for ${name} sector needs`,
              descriptionAr: `حلول مصممة خصيصاً لاحتياجات قطاع ${nameAr}`,
            },
          ],
      solutionsDelivered: existing.solutionsDelivered?.length
        ? existing.solutionsDelivered
        : [
            {
              title: 'Custom Solutions',
              titleAr: 'حلول مخصصة',
              description: `Specialized solutions for ${name} sector`,
              descriptionAr: `حلول متخصصة لقطاع ${nameAr}`,
            },
          ],
    }
  })

  const needsSectorsPrefill =
    !existingSectors ||
    !existingSectors.sectors ||
    existingSectors.sectors.length === 0 ||
    mergedSectorsData.length !== existingSectorsList.length ||
    mergedSectorsData.some((sector, index) => {
      const current = existingSectorsList[index]
      return (
        !current ||
        !current.name?.trim() ||
        !current.nameAr?.trim() ||
        !current.slug?.trim() ||
        !current.description?.trim() ||
        !current.descriptionAr?.trim()
      )
    })

  if (needsSectorsPrefill) {
    await payload.updateGlobal({
      slug: 'sectors-content',
      data: {
        sectors: mergedSectorsData,
      },
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Prefilled Sectors Content')
  } else {
    payload.logger.info('✓ Sectors Content already complete')
  }

  // Seed Site Settings
  payload.logger.info('— Seeding Site Settings...')
  const existingSiteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  if (!existingSiteSettings || !existingSiteSettings.siteName) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'Shamal Technologies',
        siteDescription:
          'Pioneering provider of drone and geospatial solutions in Saudi Arabia. Expert drone survey and geospatial services.',
        contactInfo: {
          phone: '+966 (0) 53 030 1370',
          email: 'hello@shamal.sa',
          address:
            '11th floor, Office no:1109, The Headquarters Business Park, Jeddah 23511',
          mapEmbedUrl:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.576529544237!2d39.10571367472985!3d21.60244686782873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db0078a8628d%3A0x76e949674d3f8aa4!2sShamal%20Technologies!5e0!3m2!1sen!2ssa!4v1765110005511!5m2!1sen!2ssa',
          mapLink: 'https://maps.app.goo.gl/19WL7fCtwww1KBRz6',
        },
        socialMedia: {
          linkedin: 'https://www.linkedin.com/company/shamal-technologies',
          facebook: 'https://www.facebook.com/shamaltechnologies',
          youtube: 'https://www.youtube.com/@shamaltechnologies',
          instagram: 'https://www.instagram.com/shamaltechnologies',
          twitter: 'https://x.com/shamaltechnologies',
        },
      },
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Seeded Site Settings')
  } else {
    payload.logger.info('✓ Site Settings already exists')
    // Add social media URLs if missing (enables footer icons)
    const hasSocialUrls = existingSiteSettings.socialMedia && Object.values(existingSiteSettings.socialMedia || {}).some(Boolean)
    if (!hasSocialUrls) {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          socialMedia: {
            linkedin: 'https://www.linkedin.com/company/shamal-technologies',
            facebook: 'https://www.facebook.com/shamaltechnologies',
            youtube: 'https://www.youtube.com/@shamaltechnologies',
            instagram: 'https://www.instagram.com/shamaltechnologies',
            twitter: 'https://x.com/shamaltechnologies',
          },
        },
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info('✓ Added social media URLs to Site Settings')
    }
  }

  // Seed Homepage Content
  payload.logger.info('— Seeding Homepage Content...')
  const existingHomepage = await payload.findGlobal({
    slug: 'homepage-content',
  })

  const needsHomepageUpdate =
    !existingHomepage ||
    !existingHomepage.hero ||
    !existingHomepage.hero?.title ||
    existingHomepage.hero?.title === ''

  if (needsHomepageUpdate) {
    const homepageData: any = {
      hero: {
        title: 'Shamal Technologies',
        titleAr: 'شمال للتقنيات',
        subtitle:
          'Pioneering provider of drone and geospatial solutions in Saudi Arabia',
        subtitleAr:
          'مزود رائد لحلول الطائرات بدون طيار والحلول الجيومكانية في المملكة العربية السعودية',
        ctaText: 'Get Started',
        ctaTextAr: 'ابدأ الآن',
      },
        impactStats: {
          badge: 'Our Impact',
          badgeAr: 'تأثيرنا',
          heading: 'Delivering Excellence Across Industries',
          headingAr: 'تقديم التميز عبر الصناعات',
          stats: [
            { value: 100, suffix: '+', label: 'Projects Completed', labelAr: 'مشاريع منجزة' },
            { value: 80, suffix: '+', label: 'Expert Team', labelAr: 'فريق خبراء' },
            { value: 11, label: 'Sectors Served', labelAr: 'قطاعات نخدمها' },
            { value: 90, suffix: '%', label: 'Client Satisfaction', labelAr: 'رضا العملاء' },
          ],
        },
        servicesOverview: {
          title: 'Our Services',
          titleAr: 'خدماتنا',
          description: 'Comprehensive drone and geospatial solutions for your needs',
          descriptionAr: 'حلول شاملة بالطائرات بدون طيار والبيانات الجيومكانية لتلبية احتياجاتكم.',
        },
        sectors: {
          badge: 'Industries',
          badgeAr: 'القطاعات',
          title: 'SECTORS WE SERVE',
          titleAr: 'القطاعات التي نخدمها',
          description: 'We serve multiple sectors with specialized solutions',
          descriptionAr: 'نخدم مجموعة واسعة من القطاعات عبر حلول متخصصة.',
        },
        aboutPreview: {
          badge: 'Who We Are?',
          badgeAr: 'من نحن؟',
          title: 'About Shamal Technologies',
          titleAr: 'عن شمال للتقنيات',
          description:
            'Combining cutting-edge technology with deep industry expertise',
          descriptionAr: 'نجمع بين التقنية المتقدمة والخبرة العميقة في القطاعات المختلفة.',
          ctaText: 'Learn More',
          ctaTextAr: 'اعرف المزيد',
        },
        blogPreview: {
          title: 'Latest Insights',
          titleAr: 'أحدث الرؤى',
          description: 'Stay updated with our latest news and insights',
          descriptionAr: 'تابع آخر الأخبار والرؤى المتخصصة من فريقنا.',
          ctaText: 'Read Blog',
          ctaTextAr: 'اقرأ المدونة',
        },
        contactCTA: {
          badge: 'Get In Touch',
          badgeAr: 'تواصل معنا',
          title: 'Get In Touch',
          titleAr: 'تواصل معنا',
          description: 'Contact us to discuss your project needs',
          descriptionAr: 'تواصل معنا لمناقشة احتياجات مشروعك',
          ctaText: 'Contact Us Today',
          ctaTextAr: 'تواصل معنا اليوم',
          secondaryCtaText: 'Explore Services',
          secondaryCtaTextAr: 'استكشف خدماتنا',
        },
    }

    await payload.updateGlobal({
      slug: 'homepage-content',
      data: homepageData,
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Seeded Homepage Content')
  } else {
    payload.logger.info('✓ Homepage Content already exists')
  }

  // Seed About Page Content
  payload.logger.info('— Seeding About Page Content...')
  const existingAbout = await payload.findGlobal({
    slug: 'about-page-content',
  })

  const needsAboutUpdate =
    !existingAbout ||
    !existingAbout.hero ||
    !existingAbout.hero?.title ||
    existingAbout.hero?.title === ''

  if (needsAboutUpdate) {
    const aboutData: any = {
      hero: {
        badge: 'Our Story',
        badgeAr: 'قصتنا',
        title: 'About Shamal Technologies',
        titleAr: 'عن شمال للتقنيات',
        description:
          'Shamal Technologies is a pioneering provider of drone and geospatial solutions in Saudi Arabia. We combine cutting-edge technology with deep industry expertise to deliver unparalleled insights for projects across construction, infrastructure, mining, agriculture, and environmental sectors.',
        descriptionAr:
          'شركة شمال للتقنيات مزود رائد لحلول الطائرات بدون طيار والحلول الجيومكانية في المملكة العربية السعودية. نجمع بين التقنية المتقدمة والخبرة القطاعية العميقة لتقديم رؤى دقيقة تدعم مشاريع الإنشاءات والبنية التحتية والتعدين والزراعة والبيئة.',
      },
        vision: {
          title: 'Our Vision',
          titleAr: 'رؤيتنا',
          description: 'Our long-term direction and ambition.',
          descriptionAr: 'اتجاهنا الاستراتيجي وطموحنا المستقبلي.',
          content: 'To be the leading provider of drone and geospatial solutions in Saudi Arabia.',
          contentAr: 'أن نكون المزود الرائد لحلول الطائرات بدون طيار والحلول الجيومكانية في المملكة العربية السعودية.',
        },
        mission: {
          title: 'Our Mission',
          titleAr: 'رسالتنا',
          description: 'What we deliver for our clients every day.',
          descriptionAr: 'ما نقدمه لعملائنا يومياً من قيمة عملية موثوقة.',
          content:
            'To deliver exceptional geospatial intelligence through innovative technology and expert service.',
          contentAr:
            'تقديم ذكاء جيومكاني استثنائي عبر تقنيات مبتكرة وخدمات احترافية عالية الجودة.',
        },
        certifications: [],
        achievements: [],
        timeline: [],
        leadership: [],
        clients: [],
        strengths: [],
    }

    await payload.updateGlobal({
      slug: 'about-page-content',
      data: aboutData,
      context: {
        disableRevalidate: true,
      },
      req,
    })
    payload.logger.info('✓ Seeded About Page Content')
  } else {
    payload.logger.info('✓ About Page Content already exists')
  }

  // SEO: single source of truth is public/keywords.txt (collection + globals, replaces stale defaults)
  payload.logger.info('— Syncing SEO from public/keywords.txt…')
  const seoSync = await syncSeoKeywordsFromPublicFile({ payload, req })
  payload.logger.info(
    `✓ SEO synced: EN=${seoSync.parsedCount} AR=${seoSync.parsedArabicCount}, seo-keywords +${seoSync.collectionCreated}/~${seoSync.collectionUpdated}, EN primary=${seoSync.primaryKeywordsCount} AR total=${seoSync.arabicKeywordsCount}`,
  )

  // Seed Products
  await seedProducts({ payload, req })

  payload.logger.info('✓ Shamal Technologies database seeding completed!')
}

