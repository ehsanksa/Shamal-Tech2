import { ListObjectsV2Command } from '@aws-sdk/client-s3'

import { getS3ManifestMaxKeys } from './constants'
import { getBackupBucket, getBackupS3Client, getMediaPrefix } from './s3Client'

export type S3ManifestEntry = {
  key: string
  size?: number
  lastModified?: string
}

export type S3ManifestResult = {
  entries: S3ManifestEntry[]
  truncated: boolean
  prefix: string
}

/**
 * Lists objects under the configured media prefix for disaster indexing.
 */
export async function buildS3ObjectManifest(): Promise<S3ManifestResult> {
  const client = getBackupS3Client()
  const bucket = getBackupBucket()
  const prefix = `${getMediaPrefix()}/`
  const maxKeys = getS3ManifestMaxKeys()
  const entries: S3ManifestEntry[] = []
  let continuationToken: string | undefined
  let truncated = false

  while (entries.length < maxKeys) {
    const pageSize = Math.min(1000, maxKeys - entries.length)
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: pageSize,
        ContinuationToken: continuationToken,
      }),
    )

    for (const obj of res.Contents ?? []) {
      if (!obj.Key) continue
      if (entries.length >= maxKeys) break
      entries.push({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified?.toISOString(),
      })
    }

    if (entries.length >= maxKeys) {
      truncated = Boolean(res.IsTruncated)
      break
    }

    if (!res.IsTruncated || !res.NextContinuationToken) {
      break
    }
    continuationToken = res.NextContinuationToken
  }

  return { entries, truncated, prefix }
}
