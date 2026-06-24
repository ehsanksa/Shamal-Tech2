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
  const prefix = process.env.S3_PREFIX ?? ''
  if (!prefix) return filename
  return `${prefix}/${filename}`.replace(/\/+/g, '/')
}

async function applyCacheControl(filename: string): Promise<void> {
  const key = resolveS3Key(filename)
  const bucket = process.env.S3_BUCKET!

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
}

/**
 * Ensures uploaded media objects in S3 carry long-lived cache headers.
 * Runs in the background so admin save/crop is not blocked on S3 copy.
 */
export const setS3MediaCacheControl: CollectionAfterChangeHook = ({ doc, operation }) => {
  if (!isS3Configured()) return doc
  if (operation !== 'create' && operation !== 'update') return doc

  const filename = typeof doc?.filename === 'string' ? doc.filename : ''
  if (!filename) return doc

  void applyCacheControl(filename).catch((error) => {
    console.warn(`S3 Cache-Control update skipped for ${resolveS3Key(filename)}:`, error)
  })

  return doc
}
