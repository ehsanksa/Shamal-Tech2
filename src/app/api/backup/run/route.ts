import { NextResponse } from 'next/server'

import { requireAdminUser } from '@/lib/backup/auth'
import { runContentBackup } from '@/lib/backup/run'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST() {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response

  const result = await runContentBackup('manual')
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    s3Key: result.s3Key,
    sizeBytes: result.sizeBytes,
  })
}
