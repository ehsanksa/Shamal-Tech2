import { NextResponse } from 'next/server'

import { requireAdminUser } from '@/lib/backup/auth'
import { BACKUP_S3_PREFIX } from '@/lib/backup/constants'
import { getPresignedDownloadUrl } from '@/lib/backup/s3'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response

  const key = new URL(req.url).searchParams.get('key')
  if (!key || !key.startsWith(`${BACKUP_S3_PREFIX}/`) || !key.endsWith('.zip')) {
    return NextResponse.json({ error: 'Invalid backup key' }, { status: 400 })
  }

  try {
    const url = await getPresignedDownloadUrl(key)
    return NextResponse.json({ url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Download failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
