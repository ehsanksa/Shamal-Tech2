import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

import { BACKUP_STATUS_KEY } from './constants'
import { getBackupBucket, getBackupS3Client } from './s3Client'

export type BackupAttemptLog = {
  at: string
  ok: boolean
  message: string
  trigger: 'cron' | 'manual'
  s3Key?: string
  sizeBytes?: number
}

export type BackupStatusFile = {
  schemaVersion: 1
  scheduleCron: string
  scheduleDescription: string
  lastAttempt: string | null
  lastSuccess: null | {
    at: string
    s3Key: string
    sizeBytes: number
    trigger: 'cron' | 'manual'
  }
  lastFailure: null | {
    at: string
    message: string
    trigger: 'cron' | 'manual'
  }
  storageHealth: {
    lastUploadOk: boolean
    lastError: string | null
    checkedAt: string | null
  }
  recentAttempts: BackupAttemptLog[]
}

const MAX_RECENT = 40

export function emptyBackupStatus(
  scheduleCron: string,
  scheduleDescription: string,
): BackupStatusFile {
  return {
    schemaVersion: 1,
    scheduleCron,
    scheduleDescription,
    lastAttempt: null,
    lastSuccess: null,
    lastFailure: null,
    storageHealth: {
      lastUploadOk: true,
      lastError: null,
      checkedAt: null,
    },
    recentAttempts: [],
  }
}

export async function readBackupStatus(): Promise<BackupStatusFile | null> {
  if (!process.env.S3_BUCKET) return null
  const client = getBackupS3Client()
  try {
    const out = await client.send(
      new GetObjectCommand({
        Bucket: getBackupBucket(),
        Key: BACKUP_STATUS_KEY,
      }),
    )
    const body = await out.Body?.transformToString()
    if (!body) return null
    return JSON.parse(body) as BackupStatusFile
  } catch {
    return null
  }
}

export async function writeBackupStatus(status: BackupStatusFile): Promise<void> {
  const client = getBackupS3Client()
  await client.send(
    new PutObjectCommand({
      Bucket: getBackupBucket(),
      Key: BACKUP_STATUS_KEY,
      Body: JSON.stringify(status, null, 2),
      ContentType: 'application/json',
      ServerSideEncryption: 'AES256',
    }),
  )
}

export function appendAttempt(
  prev: BackupStatusFile | null,
  attempt: BackupAttemptLog,
  scheduleCron: string,
  scheduleDescription: string,
): BackupStatusFile {
  const base = prev ?? emptyBackupStatus(scheduleCron, scheduleDescription)
  const recent = [attempt, ...base.recentAttempts].slice(0, MAX_RECENT)
  const next: BackupStatusFile = {
    ...base,
    lastAttempt: attempt.at,
    recentAttempts: recent,
  }
  if (attempt.ok && attempt.s3Key && attempt.sizeBytes !== undefined) {
    next.lastSuccess = {
      at: attempt.at,
      s3Key: attempt.s3Key,
      sizeBytes: attempt.sizeBytes,
      trigger: attempt.trigger,
    }
    next.lastFailure = null
    next.storageHealth = {
      lastUploadOk: true,
      lastError: null,
      checkedAt: attempt.at,
    }
  } else if (!attempt.ok) {
    next.lastFailure = {
      at: attempt.at,
      message: attempt.message,
      trigger: attempt.trigger,
    }
    next.storageHealth = {
      lastUploadOk: false,
      lastError: attempt.message,
      checkedAt: attempt.at,
    }
  }
  return next
}
