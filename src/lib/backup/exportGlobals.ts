import type { Payload } from 'payload'

import type { Config } from '../../payload-types'

const GLOBAL_DEPTH = 2

export async function exportSingleGlobal(
  payload: Payload,
  slug: keyof Config['globals'],
): Promise<Record<string, unknown> | null> {
  try {
    const doc = await payload.findGlobal({
      slug,
      depth: GLOBAL_DEPTH,
      overrideAccess: true,
    })
    return doc as unknown as Record<string, unknown>
  } catch {
    return null
  }
}
