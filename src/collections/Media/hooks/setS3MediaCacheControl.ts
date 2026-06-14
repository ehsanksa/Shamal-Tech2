import type { CollectionAfterChangeHook } from 'payload'
import { CopyObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { S3_MEDIA_CACHE_CONTROL } from '../../../lib/backup/constants'

function isS3Configured(): boolean {
  return !!(
    process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  )
}

function resolveS3Key(filename: string): string {
  const prefix = process.env.S3_PREFIX || 'media'
  return `${prefix}/${filename}`.replace(/\/+/g, '/')
}

/**
 * Ensures uploaded media objects in S3 carry long-lived cache headers.
 */
export const setS3MediaCacheControl: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (!isS3Configured()) return doc
  if (operation !== 'create' && operation !== 'update') return doc

  const filename = typeof doc?.filename === 'string' ? doc.filename : ''
  if (!filename) return doc

  const key = resolveS3Key(filename)
  const bucket = process.env.S3_BUCKET!

  try {
    const client = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })

    await client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${key}`,
        Key: key,
        CacheControl: S3_MEDIA_CACHE_CONTROL,
        MetadataDirective: 'REPLACE',
      }),
    )
  } catch (error) {
    // Non-fatal: upload succeeded; cache headers can be set via bucket policy/CDN.
    console.warn(`S3 Cache-Control update skipped for ${key}:`, error)
  }

  return doc
}
