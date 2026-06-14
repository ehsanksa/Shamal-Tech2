import { NextResponse } from 'next/server'

import { requireAdminUser } from '@/lib/backup/auth'
import { getBackupStatusPayload } from '@/lib/backup/status'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response

  try {
    const payload = await getBackupStatusPayload()
    return NextResponse.json(payload)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load status'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
