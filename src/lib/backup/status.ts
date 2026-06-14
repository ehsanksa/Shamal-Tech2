import {
  BACKUP_SCHEDULE_CRON,
  BACKUP_SCHEDULE_DESCRIPTION,
  BACKUP_STATUS_KEY,
} from './constants'
import { checkS3Env, getS3ObjectText, headS3Object, putS3Object } from './s3'

export type BackupAttempt = {
  at: string
  ok: boolean
  message: string
  trigger: 'manual' | 'cron' | 'health-check'
  s3Key?: string
  sizeBytes?: number
}

export type BackupStatusFile = {
  lastSuccess: null | {
    at: string
    s3Key: string
    sizeBytes: number
    trigger: string
  }
  lastFailure: null | {
    at: string
    message: string
    trigger: string
  }
  recentAttempts: BackupAttempt[]
}

const EMPTY_STATUS: BackupStatusFile = {
  lastSuccess: null,
  lastFailure: null,
  recentAttempts: [],
}

export async function readBackupStatus(): Promise<BackupStatusFile> {
  const check = checkS3Env()
  if (!check.ok) return { ...EMPTY_STATUS }

  try {
    const raw = await getS3ObjectText(BACKUP_STATUS_KEY)
    if (!raw) return { ...EMPTY_STATUS }
    const parsed = JSON.parse(raw) as Partial<BackupStatusFile>
    return {
      lastSuccess: parsed.lastSuccess ?? null,
      lastFailure: parsed.lastFailure ?? null,
      recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : [],
    }
  } catch {
    return { ...EMPTY_STATUS }
  }
}

export async function writeBackupStatus(status: BackupStatusFile): Promise<void> {
  await putS3Object(BACKUP_STATUS_KEY, JSON.stringify(status, null, 2), 'application/json')
}

export async function recordBackupAttempt(
  attempt: BackupAttempt,
  status: BackupStatusFile,
): Promise<BackupStatusFile> {
  const next: BackupStatusFile = {
    lastSuccess: status.lastSuccess,
    lastFailure: status.lastFailure,
    recentAttempts: [attempt, ...status.recentAttempts].slice(0, 20),
  }
  if (attempt.ok && attempt.s3Key) {
    next.lastSuccess = {
      at: attempt.at,
      s3Key: attempt.s3Key,
      sizeBytes: attempt.sizeBytes ?? 0,
      trigger: attempt.trigger,
    }
    next.lastFailure = null
  } else if (!attempt.ok) {
    next.lastFailure = {
      at: attempt.at,
      message: attempt.message,
      trigger: attempt.trigger,
    }
  }
  await writeBackupStatus(next)
  return next
}

/** Next cron run at 04:00 UTC (matches vercel.json). */
export function getNextScheduledBackupUtc(): string {
  const now = new Date()
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 0, 0, 0))
  if (now.getTime() >= next.getTime()) {
    next.setUTCDate(next.getUTCDate() + 1)
  }
  return next.toISOString()
}

export async function getBackupStatusPayload() {
  const s3Check = checkS3Env()
  const status = await readBackupStatus()

  let storageHealth: {
    at: string
    ok: boolean
    s3Key?: string
    sizeBytes?: number
    error?: string
  } | null = null

  if (s3Check.ok) {
    const at = new Date().toISOString()
    if (status.lastSuccess?.s3Key) {
      const head = await headS3Object(status.lastSuccess.s3Key)
      storageHealth = {
        at,
        ok: head.ok,
        s3Key: status.lastSuccess.s3Key,
        sizeBytes: head.sizeBytes,
        error: head.error,
      }
    } else {
      storageHealth = { at, ok: true }
    }
  }

  return {
    scheduleCron: BACKUP_SCHEDULE_CRON,
    scheduleDescription: BACKUP_SCHEDULE_DESCRIPTION,
    nextScheduledBackup: getNextScheduledBackupUtc(),
    status,
    storageHealth,
    s3Configured: s3Check.ok,
    s3ConfigError: s3Check.ok ? null : `Missing env: ${s3Check.missing.join(', ')}`,
  }
}
