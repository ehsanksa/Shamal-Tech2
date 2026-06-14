import { GetObjectCommand } from '@aws-sdk/client-s3'

import { BACKUP_S3_PREFIX } from './constants'
import { getBackupBucket, getBackupS3Client, isBackupS3Configured } from './s3Client'

export type StorageHealthJson = {
  at: string
  ok: boolean
  s3Key?: string
  sizeBytes?: number
  error?: string
}

export async function readStorageHealth(): Promise<StorageHealthJson | null> {
  if (!isBackupS3Configured()) return null
  try {
    const client = getBackupS3Client()
    const out = await client.send(
      new GetObjectCommand({
        Bucket: getBackupBucket(),
        Key: `${BACKUP_S3_PREFIX}_meta/storage-health.json`,
      }),
    )
    const body = await out.Body?.transformToString()
    if (!body) return null
    return JSON.parse(body) as StorageHealthJson
  } catch {
    return null
  }
}
