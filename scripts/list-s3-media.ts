import 'dotenv/config'
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'

async function run() {
  const query = process.argv[2]?.toLowerCase() || ''
  const client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  })
  const prefix = `${process.env.S3_PREFIX || 'media'}/`
  let token: string | undefined
  const matches: Array<{ key: string; size: number; modified: string }> = []

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET!,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    )
    for (const obj of res.Contents ?? []) {
      if (!obj.Key) continue
      if (!query || obj.Key.toLowerCase().includes(query)) {
        matches.push({
          key: obj.Key,
          size: obj.Size ?? 0,
          modified: (obj.LastModified ?? new Date()).toISOString(),
        })
      }
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)

  matches.sort((a, b) => b.modified.localeCompare(a.modified))
  console.log(`Found ${matches.length} object(s)${query ? ` matching "${query}"` : ''}:`)
  for (const m of matches.slice(0, 50)) {
    console.log(`  ${m.modified} | ${m.size}b | ${m.key}`)
  }
}

run().catch(console.error)
