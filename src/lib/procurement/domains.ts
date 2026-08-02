import type { Payload, Where } from 'payload'

import { PERMANENT_INTERNAL_DOMAIN } from './constants'

export function normalizeDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
}

export function extractEmailDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase()
  const at = trimmed.lastIndexOf('@')
  if (at <= 0 || at === trimmed.length - 1) return null
  return normalizeDomain(trimmed.slice(at + 1))
}

export function startOfUtcDay(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export function isExpiryReached(expiryDate: string | Date | null | undefined, now = new Date()): boolean {
  if (!expiryDate) return false
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  if (Number.isNaN(expiry.getTime())) return false
  return startOfUtcDay(expiry).getTime() <= startOfUtcDay(now).getTime()
}

export type ApprovedDomainMatch = {
  id: string
  domain: string
  companyName?: string | null
  project?: string | null
  status: 'active' | 'inactive'
  isPermanent?: boolean | null
  expiryDate?: string | null
}

/**
 * Returns an active approved domain for the given email when domain restriction applies.
 * Permanent internal domains never expire. External domains must be active and not expired.
 */
export async function findAuthorizedDomain(
  payload: Payload,
  email: string,
): Promise<ApprovedDomainMatch | null> {
  const domain = extractEmailDomain(email)
  if (!domain) return null

  if (domain === PERMANENT_INTERNAL_DOMAIN) {
    return {
      id: 'permanent',
      domain: PERMANENT_INTERNAL_DOMAIN,
      companyName: 'Shamal Technologies',
      project: 'Internal',
      status: 'active',
      isPermanent: true,
    }
  }

  const result = await payload.find({
    collection: 'procurement-approved-domains',
    where: {
      and: [
        { domain: { equals: domain } },
        { status: { equals: 'active' } },
        { isPermanent: { not_equals: true } },
      ],
    } satisfies Where,
    limit: 10,
    depth: 0,
    overrideAccess: true,
  })

  const now = new Date()
  const match = result.docs.find((doc) => !isExpiryReached(doc.expiryDate, now))
  if (!match) return null

  return {
    id: String(match.id),
    domain: match.domain,
    companyName: match.companyName,
    project: match.project,
    status: match.status,
    isPermanent: match.isPermanent,
    expiryDate: match.expiryDate ?? null,
  }
}

export async function ensurePermanentInternalDomain(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'procurement-approved-domains',
    where: {
      domain: { equals: PERMANENT_INTERNAL_DOMAIN },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0]
    if (!doc.isPermanent || doc.status !== 'active') {
      await payload.update({
        collection: 'procurement-approved-domains',
        id: doc.id,
        data: {
          isPermanent: true,
          status: 'active',
          companyName: doc.companyName || 'Shamal Technologies',
          project: doc.project || 'Internal',
          domainType: 'internal',
          expiryDate: null,
        },
        overrideAccess: true,
        context: { skipProcurementAudit: true, skipDomainProtection: true },
      })
    }
    return
  }

  await payload.create({
    collection: 'procurement-approved-domains',
    data: {
      domain: PERMANENT_INTERNAL_DOMAIN,
      companyName: 'Shamal Technologies',
      project: 'Internal',
      domainType: 'internal',
      status: 'active',
      isPermanent: true,
      notes: 'Permanent internal domain. Cannot be removed by administrators.',
    },
    overrideAccess: true,
    context: { skipProcurementAudit: true, skipDomainProtection: true },
  })
}
