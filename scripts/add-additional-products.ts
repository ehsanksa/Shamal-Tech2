import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload, PayloadRequest } from 'payload'
import config from '@payload-config'
import { ensureMediaFromPublicFile } from '../src/lib/cms/ensureMediaFromPublicFile.js'
import additionalProductsData from '../src/endpoints/seed/additional-products-data.json'

type AdditionalProduct = {
  name: string
  category: 'drones' | 'payloads' | 'other'
  categoryTag: string
  description: string
  keyFeatures: string[]
  imagePath?: string
}

const CATEGORY_TAG_AR_MAP: Record<string, string> = {
  'Broadcast Payloads': 'حمولات البث',
  'Lighting Payloads': 'حمولات الإضاءة',
  'Enterprise Drones': 'طائرات الأعمال',
  Accessories: 'ملحقات',
  'Power Solutions': 'حلول الطاقة',
  'Charging Solutions': 'حلول الشحن',
  'GNSS Solutions': 'حلول GNSS',
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

function hasRichTextContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return Array.isArray(root?.children) && root.children.length > 0
}

async function findExistingProduct({
  payload,
  req,
  name,
}: {
  payload: Payload
  req: PayloadRequest
  name: string
}) {
  const existing = await payload.find({
    collection: 'products',
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    req,
  })
  return existing.docs[0] ?? null
}

async function resolveImageId({
  payload,
  req,
  product,
}: {
  payload: Payload
  req: PayloadRequest
  product: AdditionalProduct
}) {
  if (!product.imagePath) return undefined
  return ensureMediaFromPublicFile({
    payload,
    req,
    relativePath: product.imagePath,
    alt: product.name,
  })
}

async function addAdditionalProducts() {
  const payload = await getPayload({ config })
  const req = {
    payload,
    user: null,
    context: { disableRevalidate: true },
    headers: new Headers(),
  } as unknown as PayloadRequest

  const report = {
    newlyAdded: [] as string[],
    skipped: [] as string[],
    updated: [] as string[],
    imagesAttached: [] as string[],
    withoutImages: [] as string[],
  }

  console.log('Adding 10 additional catalog products (add-only, no cleanup)...')

  for (const product of additionalProductsData as AdditionalProduct[]) {
    const existing = await findExistingProduct({ payload, req, name: product.name })
    const imageId = await resolveImageId({ payload, req, product })

    if (!existing) {
      const imageIds = imageId ? [imageId] : []
      await payload.create({
        collection: 'products',
        data: {
          name: product.name,
          nameAr: product.name,
          category: product.category,
          categoryTag: product.categoryTag,
          categoryTagAr: CATEGORY_TAG_AR_MAP[product.categoryTag] || product.categoryTag,
          description: textToRichText(product.description),
          descriptionAr: textToRichText(
            toArabicDescription(product.name, product.categoryTag),
            'rtl',
          ),
          keyFeatures: product.keyFeatures.map((feature) => ({
            feature,
            featureAr: feature,
          })),
          images: imageIds,
          featured: false,
          ctaText: 'Add to Quote',
          ctaTextAr: 'أضف إلى عرض السعر',
          seo: {
            metaTitle: `${product.name} | Shamal Technologies`,
            metaDescription: `Professional ${product.name} for sale or lease. ${product.categoryTag} solutions in Saudi Arabia.`,
            keywords: `${product.name}, ${product.categoryTag}, drone equipment, Saudi Arabia`,
          },
          _status: 'published',
        } as any,
        draft: false,
        context: { disableRevalidate: true },
        req,
      })

      report.newlyAdded.push(product.name)
      if (imageId) {
        report.imagesAttached.push(product.name)
      } else {
        report.withoutImages.push(product.name)
      }
      console.log(`✓ Created: ${product.name}`)
      continue
    }

    const updateData: Record<string, unknown> = {}
    const missingDescription = !hasRichTextContent(existing.description)
    const missingFeatures =
      !Array.isArray(existing.keyFeatures) || existing.keyFeatures.length === 0
    const missingImages = !Array.isArray(existing.images) || existing.images.length === 0

    if (missingDescription) {
      updateData.description = textToRichText(product.description)
      updateData.descriptionAr = textToRichText(
        toArabicDescription(product.name, product.categoryTag),
        'rtl',
      )
    }

    if (missingFeatures) {
      updateData.keyFeatures = product.keyFeatures.map((feature) => ({
        feature,
        featureAr: feature,
      }))
    }

    if (missingImages && imageId) {
      updateData.images = [imageId]
    }

    if (Object.keys(updateData).length === 0) {
      report.skipped.push(product.name)
      if (!missingImages) {
        report.imagesAttached.push(product.name)
      } else {
        report.withoutImages.push(product.name)
      }
      console.log(`↷ Skipped (already complete): ${product.name}`)
      continue
    }

    await payload.update({
      collection: 'products',
      id: existing.id,
      data: updateData as any,
      context: { disableRevalidate: true },
      req,
    })

    report.updated.push(product.name)
    if (updateData.images) {
      report.imagesAttached.push(product.name)
    } else if (missingImages) {
      report.withoutImages.push(product.name)
    } else {
      report.imagesAttached.push(product.name)
    }
    console.log(`✓ Updated missing fields: ${product.name}`)
  }

  console.log('\n=== FINAL REPORT ===')
  console.log('Products newly added:', report.newlyAdded.length ? report.newlyAdded.join(', ') : 'None')
  console.log(
    'Products already existing and skipped:',
    report.skipped.length ? report.skipped.join(', ') : 'None',
  )
  console.log('Products updated:', report.updated.length ? report.updated.join(', ') : 'None')
  console.log('Images attached:', report.imagesAttached.length ? report.imagesAttached.join(', ') : 'None')
  console.log(
    'Products left without images:',
    report.withoutImages.length ? report.withoutImages.join(', ') : 'None',
  )
  console.log('Final total newly added products:', report.newlyAdded.length)

  await payload.db.connection?.close()
  process.exit(0)
}

addAdditionalProducts().catch((error) => {
  console.error('❌ Error adding additional products:', error)
  process.exit(1)
})
