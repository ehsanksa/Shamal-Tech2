import type { Payload, PayloadRequest } from 'payload'

export type ProcurementAuditAction =
  | 'domain_added'
  | 'domain_edited'
  | 'domain_disabled'
  | 'domain_deleted'
  | 'form_enabled'
  | 'form_disabled'
  | 'domain_restriction_enabled'
  | 'domain_restriction_disabled'

function userLabel(req?: PayloadRequest | null): { userId?: string; userEmail?: string; userName?: string } {
  const user = req?.user
  if (!user) {
    return { userName: 'System' }
  }

  const name = 'name' in user && typeof user.name === 'string' ? user.name.trim() : ''

  return {
    userId: String(user.id),
    userEmail: typeof user.email === 'string' ? user.email : undefined,
    userName: name || (typeof user.email === 'string' ? user.email : `User ${user.id}`),
  }
}

function serializeValue(value: unknown): string | null {
  if (value === undefined) return null
  if (value === null) return null
  if (typeof value === 'string') return value
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export async function writeProcurementAuditLog(
  payload: Payload,
  input: {
    action: ProcurementAuditAction
    previousValue?: unknown
    newValue?: unknown
    summary?: string
    relatedDomain?: string
    req?: PayloadRequest | null
  },
): Promise<void> {
  if (input.req?.context?.skipProcurementAudit) return

  const actor = userLabel(input.req)

  try {
    await payload.create({
      collection: 'procurement-audit-logs',
      data: {
        action: input.action,
        previousValue: serializeValue(input.previousValue),
        newValue: serializeValue(input.newValue),
        summary: input.summary,
        relatedDomain: input.relatedDomain,
        userId: actor.userId,
        userEmail: actor.userEmail,
        userName: actor.userName || 'System',
        performedAt: new Date().toISOString(),
      },
      overrideAccess: true,
      context: { skipProcurementAudit: true },
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Failed to write procurement audit log')
  }
}
