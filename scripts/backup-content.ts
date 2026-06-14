import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import archiver from 'archiver'
import { createWriteStream } from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getPayload } from 'payload'
import config from '@payload-config'

type PayloadLike = Awaited<ReturnType<typeof getPayload>>

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
  'header',
  'homepage-content',
  'posts-page-content',
  'products-page-content',
  'sectors-content',
  'seo-settings',
  'services-page-content',
  'site-settings',
] as const

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

async function fetchCollectionDocs(payload: PayloadLike, collection: string): Promise<unknown[]> {
  const docs: unknown[] = []
  let page = 1
  while (true) {
    const res = await payload.find({
      collection: collection as any,
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

async function mirrorMediaToLocal(payloadExport: any, mediaDir: string): Promise<number> {
  const mediaDocs = Array.isArray(payloadExport.collections.media)
    ? payloadExport.collections.media
    : []
  let mirrored = 0
  for (const media of mediaDocs) {
    const url = typeof media?.url === 'string' ? media.url : ''
    if (!url) continue
    const normalizedUrl = url.startsWith('http')
      ? url
      : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${url}`
    try {
      const res = await fetch(normalizedUrl)
      if (!res.ok) continue
      const buff = Buffer.from(await res.arrayBuffer())
      const filename = String(media.filename || path.basename(url) || `media-${media.id}`)
      await fs.writeFile(path.join(mediaDir, filename), buff)
      mirrored += 1
    } catch {
      // Ignore individual media mirror failures and continue backup.
    }
  }
  return mirrored
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

async function uploadZipToS3(zipPath: string, timestamp: string): Promise<string | null> {
  if (
    !process.env.S3_BUCKET ||
    !process.env.S3_REGION ||
    !process.env.S3_ACCESS_KEY_ID ||
    !process.env.S3_SECRET_ACCESS_KEY
  ) {
    return null
  }
  const key = `database-backups/content-backup-${timestamp}.zip`
  const body = await fs.readFile(zipPath)
  const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  })
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: 'application/zip',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  return `s3://${process.env.S3_BUCKET}/${key}`
}

async function run(): Promise<void> {
  const payload = await getPayload({ config })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const root = path.resolve(process.cwd(), 'backup', 'content-backups', timestamp)
  const mediaDir = path.join(root, 'media')
  await ensureDir(mediaDir)

  const payloadExport: Record<string, any> = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: process.env.NEXT_PUBLIC_SERVER_URL || 'local',
    },
    collections: {},
    globals: {},
  }

  for (const collection of COLLECTIONS) {
    try {
      payloadExport.collections[collection] = await fetchCollectionDocs(payload, collection)
      console.log(`✓ Exported collection: ${collection}`)
    } catch {
      // Collection may not exist in this deployment. Keep backup resilient.
    }
  }
  for (const globalSlug of GLOBALS) {
    try {
      payloadExport.globals[globalSlug] = await payload.findGlobal({
        slug: globalSlug as any,
        depth: 2,
        overrideAccess: true,
      })
      console.log(`✓ Exported global: ${globalSlug}`)
    } catch {
      // Global may not exist in this deployment. Keep backup resilient.
    }
  }

  await fs.writeFile(
    path.join(root, 'payload-export.json'),
    JSON.stringify(payloadExport, null, 2),
    'utf8',
  )
  const mediaFiles = await mirrorMediaToLocal(payloadExport, mediaDir)
  const manifest = {
    generatedAt: new Date().toISOString(),
    mediaFilesMirrored: mediaFiles,
    backupDir: root,
  }
  await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  const zipPath = `${root}.zip`
  await zipDirectory(root, zipPath)
  const uploadedS3 = await uploadZipToS3(zipPath, timestamp)

  console.log('✅ Content backup created successfully')
  console.log(`   Local folder: ${root}`)
  console.log(`   Zip archive: ${zipPath}`)
  console.log(`   Media replicas: ${mediaFiles}`)
  if (uploadedS3) console.log(`   S3 uploaded: ${uploadedS3}`)

  await payload.db.connection?.close()
}

run().catch((err) => {
  console.error('❌ Content backup failed:', err)
  process.exit(1)
})
