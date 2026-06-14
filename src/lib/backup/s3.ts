import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { BACKUP_S3_PREFIX, S3_MEDIA_CACHE_CONTROL } from './constants'
import {
  getBackupBucket,
  getBackupS3Client,
  isBackupS3Configured,
} from './s3Client'

export { getBackupBucket, getBackupS3Client, isBackupS3Configured }

export type S3EnvCheck = {
  ok: boolean
  missing: string[]
}

export function checkS3Env(): S3EnvCheck {
  const required = ['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'] as const
  const missing = required.filter((k) => !process.env[k])
  return { ok: missing.length === 0, missing: [...missing] }
}

export function s3EnvErrorMessage(check: S3EnvCheck): string {
  if (check.ok) return ''
  return `S3 is not configured. Missing: ${check.missing.join(', ')}. Set these in Vercel project env vars.`
}

export function getMediaCdnBaseUrl(): string | null {
  const cdn =
    process.env.S3_CDN_URL ||
    process.env.CLOUDFRONT_URL ||
    process.env.CDN_URL ||
    process.env.NEXT_PUBLIC_S3_CDN_URL ||
    process.env.NEXT_PUBLIC_CDN_URL
  if (!cdn) return null
  return cdn.replace(/\/$/, '')
}

/** Rewrite direct S3 object URLs to CDN when configured. */
export function toCdnMediaUrl(url: string): string {
  const cdnBase = getMediaCdnBaseUrl()
  const bucket = process.env.S3_BUCKET
  const region = process.env.S3_REGION
  if (!cdnBase || !bucket || !url.startsWith('http')) return url

  const patterns = [
    ...(region ? [`https://${bucket}.s3.${region}.amazonaws.com/`] : []),
    `https://${bucket}.s3.amazonaws.com/`,
    ...(region ? [`https://s3.${region}.amazonaws.com/${bucket}/`] : []),
  ]

  for (const prefix of patterns) {
    if (url.startsWith(prefix)) {
      return `${cdnBase}/${url.slice(prefix.length)}`
    }
  }

  return url
}

export async function getS3ObjectText(key: string): Promise<string | null> {
  const client = getBackupS3Client()
  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: getBackupBucket(), Key: key }),
    )
    return (await res.Body?.transformToString('utf-8')) ?? null
  } catch (err: unknown) {
    const code = (err as { name?: string })?.name
    const status = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode
    if (code === 'NoSuchKey' || status === 404) return null
    throw err
  }
}

export async function putS3Object(
  key: string,
  body: Buffer | string,
  contentType: string,
  cacheControl?: string,
): Promise<void> {
  const client = getBackupS3Client()
  await client.send(
    new PutObjectCommand({
      Bucket: getBackupBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl ?? S3_MEDIA_CACHE_CONTROL,
    }),
  )
}

export async function listBackupZips(): Promise<
  Array<{ key: string; size: number; lastModified: string }>
> {
  if (!isBackupS3Configured()) return []

  const client = getBackupS3Client()
  const bucket = getBackupBucket()
  const items: Array<{ key: string; size: number; lastModified: string }> = []
  let token: string | undefined

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `${BACKUP_S3_PREFIX}/`,
        ContinuationToken: token,
      }),
    )
    for (const obj of res.Contents ?? []) {
      if (!obj.Key?.endsWith('.zip') || obj.Key === `${BACKUP_S3_PREFIX}/`) continue
      items.push({
        key: obj.Key,
        size: obj.Size ?? 0,
        lastModified: (obj.LastModified ?? new Date()).toISOString(),
      })
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)

  return items.sort((a, b) => b.lastModified.localeCompare(a.lastModified))
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = getBackupS3Client()
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: getBackupBucket(), Key: key }),
    { expiresIn },
  )
}

export async function headS3Object(
  key: string,
): Promise<{ ok: boolean; sizeBytes?: number; error?: string }> {
  try {
    const client = getBackupS3Client()
    const res = await client.send(
      new HeadObjectCommand({ Bucket: getBackupBucket(), Key: key }),
    )
    return { ok: true, sizeBytes: res.ContentLength ?? 0 }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'S3 head failed'
    return { ok: false, error: message }
  }
}
