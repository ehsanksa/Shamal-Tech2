import type { Payload } from 'payload'

const COLLECTION = 'form-submit-attempts'

const DEFAULT_MAX_PER_IP_PER_HOUR = 5
const DEFAULT_MAX_PER_EMAIL_PER_DAY = 3

export type FormRateLimitOptions = {
  form: string
  ip: string
  email?: string
  maxPerIpPerHour?: number
  maxPerEmailPerDay?: number
}

export type FormRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number }

/**
 * Sliding-window limits persisted in Mongo (works across Vercel isolates).
 * Fail open if the DB handle is missing so a CMS outage does not block humans.
 */
export async function enforceFormRateLimit(
  payload: Payload,
  options: FormRateLimitOptions,
): Promise<FormRateLimitResult> {
  const db = payload.db.connection.db
  if (!db) return { allowed: true }

  const col = db.collection(COLLECTION)
  const now = new Date()
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const maxPerIp = options.maxPerIpPerHour ?? DEFAULT_MAX_PER_IP_PER_HOUR
  const maxPerEmail = options.maxPerEmailPerDay ?? DEFAULT_MAX_PER_EMAIL_PER_DAY

  await col.deleteMany({ createdAt: { $lt: dayAgo } })

  const ip = options.ip.trim()
  if (ip) {
    const ipCount = await col.countDocuments({
      form: options.form,
      ip,
      createdAt: { $gte: hourAgo },
    })
    if (ipCount >= maxPerIp) {
      return { allowed: false, retryAfterSec: 3600 }
    }
  }

  const email = options.email?.trim().toLowerCase()
  if (email) {
    const emailCount = await col.countDocuments({
      form: options.form,
      email,
      createdAt: { $gte: dayAgo },
    })
    if (emailCount >= maxPerEmail) {
      return { allowed: false, retryAfterSec: 86_400 }
    }
  }

  await col.insertOne({
    form: options.form,
    ip: ip || 'unknown',
    email: email || undefined,
    createdAt: now,
  })

  return { allowed: true }
}
