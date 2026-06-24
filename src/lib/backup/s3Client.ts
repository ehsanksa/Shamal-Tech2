import { S3Client } from '@aws-sdk/client-s3'

export function isBackupS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_REGION,
  )
}

export function getBackupS3Client(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  })
}

export function getBackupBucket(): string {
  return process.env.S3_BUCKET!
}

export function getMediaPrefix(): string {
  return (process.env.S3_PREFIX ?? '').replace(/^\/+|\/+$/g, '')
}
