import { Upload } from '@aws-sdk/lib-storage'
import archiver from 'archiver'
import { EJSON } from 'bson'
import { PassThrough, Readable } from 'node:stream'
import type { Payload } from 'payload'

import { BACKUP_S3_PREFIX } from './constants'
import { getBackupBucket, getBackupS3Client, isBackupS3Configured } from './s3'
import {
  defaultBackupStatus,
  nextDailyFourUtcIso,
  readBackupStatus,
  writeBackupStatus,
} from './status'

const PAGE_SIZE = 100

async function collectCollection(payload: Payload, slug: string): Promise<unknown[]> {
  const out: unknown[] = []
  let page = 1
  while (true) {
    const res = await payload.find({
      collection: slug as never,
      depth: 0,
      limit: PAGE_SIZE,
      page,
      overrideAccess: true,
    })
    out.push(...res.docs)
    if (res.hasNextPage !== true) break
    page += 1
  }
  return out
}

export async function runBackup(args: {
  payload: Payload
  trigger: 'admin' | 'cron'
}): Promise<{ ok: true; key: string; sizeBytes: number } | { ok: false; message: string }> {
  const { payload, trigger } = args
  const startedAt = new Date().toISOString()

  if (!isBackupS3Configured()) {
    return { ok: false, message: 'S3 is not configured for backups.' }
  }

  const attempt = {
    at: startedAt,
    ok: false,
    message: '',
    trigger,
    s3Key: undefined as string | undefined,
    sizeBytes: undefined as number | undefined,
  }

  try {
    const collections: Record<string, unknown[]> = {}
    for (const slug of Object.keys(payload.collections)) {
      collections[slug] = await collectCollection(payload, slug)
    }

    const globals: Record<string, unknown> = {}
    for (const g of payload.config.globals ?? []) {
      const slug = typeof g === 'string' ? g : g.slug
      globals[slug] = await payload.findGlobal({
        slug: slug as never,
        depth: 0,
        overrideAccess: true,
      })
    }

    const key = `${BACKUP_S3_PREFIX}backup-${startedAt.replace(/[:.]/g, '-')}.zip`
    const pass = new PassThrough()
    const archive = archiver('zip', { zlib: { level: 6 } })
    archive.on('error', (err) => {
      pass.destroy(err)
    })
    archive.pipe(pass)

    const payloadJson = JSON.stringify(
      {
        exportedAt: startedAt,
        note: 'Payload export (overrideAccess). Collections + globals as JSON.',
        collections,
        globals,
      },
      null,
      0,
    )
    archive.append(payloadJson, { name: 'payload-export.json' })

    const nativeDb = payload.db.connection?.db
    if (nativeDb) {
      const colMeta = await nativeDb.listCollections().toArray()
      for (const { name } of colMeta) {
        if (!name || name.startsWith('system.')) continue
        async function* lines() {
          const cursor = nativeDb.collection(name).find({}, { timeoutMS: 180_000 })
          for await (const doc of cursor) {
            yield `${JSON.stringify(EJSON.serialize(doc))}\n`
          }
        }
        archive.append(Readable.from(lines()), {
          name: `mongo-raw/${name.replace(/[/\\]/g, '_')}.jsonl`,
        })
      }
    }

    archive.append(
      JSON.stringify(
        {
          trigger,
          at: startedAt,
          includes: ['payload-export.json', 'mongo-raw/*.jsonl (MongoDB extended JSON per line)'],
        },
        null,
        2,
      ),
      { name: 'manifest.json' },
    )

    const client = getBackupS3Client()
    const bucket = getBackupBucket()
    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: pass,
        ContentType: 'application/zip',
      },
    })
    const uploadDone = upload.done()
    await archive.finalize()
    const done = await uploadDone

    const sizeBytes = Number(done.Size ?? 0)

    attempt.ok = true
    attempt.message = 'Backup uploaded'
    attempt.s3Key = key
    attempt.sizeBytes = sizeBytes

    const status = await readBackupStatus().catch(() => defaultBackupStatus())
    status.status.recentAttempts.unshift({ ...attempt })
    status.status.recentAttempts = status.status.recentAttempts.slice(0, 40)
    status.status.lastSuccess = { at: startedAt, s3Key: key, sizeBytes, trigger }
    status.status.lastFailure = null
    status.nextScheduledBackup = nextDailyFourUtcIso()
    status.storageHealth = {
      at: new Date().toISOString(),
      ok: true,
      s3Key: key,
      sizeBytes,
    }
    await writeBackupStatus(status)

    return { ok: true, key, sizeBytes }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    attempt.ok = false
    attempt.message = message

    const status = await readBackupStatus().catch(() => defaultBackupStatus())
    status.status.recentAttempts.unshift({ ...attempt })
    status.status.recentAttempts = status.status.recentAttempts.slice(0, 40)
    status.status.lastFailure = { at: startedAt, message, trigger }
    status.storageHealth = {
      at: new Date().toISOString(),
      ok: false,
      error: message,
    }
    await writeBackupStatus(status).catch(() => {})

    return { ok: false, message }
  }
}
