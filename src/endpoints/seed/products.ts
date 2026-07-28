import type { Payload, PayloadRequest } from 'payload'
import { ensureMediaFromPublicFile } from '../../lib/cms/ensureMediaFromPublicFile'
import {
  catalogProductsData,
  PRODUCT_LIST_PRICES,
  PRODUCT_NAME_ALIASES,
  UNPUBLISHED_CATALOG_NAMES,
  type CatalogProduct,
} from './catalog-products-data'

const CATEGORY_TAG_AR_MAP: Record<string, string> = {
  'Autonomous Docking': 'الإرساء الذاتي',
  'Enterprise Drones': 'طائرات الأعمال',
  'Thermal Drones': 'الطائرات الحرارية',
  'Heavy-Lift Drones': 'طائرات الحمولة الثقيلة',
  'Multispectral Drones': 'طائرات متعددة الأطياف',
  'Broadcast Payloads': 'حمولات البث',
  'Lighting Payloads': 'حمولات الإضاءة',
  'LiDAR Sensor': 'مستشعر LiDAR',
  'Survey Sensor': 'مستشعر مساحي',
  'Visual Sensor': 'مستشعر بصري',
  'Hybrid Sensor': 'مستشعر هجين',
  Accessories: 'ملحقات',
  'BATTERIES & POWER': 'البطاريات والطاقة',
  'Power Solutions': 'حلول الطاقة',
  'Charging Solutions': 'حلول الشحن',
  'GNSS Solutions': 'حلول GNSS',
  Software: 'البرمجيات',
}

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

function toArabicDescription(name: string, categoryTag: string): string {
  return `${name} هو حل احترافي ضمن فئة ${CATEGORY_TAG_AR_MAP[categoryTag] || categoryTag}، مصمم لدعم مشاريع الطيران والبيانات الجيومكانية بكفاءة واعتمادية عالية في المملكة العربية السعودية.`
}

function buildAliasLookup(): Map<string, string> {
  const lookup = new Map<string, string>()
  for (const product of catalogProductsData) {
    lookup.set(product.name.toLowerCase(), product.name)
    const aliases = PRODUCT_NAME_ALIASES[product.name] || []
    for (const alias of aliases) {
      lookup.set(alias.toLowerCase(), product.name)
    }
  }
  return lookup
}

const aliasLookup = buildAliasLookup()

function resolveCanonicalName(name: string): string {
  return aliasLookup.get(name.toLowerCase()) || name
}

async function findExistingProduct({
  payload,
  req,
  canonicalName,
}: {
  payload: Payload
  req: PayloadRequest
  canonicalName: string
}) {
  const namesToCheck = [canonicalName, ...(PRODUCT_NAME_ALIASES[canonicalName] || [])]

  for (const name of namesToCheck) {
    const existing = await payload.find({
      collection: 'products',
      where: { name: { equals: name } },
      limit: 1,
      req,
    })
    if (existing.docs[0]) {
      return existing.docs[0]
    }
  }

  return null
}

async function buildProductPayload({
  payload,
  req,
  product,
}: {
  payload: Payload
  req: PayloadRequest
  product: CatalogProduct
}) {
  let imageIds: (number | string)[] = []
  if (product.imagePath) {
    const imageId = await ensureMediaFromPublicFile({
      payload,
      req,
      relativePath: product.imagePath,
      alt: product.name,
    })
    if (imageId) {
      imageIds = [imageId]
    }
  }

  return {
    name: product.name,
    nameAr: product.name,
    category: product.category,
    categoryTag: product.categoryTag,
    categoryTagAr: CATEGORY_TAG_AR_MAP[product.categoryTag] || product.categoryTag,
    compatibility: product.compatibility || undefined,
    description: textToRichText(product.description),
    descriptionAr: textToRichText(toArabicDescription(product.name, product.categoryTag), 'rtl'),
    inTheBox: product.inTheBox.map((item) => ({ item })),
    specifications: product.specifications,
    keyFeatures: product.keyFeatures.map((feature) => ({
      feature,
      featureAr: feature,
    })),
    images: imageIds,
    featured: product.featured,
    price: PRODUCT_LIST_PRICES[product.name] ?? undefined,
    ctaText: 'Add to Quote',
    ctaTextAr: 'أضف إلى عرض السعر',
    seo: {
      metaTitle: `${product.name} | Shamal Technologies`,
      metaDescription: `Professional ${product.name} for sale or lease. ${product.categoryTag} solutions in Saudi Arabia.`,
      keywords: `${product.name}, ${product.categoryTag}, drone equipment, Saudi Arabia`,
    },
    _status: UNPUBLISHED_CATALOG_NAMES.has(product.name) ? ('draft' as const) : ('published' as const),
  }
}

export async function seedProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— Syncing catalog products...')

  const syncedCanonicalNames = new Set<string>()

  for (const product of catalogProductsData) {
    const canonicalName = resolveCanonicalName(product.name)
    if (syncedCanonicalNames.has(canonicalName)) {
      payload.logger.info(`↷ Skipped duplicate catalog entry: ${product.name}`)
      continue
    }
    syncedCanonicalNames.add(canonicalName)

    const productPayload = await buildProductPayload({ payload, req, product })
    const existing = await findExistingProduct({ payload, req, canonicalName: product.name })

    if (!existing) {
      const isDraft = UNPUBLISHED_CATALOG_NAMES.has(product.name)
      await payload.create({
        collection: 'products',
        data: productPayload as any,
        draft: isDraft,
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info(`✓ Created product: ${product.name} (${product.source})`)
    } else {
      await payload.update({
        collection: 'products',
        id: existing.id,
        data: productPayload as any,
        draft: UNPUBLISHED_CATALOG_NAMES.has(product.name),
        context: { disableRevalidate: true },
        req,
      })
      if (existing.name !== product.name) {
        payload.logger.info(
          `✓ Updated product: ${existing.name} → ${product.name} (${product.source})`,
        )
      } else {
        payload.logger.info(`✓ Updated product: ${product.name} (${product.source})`)
      }
    }
  }

  payload.logger.info(`✓ Catalog sync completed (${catalogProductsData.length} products)`)

  // Unpublish legacy products that are not part of the approved catalog
  const approvedNames = new Set<string>()
  for (const product of catalogProductsData) {
    approvedNames.add(product.name.toLowerCase())
    for (const alias of PRODUCT_NAME_ALIASES[product.name] || []) {
      approvedNames.add(alias.toLowerCase())
    }
  }

  const allProducts = await payload.find({
    collection: 'products',
    limit: 500,
    depth: 0,
    req,
  })

  for (const doc of allProducts.docs) {
    const name = doc.name?.toLowerCase() || ''
    const mustBeDraft =
      UNPUBLISHED_CATALOG_NAMES.has(doc.name || '') || !approvedNames.has(name)

    if (mustBeDraft && doc._status !== 'draft') {
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: { _status: 'draft' },
        context: { disableRevalidate: true },
        req,
      })
      payload.logger.info(`⊘ Unpublished product: ${doc.name}`)
    }
  }
}
