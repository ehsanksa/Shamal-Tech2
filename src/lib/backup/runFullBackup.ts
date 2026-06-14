import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import archiver from 'archiver'
import type { Payload } from 'payload'

import { BACKUP_CRON_DESCRIPTION, BACKUP_CRON_SCHEDULE, BACKUP_S3_PREFIX } from './constants'
import { appendAttempt, readBackupStatus, writeBackupStatus } from './backupStatus'
import { exportCollectionDocs } from './exportCollections'
import { exportSingleGlobal } from './exportGlobals'
import { buildS3ObjectManifest } from './exportS3ObjectManifest'
import { readSqliteIfPresent } from './readSqliteIfPresent'
import { getBackupBucket, getBackupS3Client, isBackupS3Configured } from './s3Client'

export type BackupTrigger = 'cron' | 'manual'

export type RunFullBackupResult = {
  ok: boolean
  s3Key?: string
  sizeBytes?: number
  message?: string
}

function backupObjectKey(trigger: BackupTrigger): string {
  const d = new Date()
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const h = String(d.getUTCHours()).padStart(2, '0')
  const min = String(d.getUTCMinutes()).padStart(2, '0')
  const s = String(d.getUTCSeconds()).padStart(2, '0')
  return `${BACKUP_S3_PREFIX}shamal_full_backup_${y}_${m}_${day}_${h}${min}${s}_${trigger}.zip`
}

