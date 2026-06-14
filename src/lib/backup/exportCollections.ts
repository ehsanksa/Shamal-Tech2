import type { Payload } from 'payload'

const PAGE_SIZE = 100
const EXPORT_DEPTH = 2

export async function exportCollectionDocs(
  payload: Payload,
  collectionSlug: string,
): Promise<Record<string, unknown>[]> {
  const docs: Record<string, unknown>[] = []
  let page = 1
  for (;;) {
    const result = await payload.find({
      collection: collectionSlug,
      depth: EXPORT_DEPTH,
      limit: PAGE_SIZE,
      page,
      pagination: true,
      overrideAccess: true,
    })
    for (const doc of result.docs) {
      docs.push(doc as Record<string, unknown>)
    }
    if (!result.hasNextPage) break
    page += 1
  }
  return docs
}
