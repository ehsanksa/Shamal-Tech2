/**
 * Diagnose and repair corrupted media where MongoDB metadata exists but S3 files are missing.
 *
 * Usage:
 *   npx tsx scripts/repair-media.ts --id 6a3ba63f084594a0822c7f1c
 *   npx tsx scripts/repair-media.ts --filename mohammed-farhan-alhazmi.png
 *   npx tsx scripts/repair-media.ts --id <id> --file ./path/to/image.png
 */
import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import {
  HeadObjectCommand,
  ListObjectVersionsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getPayload } from 'payload'
import config from '@payload-config'
import sharp from 'sharp'

import { S3_MEDIA_CACHE_CONTROL } from '../src/lib/backup/constants'

function parseArgs(): { id?: string; filename?: string; file?: string } {
  const args = process.argv.slice(2)
  const out: { id?: string; filename?: string; file?: string } = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id') out.id = args[++i]
    else if (args[i] === '--filename') out.filename = args[++i]
    else if (args[i] === '--file') out.file = args[++i]
  }
  return out
}

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  })
}

function resolveS3Key(filename: string): string {
  const prefix = process.env.S3_PREFIX ?? ''
  if (!prefix) return filename
  return `${prefix}/${filename}`.replace(/\/+/g, '/')
}

async function headObject(client: S3Client, key: string) {
  try {
    const res = await client.send(
      new HeadObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }),
    )
    return { exists: true, size: res.ContentLength ?? 0 }
  } catch {
    return { exists: false, size: 0 }
  }
}

async function listVersions(client: S3Client, key: string) {
  try {
    const res = await client.send(
      new ListObjectVersionsCommand({
        Bucket: process.env.S3_BUCKET!,
        Prefix: key,
      }),
    )
    return (res.Versions ?? []).filter((v) => v.Key === key)
  } catch {
    return []
  }
}

async function uploadToS3(client: S3Client, key: string, body: Buffer, mimeType: string) {
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: body,
      ContentType: mimeType,
      CacheControl: S3_MEDIA_CACHE_CONTROL,
    }),
  )
}

type MediaDoc = {
  id: string
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { filename?: string | null; width?: number | null; height?: number | null }>
}

async function regenerateSizes(
  client: S3Client,
  doc: MediaDoc,
  mainBuffer: Buffer,
  mimeType: string,
) {
  const sizes = doc.sizes ?? {}
  for (const [name, size] of Object.entries(sizes)) {
    const sizeFilename = size?.filename
    const width = size?.width
    const height = size?.height
    if (!sizeFilename || !width) continue

    let pipeline = sharp(mainBuffer).resize(width, height ?? undefined, {
      fit: height ? 'cover' : 'inside',
      withoutEnlargement: true,
      position: 'centre',
    })

    const ext = path.extname(sizeFilename).toLowerCase()
    if (ext === '.webp') pipeline = pipeline.webp()
    else if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: 85 })
    else pipeline = pipeline.png()

    const buffer = await pipeline.toBuffer()
    const key = resolveS3Key(sizeFilename)
    await uploadToS3(client, key, buffer, mimeType)
    console.log(`  ✅ uploaded size "${name}": ${sizeFilename} (${buffer.byteLength} bytes)`)
  }
}

async function run() {
  const { id, filename, file } = parseArgs()
  if (!id && !filename) {
    console.error('Provide --id <mediaId> or --filename <filename>')
    process.exit(1)
  }

  if (
    !process.env.S3_BUCKET ||
    !process.env.S3_REGION ||
    !process.env.S3_ACCESS_KEY_ID ||
    !process.env.S3_SECRET_ACCESS_KEY
  ) {
    console.error('S3 env vars are required')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const client = getS3Client()

  const result = id
    ? await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true })
    : (
        await payload.find({
          collection: 'media',
          where: { filename: { equals: filename } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
      ).docs[0]

  if (!result) {
    console.error('Media document not found')
    process.exit(1)
  }

  const doc = result as MediaDoc
  const mainFilename = doc.filename
  if (!mainFilename) {
    console.error('Media has no filename')
    process.exit(1)
  }

  const mainKey = resolveS3Key(mainFilename)
  console.log(`\nMedia: ${doc.id}`)
  console.log(`Filename: ${mainFilename}`)
  console.log(`S3 key: ${mainKey}`)

  const head = await headObject(client, mainKey)
  console.log(`Main file on S3: ${head.exists ? `✅ ${head.size} bytes` : '❌ missing'}`)

  const versions = await listVersions(client, mainKey)
  if (versions.length > 0) {
    console.log(`\nS3 versions for main file (${versions.length}):`)
    for (const v of versions.slice(0, 10)) {
      console.log(`  - ${v.VersionId} | ${v.LastModified?.toISOString()} | ${v.Size} bytes`)
    }
  }

  const sizeKeys = Object.values(doc.sizes ?? {})
    .map((s) => s?.filename)
    .filter(Boolean) as string[]

  console.log('\nSize variants on S3:')
  for (const sizeFilename of sizeKeys) {
    const key = resolveS3Key(sizeFilename)
    const h = await headObject(client, key)
    console.log(`  ${sizeFilename}: ${h.exists ? `✅ ${h.size}b` : '❌ missing'}`)
  }

  if (head.exists && sizeKeys.every(async () => true)) {
  }

  if (file) {
    console.log(`\nRe-uploading from local file: ${file}`)
    const buffer = await fs.readFile(file)
    const mimeType = doc.mimeType || 'image/png'

    await uploadToS3(client, mainKey, buffer, mimeType)
    console.log(`✅ Main file uploaded (${buffer.byteLength} bytes)`)

    const meta = await sharp(buffer).metadata()
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        width: meta.width,
        height: meta.height,
        filesize: buffer.byteLength,
      },
      overrideAccess: true,
    })

    await regenerateSizes(client, doc, buffer, mimeType)
    console.log('\n✅ Media repaired. Verify:')
    console.log(`   https://shamal.sa/api/media/file/${encodeURIComponent(mainFilename)}`)
    process.exit(0)
  }

  if (!head.exists) {
    console.log('\n⚠️  Main file is missing from S3. MongoDB still has metadata but files are gone.')
    console.log('   This usually happens after the Payload 3.71 S3 crop bug corrupts uploads.')
    console.log('\nTo fix, re-upload the original image:')
    console.log(`   npx tsx scripts/repair-media.ts --id ${doc.id} --file ./path/to/${mainFilename}`)
    console.log('\nOr in admin: delete this media entry and upload a fresh image (after deploying the Payload upgrade).')
    process.exit(1)
  }

  const missingSizes = []
  for (const sizeFilename of sizeKeys) {
    const key = resolveS3Key(sizeFilename)
    const h = await headObject(client, key)
    if (!h.exists) missingSizes.push(sizeFilename)
  }

  if (missingSizes.length > 0) {
    console.log(`\nRegenerating ${missingSizes.length} missing size(s) from main file on S3...`)
    const { GetObjectCommand } = await import('@aws-sdk/client-s3')
    const res = await client.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: mainKey }),
    )
    const mainBuffer = Buffer.from(await res.Body!.transformToByteArray())
    await regenerateSizes(client, doc, mainBuffer, doc.mimeType || 'image/png')
    console.log('\n✅ Size variants regenerated.')
  } else {
    console.log('\n✅ All files present on S3.')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
