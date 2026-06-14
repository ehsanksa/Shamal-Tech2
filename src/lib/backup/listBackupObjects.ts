import { ListObjectsV2Command } from '@aws-sdk/client-s3'

import { BACKUP_META_PREFIX, BACKUP_S3_PREFIX } from './constants'
import { getBackupBucket, getBackupS3Client } from './s3Client'

export type BackupListItem = {
  key: string
  size: number
  lastModified: string
}

/**
 * Lists completed backup zips under database-backups/ (excludes _meta/).
 */
export async function listBackupZipObjects(): Promise<BackupListItem[]> {
  const client = getBackupS3Client()
  const bucket = getBackupBucket()
  const items: BackupListItem[] = []
  let continuationToken: string | undefined

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: BACKUP_S3_PREFIX,
        ContinuationToken: continuationToken,
      }),
    )

    for (const obj of res.Contents ?? []) {
      if (!obj.Key || !obj.LastModified) continue
      if (obj.Key.startsWith(BACKUP_META_PREFIX) || obj.Key.endsWith('/')) continue
      if (!obj.Key.endsWith('.zip')) continue
      items.push({
        key: obj.Key,
        size: Number(obj.Size ?? 0),
        lastModified: obj.LastModified.toISOString(),
      })
    }

    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (continuationToken)

  items.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1))
  return items
}
