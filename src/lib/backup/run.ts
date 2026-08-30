import fs from 'fs/promises'
import path from 'path'
import { createWriteStream } from 'fs'
import archiver from 'archiver'
import { EJSON } from 'bson'
import { MongoClient } from 'mongodb'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

import { BACKUP_S3_PREFIX } from './constants'
import { checkMongoEnv, mongoEnvErrorMessage } from './auth'
import { checkS3Env, putS3Object, s3EnvErrorMessage } from './s3'
import { readBackupStatus, recordBackupAttempt } from './status'

const COLLECTIONS = [
  'analytics-events',
  'categories',
  'career',
  'chat-summaries',
  'contact-submissions',
  'employees',
  'forms',
  'form-submissions',
  'issue-reports',
  'leads',
  'media',
  'newsletter-subscriptions',
  'pages',
  'posts',
  'products',
  'search',
  'seo-keywords',
  'services',
  'users',
] as const

const GLOBALS = [
  'about-page-content',
  'careers-page-content',
  'contact-page-content',
  'footer',
  'form-notification-settings',
  'header',
  'homepage-content',
  'posts-page-content',
  'products-page-content',
  'promo-popup-content',
  'sectors-content',
  'seo-settings',
  'services-page-content',
  'site-settings',
  'visitors-form-settings',
] as const

type PayloadLike = Awaited<ReturnType<typeof getPayload>>

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

async function fetchCollectionDocs(payload: PayloadLike, collection: string): Promise<unknown[]> {
  const docs: unknown[] = []
  let page = 1
  while (true) {
    const res = await payload.find({
      collection: collection as 'pages',
      limit: 100,
      page,
      depth: 2,
      overrideAccess: true,
    })
    docs.push(...res.docs)
    if (page >= res.totalPages) break
    page += 1
  }
  return docs
}

async function exportMongoRawJsonl(workDir: string): Promise<number> {
  const mongoCheck = checkMongoEnv()
  if (!mongoCheck.ok) return 0

  const uri = process.env.MONGODB_URI || process.env.DATABASE_URI!
  const client = new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 10_000,
  })
  const outDir = path.join(workDir, 'mongo-raw')
  await ensureDir(outDir)

  let totalLines = 0
  try {
    await client.connect()
    const db = client.db()
    const collectionNames = await db.listCollections().toArray()

    for (const { name } of collectionNames) {
      if (!name || name.startsWith('system.')) continue
      const coll = db.collection(name)
      const cursor = coll.find({})
      const filePath = path.join(outDir, `${name}.jsonl`)
      const lines: string[] = []

      for await (const doc of cursor) {
        lines.push(EJSON.stringify(doc))
        totalLines += 1
        if (lines.length >= 200) {
          await fs.appendFile(filePath, `${lines.join('\n')}\n`, 'utf8')
          lines.length = 0
        }
      }
      if (lines.length > 0) {
        await fs.appendFile(filePath, `${lines.join('\n')}\n`, 'utf8')
      }
    }
  } finally {
    await client.close().catch(() => undefined)
  }

  return totalLines
}

async function zipDirectory(sourceDir: string, outFile: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(outFile)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', () => resolve())
    archive.on('error', (err) => reject(err))
    archive.pipe(output)
    archive.directory(sourceDir, false)
    void archive.finalize()
  })
}

export type RunBackupResult =
  | { ok: true; s3Key: string; sizeBytes: number }
  | { ok: false; error: string }

export async function runContentBackup(trigger: 'manual' | 'cron'): Promise<RunBackupResult> {
  const s3Check = checkS3Env()
  if (!s3Check.ok) {
    return { ok: false, error: s3EnvErrorMessage(s3Check) }
  }

  const mongoCheck = checkMongoEnv()
  if (!mongoCheck.ok) {
    return { ok: false, error: mongoEnvErrorMessage() }
  }

  const at = new Date().toISOString()
  const timestamp = at.replace(/[:.]/g, '-')
  const workDir = path.join('/tmp', `shamal-backup-${timestamp}`)
  const zipPath = `${workDir}.zip`
  const s3Key = `${BACKUP_S3_PREFIX}/content-backup-${timestamp}.zip`

  try {
    await ensureDir(workDir)

    const payload = await getPayload({ config: configPromise })
    const payloadExport: Record<string, unknown> = {
      meta: {
        generatedAt: at,
        source: process.env.NEXT_PUBLIC_SERVER_URL || 'vercel',
        trigger,
      },
      collections: {} as Record<string, unknown[]>,
      globals: {} as Record<string, unknown>,
    }

    for (const collection of COLLECTIONS) {
      try {
        ;(payloadExport.collections as Record<string, unknown[]>)[collection] =
          await fetchCollectionDocs(payload, collection)
      } catch {
        // Collection may not exist in this deployment.
      }
    }

    for (const globalSlug of GLOBALS) {
      try {
        ;(payloadExport.globals as Record<string, unknown>)[globalSlug] = await payload.findGlobal({
          slug: globalSlug as 'homepage-content',
          depth: 2,
          overrideAccess: true,
        })
      } catch {
        // Global may not exist.
      }
    }

    await fs.writeFile(
      path.join(workDir, 'payload-export.json'),
      JSON.stringify(payloadExport, null, 2),
      'utf8',
    )

    const mongoLines = await exportMongoRawJsonl(workDir)
    const manifest = {
      generatedAt: at,
      trigger,
      mongoDocumentLines: mongoLines,
      collectionsExported: Object.keys(payloadExport.collections as object).length,
      globalsExported: Object.keys(payloadExport.globals as object).length,
    }
    await fs.writeFile(path.join(workDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

    await zipDirectory(workDir, zipPath)
    const zipBody = await fs.readFile(zipPath)
    await putS3Object(s3Key, zipBody, 'application/zip')

    const status = await readBackupStatus()
    await recordBackupAttempt(
      {
        at,
        ok: true,
        message: `Backup uploaded (${(zipBody.length / (1024 * 1024)).toFixed(2)} MB)`,
        trigger,
        s3Key,
        sizeBytes: zipBody.length,
      },
      status,
    )

    await payload.db.connection?.close?.().catch(() => undefined)

    return { ok: true, s3Key, sizeBytes: zipBody.length }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backup failed'
    const status = await readBackupStatus().catch(() => ({
      lastSuccess: null,
      lastFailure: null,
      recentAttempts: [],
    }))
    await recordBackupAttempt(
      { at, ok: false, message, trigger },
      status,
    ).catch(() => undefined)

    return { ok: false, error: message }
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => undefined)
    await fs.rm(zipPath, { force: true }).catch(() => undefined)
  }
}