export async function runFullBackup(
  payload: Payload,
  trigger: BackupTrigger,
): Promise<RunFullBackupResult> {
  const startedAt = new Date().toISOString()

  if (!isBackupS3Configured()) {
    const attempt = {
      at: startedAt,
      ok: false,
      message: 'S3 is not configured (S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION).',
      trigger: trigger as const,
    }
    try {
      const prev = await readBackupStatus()
      await writeBackupStatus(
        appendAttempt(prev, attempt, BACKUP_CRON_SCHEDULE, BACKUP_CRON_DESCRIPTION),
      )
    } catch {
      /* status write also requires S3 */
    }
    return { ok: false, message: attempt.message }
  }

  const collectionSlugs = payload.config.collections.map((c) => c.slug)
  const globalSlugs = payload.config.globals.map((g) => g.slug)

  const collectionMapping: Record<string, string> = {}
  for (const slug of collectionSlugs) {
    collectionMapping[slug] = `collections/${slug}.json`
  }
  const globalMapping: Record<string, string> = {}
  for (const slug of globalSlugs) {
    globalMapping[slug] = `globals/${slug}.json`
  }

  const sqliteBuf = await readSqliteIfPresent(process.env.DATABASE_URL)
  let s3Manifest: Awaited<ReturnType<typeof buildS3ObjectManifest>> | null = null
  try {
    s3Manifest = await buildS3ObjectManifest()
  } catch (e) {
    payload.logger.warn(
      { err: e },
      'Backup: S3 object manifest skipped (bucket list may be denied or empty).',
    )
  }

  const archive = archiver('zip', { zlib: { level: 6 } })
  const passThrough = new PassThrough()

  archive.on('error', (err) => {
    passThrough.destroy(err)
  })

  archive.pipe(passThrough)

  const collectionSummaries: { slug: string; file: string; docCount: number }[] = []
  const globalSummaries: { slug: string; file: string }[] = []

  const appendArchive = async () => {
    for (const slug of collectionSlugs) {
      const docs = await exportCollectionDocs(payload, slug)
      const file = `collections/${slug}.json`
      archive.append(JSON.stringify(docs), { name: file })
      collectionSummaries.push({ slug, file, docCount: docs.length })
    }

    for (const slug of globalSlugs) {
      const doc = await exportSingleGlobal(payload, slug)
      const file = `globals/${slug}.json`
      archive.append(JSON.stringify(doc ?? null), { name: file })
      globalSummaries.push({ slug, file })
    }

    if (s3Manifest) {
      archive.append(
        JSON.stringify(
          {
            prefix: s3Manifest.prefix,
            truncated: s3Manifest.truncated,
            objectCount: s3Manifest.entries.length,
            objects: s3Manifest.entries,
          },
          null,
          2,
        ),
        { name: 's3-object-manifest.json' },
      )
    }

    if (sqliteBuf) {
      archive.append(sqliteBuf, { name: 'sqlite/payload.sqlite.bin' })
    }

    const manifest = {
      backupSchemaVersion: 1,
      createdAt: startedAt,
      trigger,
      dataLayer: {
        kind: 'payload-sqlite',
        databaseUrlHint:
          process.env.DATABASE_URL?.startsWith('file:') === true ? 'file:relative-or-absolute' : 'non-file',
        nodeEnv: process.env.NODE_ENV ?? 'unknown',
      },
      collectionSlugs,
      globalSlugs,
      collectionExportFiles: collectionSummaries,
      globalExportFiles: globalSummaries,
      filesInZip: [
        'manifest.json',
        'restore-readme.json',
        ...collectionSlugs.map((s) => `collections/${s}.json`),
        ...globalSlugs.map((s) => `globals/${s}.json`),
        ...(s3Manifest ? ['s3-object-manifest.json'] : []),
        ...(sqliteBuf ? ['sqlite/payload.sqlite.bin'] : []),
      ],
      restoreGuide: {
        notes: [
          'Restore is not executed by this backup job; use this manifest for a future restore tool.',
          'Re-import collections/globals via Payload Local API or a dedicated restore script.',
          'If sqlite/payload.sqlite.bin is present, it is a byte copy of the SQLite file at backup time (when DATABASE_URL was file:...).',
          'S3 binaries are not duplicated in this zip; use s3-object-manifest.json and your bucket.',
        ],
        collectionMapping,
        globalMapping,
        mediaMetadata: 'Stored in collections/media.json when the media collection exists.',
      },
      s3Manifest: s3Manifest
        ? {
            included: true,
            objectCount: s3Manifest.entries.length,
            truncated: s3Manifest.truncated,
            prefix: s3Manifest.prefix,
          }
        : { included: false, objectCount: 0, truncated: false, prefix: '' },
      sqliteSnapshot: sqliteBuf
        ? { included: true, bytes: sqliteBuf.length }
        : { included: false },
    }

    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' })
    archive.append(
      JSON.stringify(
        {
          version: 1,
          compatibleWith: ['payload-3.x', 'sqlite-adapter'],
          manifestFile: 'manifest.json',
          perCollectionFiles: collectionMapping,
          perGlobalFiles: globalMapping,
        },
        null,
        2,
      ),
      { name: 'restore-readme.json' },
    )

    await archive.finalize()
  }

  const s3Key = backupObjectKey(trigger)
  const client = getBackupS3Client()
  const bucket = getBackupBucket()

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: s3Key,
      Body: passThrough,
      ContentType: 'application/zip',
      ServerSideEncryption: 'AES256',
      Metadata: {
        'backup-trigger': trigger,
        'backup-created-at': startedAt,
      },
    },
  })

  try {
    await Promise.all([appendArchive(), upload.done()])

    const head = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: s3Key,
      }),
    )
    const sizeBytes = Number(head.ContentLength ?? 0)

    const finishedAt = new Date().toISOString()
    const attempt = {
      at: finishedAt,
      ok: true,
      message: 'Backup completed',
      trigger: trigger as const,
      s3Key,
      sizeBytes,
    }

    const prev = await readBackupStatus()
    await writeBackupStatus(
      appendAttempt(prev, attempt, BACKUP_CRON_SCHEDULE, BACKUP_CRON_DESCRIPTION),
    )

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `${BACKUP_S3_PREFIX}_meta/storage-health.json`,
        Body: JSON.stringify({ at: finishedAt, ok: true, s3Key, sizeBytes }),
        ContentType: 'application/json',
        ServerSideEncryption: 'AES256',
      }),
    )

    return { ok: true, s3Key, sizeBytes }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    payload.logger.error({ err }, 'Full backup failed')

    const attempt = {
      at: new Date().toISOString(),
      ok: false,
      message,
      trigger: trigger as const,
    }
    try {
      const prev = await readBackupStatus()
      await writeBackupStatus(
        appendAttempt(prev, attempt, BACKUP_CRON_SCHEDULE, BACKUP_CRON_DESCRIPTION),
      )
    } catch (e) {
      payload.logger.error({ err: e }, 'Failed to write backup status')
    }

    try {
      await getBackupS3Client().send(
        new PutObjectCommand({
          Bucket: getBackupBucket(),
          Key: `${BACKUP_S3_PREFIX}_meta/storage-health.json`,
          Body: JSON.stringify({
            at: new Date().toISOString(),
            ok: false,
            error: message,
          }),
          ContentType: 'application/json',
          ServerSideEncryption: 'AES256',
        }),
      )
    } catch {
      /* ignore */
    }

    return { ok: false, message }
  }
}
