import type { Payload } from 'payload'

const GLOBAL_DEPTH = 2

export async function exportSingleGlobal(
  payload: Payload,
  slug: string,
): Promise<Record<string, unknown> | null> {
  try {
    const doc = await payload.findGlobal({
      slug,
      depth: GLOBAL_DEPTH,
      overrideAccess: true,
    })
    return doc as Record<string, unknown>
  } catch {
    return null
  }
}
