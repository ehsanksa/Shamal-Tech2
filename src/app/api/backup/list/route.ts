import { NextResponse } from 'next/server'

import { requireAdminUser } from '@/lib/backup/auth'
import { listBackupZips } from '@/lib/backup/s3'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response

  try {
    const backups = await listBackupZips()
    return NextResponse.json({ backups })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to list backups'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
