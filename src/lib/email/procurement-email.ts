import { sendEmail } from './index'
import {
  DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL,
  DEFAULT_PROCUREMENT_RECIPIENT_EMAIL,
  DEFAULT_PROCUREMENT_SENDER_EMAIL,
  itemCategoryLabel,
  priorityLabel,
} from '../procurement/constants'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function parseNotificationEmails(raw?: string | null): string[] {
  if (!raw?.trim()) return []

  return raw
    .split(/[\n,;]+/)
    .map((email) => email.trim())
    .filter(Boolean)
}

export function resolveProcurementNotificationRecipients(settings?: {
  defaultAssigneeEmail?: string | null
  procurementRecipientEmail?: string | null
  notificationEmails?: string | null
} | null): string[] {
  const primary =
    settings?.defaultAssigneeEmail?.trim() ||
    settings?.procurementRecipientEmail?.trim() ||
    DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL ||
    DEFAULT_PROCUREMENT_RECIPIENT_EMAIL

  const extras = parseNotificationEmails(settings?.notificationEmails)
  const all = [primary, ...extras].filter(Boolean)
  return Array.from(new Set(all.map((e) => e.toLowerCase())))
}

export async function sendProcurementRequestNotification(
  submission: {
    requestId?: string
    requesterName: string
    email: string
    phoneNumber?: string
    companyName?: string
    department?: string
    project?: string
    priority?: string
    itemCategory?: string
    itemCategoryOther?: string
    itemName?: string
    estimatedTotalCost?: number
    estimatedUnitCost?: number
    businessJustification?: string
    emailDomain?: string
  },
  options?: {
    defaultAssigneeEmail?: string | null
    procurementRecipientEmail?: string | null
    notificationEmails?: string | null
    senderEmail?: string | null
    adminRecordUrl?: string | null
    clickupTaskUrl?: string | null
  },
): Promise<void> {
  const recipients = resolveProcurementNotificationRecipients(options)
  const from = options?.senderEmail?.trim() || DEFAULT_PROCUREMENT_SENDER_EMAIL

  const category =
    submission.itemCategory === 'other' && submission.itemCategoryOther?.trim()
      ? `Other (${submission.itemCategoryOther.trim()})`
      : itemCategoryLabel(submission.itemCategory)

  const estimatedCost =
    submission.estimatedTotalCost != null
      ? String(submission.estimatedTotalCost)
      : submission.estimatedUnitCost != null
        ? String(submission.estimatedUnitCost)
        : undefined

  const rows: Array<[string, string | undefined]> = [
    ['Request ID', submission.requestId],
    ['Requester Name', submission.requesterName],
    ['Email', submission.email],
    ['Phone', submission.phoneNumber],
    ['Company', submission.companyName],
    ['Department', submission.department],
    ['Project', submission.project],
    ['Priority', priorityLabel(submission.priority)],
    ['Item Category', category],
    ['Item / Service', submission.itemName],
    ['Estimated Cost', estimatedCost],
    ['Business Justification', submission.businessJustification],
    ['Email Domain', submission.emailDomain],
  ]

  const htmlRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value!)}</p>`,
    )
    .join('')

  const links = [
    options?.adminRecordUrl
      ? `<p><a href="${escapeHtml(options.adminRecordUrl)}">View admin record</a></p>`
      : '',
    options?.clickupTaskUrl
      ? `<p><a href="${escapeHtml(options.clickupTaskUrl)}">Open ClickUp task</a></p>`
      : '',
  ].join('')

  const html = `
    <h2>New Procurement Request Submitted</h2>
    <div>${htmlRows}</div>
    ${links}
  `

  const text = [
    ...rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
    options?.adminRecordUrl ? `Admin: ${options.adminRecordUrl}` : '',
    options?.clickupTaskUrl ? `ClickUp: ${options.clickupTaskUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  await sendEmail({
    to: recipients,
    from,
    subject: 'New Procurement Request Submitted',
    html,
    text,
  })
}

export async function sendDomainExpiryNotification(input: {
  notificationEmails?: string | null
  procurementRecipientEmail?: string | null
  defaultAssigneeEmail?: string | null
  domain: string
  companyName?: string | null
  project?: string | null
  expiryDate?: string | null
  noticeType: '30_days' | '7_days' | 'expired'
}): Promise<void> {
  const recipients = resolveProcurementNotificationRecipients(input)
  const adminUrl = process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/procurement-approved-domains`
    : undefined

  const titles = {
    '30_days': 'Procurement domain expires in 30 days',
    '7_days': 'Procurement domain expires in 7 days',
    expired: 'Procurement domain has expired',
  } as const

  const title = titles[input.noticeType]
  const rows: Array<[string, string | undefined]> = [
    ['Domain', input.domain],
    ['Company', input.companyName ?? undefined],
    ['Project', input.project ?? undefined],
    ['Expiry Date', input.expiryDate ?? undefined],
  ]

  const htmlRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value!)}</p>`,
    )
    .join('')

  const html = `
    <h2>${escapeHtml(title)}</h2>
    <div>${htmlRows}</div>
    ${adminUrl ? `<p><a href="${escapeHtml(adminUrl)}">Manage approved domains</a></p>` : ''}
  `

  const text = [`${title}`, ...rows.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`)].join('\n')

  await sendEmail({
    to: recipients,
    subject: `${title}: ${input.domain}`,
    html,
    text,
  })
}
