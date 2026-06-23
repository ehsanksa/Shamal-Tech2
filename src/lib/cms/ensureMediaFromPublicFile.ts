import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload, PayloadRequest } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const projectRoot = path.resolve(dirname, '../../..')
const publicDir = path.resolve(projectRoot, 'public')

const mimeByExt: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.avif': 'image/avif',
}

export async function ensureMediaFromPublicFile({
  payload,
  req,
  relativePath,
  alt,
}: {
  payload: Payload
  req: PayloadRequest
  relativePath: string
  alt: string
}): Promise<number | string | undefined> {
  const absolutePath = path.resolve(publicDir, relativePath)
  try {
    await fs.access(absolutePath)
  } catch {
    return undefined
  }

  const filenameOnly = path.basename(relativePath)
  const existingByFilename = await payload.find({
    collection: 'media',
    where: {
      filename: { equals: filenameOnly },
    },
    limit: 1,
    req,
  })
  if (existingByFilename.docs[0]?.id) return existingByFilename.docs[0].id

  const existingByAlt = await payload.find({
    collection: 'media',
    where: {
      alt: { equals: alt },
    },
    limit: 1,
    req,
  })
  if (existingByAlt.docs[0]?.id) return existingByAlt.docs[0].id

  const fileBuffer = await fs.readFile(absolutePath)
  const ext = path.extname(filenameOnly).toLowerCase()

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      name: filenameOnly,
      data: fileBuffer,
      size: fileBuffer.byteLength,
      mimetype: mimeByExt[ext] || 'application/octet-stream',
    },
    req,
  })
  return created.id
}
