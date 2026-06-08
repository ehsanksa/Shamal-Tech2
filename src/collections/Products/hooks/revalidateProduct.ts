import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/products/${doc.slug}`
      payload.logger.info(`Revalidating product at path: ${path}`)
      // Revalidate the specific product page
      revalidatePath(path)
      // Revalidate listing page to show updated content
      revalidatePath('/products')
      revalidateTag('products-sitemap')
      revalidateTag('collection_products')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/products/${previousDoc.slug}`
      payload.logger.info(`Revalidating old product at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidateTag('products-sitemap')
      revalidateTag('collection_products')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/products/${doc?.slug}`
    payload.logger.info(`Revalidating deleted product at path: ${path}`)
    // Revalidate the specific product page
    revalidatePath(path)
    // Revalidate listing page to remove deleted content
    revalidatePath('/products')
    revalidateTag('products-sitemap')
    revalidateTag('collection_products')
  }
  return doc
}

