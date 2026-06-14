/** S3 prefix for completed backup ZIP archives. */
export const BACKUP_S3_PREFIX = 'database-backups'

/** S3 prefix for backup metadata (status, manifests). */
export const BACKUP_META_PREFIX = `${BACKUP_S3_PREFIX}/_meta/`

/** S3 object key for the backup status JSON file. */
export const BACKUP_STATUS_KEY = `${BACKUP_S3_PREFIX}/backup-status.json`

/** Vercel cron schedule (matches vercel.json). */
export const BACKUP_SCHEDULE_CRON = '0 4 * * *'

export const BACKUP_SCHEDULE_DESCRIPTION = 'Daily at 04:00 UTC'

/** Long-lived cache header for immutable S3 media objects. */
export const S3_MEDIA_CACHE_CONTROL = 'public, max-age=31536000, immutable'
