import { NextResponse } from 'next/server'

import { requireAdminUser } from '@/lib/backup/auth'
import { BACKUP_META_PREFIX, BACKUP_S3_PREFIX } from '@/lib/backup/constants'
import { deleteBackupZip } from '@/lib/backup/s3'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isDeletableBackupKey(key: string): boolean {
  return (
    key.startsWith(`${BACKUP_S3_PREFIX}/`) &&
    !key.startsWith(BACKUP_META_PREFIX) &&
    key.endsWith('.zip')
  )
}

export async function DELETE(req: Request) {
  const auth = await requireAdminUser()
  if (!auth.ok) return auth.response

  const key = new URL(req.url).searchParams.get('key')
  if (!key || !isDeletableBackupKey(key)) {
    return NextResponse.json({ error: 'Invalid backup key' }, { status: 400 })
  }

  try {
    await deleteBackupZip(key)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
