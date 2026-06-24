import type { CollectionAfterChangeHook } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const projectRoot = path.resolve(dirname, '../../../../')
const replicaDir = path.resolve(projectRoot, 'public/media/replica')

async function writeReplica({
  doc,
  req,
}: {
  doc: Record<string, unknown>
  req: Parameters<CollectionAfterChangeHook>[0]['req']
}): Promise<void> {
  const fileURL = typeof doc?.url === 'string' ? doc.url : ''
  if (!fileURL) return

  const sourceURL = fileURL.startsWith('http')
    ? fileURL
    : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${fileURL}`
  if (!sourceURL.startsWith('http')) return

  const res = await fetch(sourceURL)
  if (!res.ok) return

  const data = Buffer.from(await res.arrayBuffer())
  await fs.mkdir(replicaDir, { recursive: true })

  const safeFilename = String(doc?.filename || path.basename(fileURL) || `media-${doc.id}`)
    .replace(/[^\w.\-]/g, '_')
    .slice(0, 220)
  await fs.writeFile(path.join(replicaDir, safeFilename), data)
}

/**
 * Best-effort local replica of S3 media. Runs in the background so admin
 * save/crop responses are not blocked on fetch + disk I/O.
 */
export const replicateMediaLocally: CollectionAfterChangeHook = ({ doc, req, operation }) => {
  if (operation !== 'create' && operation !== 'update') return doc
  if (!process.env.S3_BUCKET) return doc

  void writeReplica({ doc, req }).catch((error) => {
    req.payload.logger.warn(`Media replica write failed for ${doc?.id}: ${String(error)}`)
  })

  return doc
}
