import type { Payload } from 'payload'

import { sendDomainExpiryNotification } from '../email/procurement-email'
import { isExpiryReached, startOfUtcDay } from './domains'

function daysUntilExpiry(expiryDate: string | Date, now = new Date()): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate
  const ms = startOfUtcDay(expiry).getTime() - startOfUtcDay(now).getTime()
  return Math.round(ms / (24 * 60 * 60 * 1000))
}

export async function processDomainExpiry(payload: Payload): Promise<{
  expired: number
  notified30: number
  notified7: number
  notifiedExpired: number
}> {
  const settings = (await payload.findGlobal({
    slug: 'procurement-form-settings',
    depth: 0,
  })) as {
    notificationEmails?: string | null
    procurementRecipientEmail?: string | null
    defaultAssigneeEmail?: string | null
  }

  const domains = await payload.find({
    collection: 'procurement-approved-domains',
    where: {
      and: [
        { isPermanent: { not_equals: true } },
        { expiryDate: { exists: true } },
      ],
    },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  let expired = 0
  let notified30 = 0
  let notified7 = 0
  let notifiedExpired = 0
  const now = new Date()

  for (const doc of domains.docs) {
    if (!doc.expiryDate) continue

    const daysLeft = daysUntilExpiry(doc.expiryDate, now)
    const updates: Record<string, unknown> = {}

    if (isExpiryReached(doc.expiryDate, now) && doc.status === 'active') {
      updates.status = 'inactive'
      expired += 1
    }

    if (daysLeft === 30 && !doc.notified30Days) {
      await sendDomainExpiryNotification({
        notificationEmails: settings.notificationEmails,
        procurementRecipientEmail: settings.procurementRecipientEmail,
        defaultAssigneeEmail: settings.defaultAssigneeEmail,
        domain: doc.domain,
        companyName: doc.companyName,
        project: doc.project,
        expiryDate: doc.expiryDate,
        noticeType: '30_days',
      })
      updates.notified30Days = true
      notified30 += 1
    }

    if (daysLeft === 7 && !doc.notified7Days) {
      await sendDomainExpiryNotification({
        notificationEmails: settings.notificationEmails,
        procurementRecipientEmail: settings.procurementRecipientEmail,
        defaultAssigneeEmail: settings.defaultAssigneeEmail,
        domain: doc.domain,
        companyName: doc.companyName,
        project: doc.project,
        expiryDate: doc.expiryDate,
        noticeType: '7_days',
      })
      updates.notified7Days = true
      notified7 += 1
    }

    if (daysLeft <= 0 && !doc.notifiedExpired) {
      await sendDomainExpiryNotification({
        notificationEmails: settings.notificationEmails,
        procurementRecipientEmail: settings.procurementRecipientEmail,
        defaultAssigneeEmail: settings.defaultAssigneeEmail,
        domain: doc.domain,
        companyName: doc.companyName,
        project: doc.project,
        expiryDate: doc.expiryDate,
        noticeType: 'expired',
      })
      updates.notifiedExpired = true
      notifiedExpired += 1
    }

    if (Object.keys(updates).length > 0) {
      await payload.update({
        collection: 'procurement-approved-domains',
        id: doc.id,
        data: updates,
        overrideAccess: true,
        context: {
          skipProcurementAudit: updates.status !== 'inactive',
          skipDomainProtection: true,
          procurementAuditAction: updates.status === 'inactive' ? 'domain_disabled' : undefined,
        },
      })
    }
  }

  return { expired, notified30, notified7, notifiedExpired }
}
