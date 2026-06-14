import type { Payload } from 'payload'
import type { User } from '@/payload-types'

export type BackupActor = 'cron' | 'admin'

function normalizeEmail(email: string | undefined | null): string | null {
  if (!email || typeof email !== 'string') return null
  return email.trim().toLowerCase()
}

/**
 * Backup UI/API treats these emails as super-admin even when the `roles` field
 * is missing from the user document (legacy Users schema without roles).
 */
function parseEnvEmailList(raw: string | undefined): Set<string> {
  if (!raw?.trim()) return new Set()
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  )
}

function isBackupSuperAdminUser(user: User | null | undefined): boolean {
  if (!user) return false

  const roles = (user as { roles?: string[] }).roles
  if (roles?.includes('admin')) return true

  const email = normalizeEmail(user.email)
  if (!email) return false

  const envList = parseEnvEmailList(process.env.PAYLOAD_SUPERADMIN_EMAILS)
  if (envList.has(email)) return true

  const seedAdmin = normalizeEmail(process.env.SEED_ADMIN_EMAIL)
  if (seedAdmin && email === seedAdmin) return true

  /** Known company super-admin (Payload Users schema may omit `roles`). */
  if (email === 's.ehsan@shamal.sa') return true

  return false
}

export async function authorizeBackupRequest(
  request: Request,
  payload: Payload,
): Promise<BackupActor | null> {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return 'cron'
  }

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return null

  if (isBackupSuperAdminUser(user as User)) return 'admin'

  return null
}
