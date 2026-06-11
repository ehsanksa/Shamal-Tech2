import { sendEmail } from './index'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseNotificationEmails(raw?: string | null): string[] {
  const fallback = process.env.CONTACT_EMAIL || 'hello@shamal.sa'
  if (!raw?.trim()) {
    return [fallback]
  }

  const emails = raw
    .split(/[\n,;]+/)
    .map((email) => email.trim())
    .filter(Boolean)

  return emails.length > 0 ? emails : [fallback]
}

export async function sendEventClientNotification(
  submission: {
    clientName: string
    companyName?: string
    jobTitle?: string
    phoneNumber?: string
    email: string
    sector?: string
    serviceRequired?: string
    clientInterests?: string
    priorityLevel?: string
    additionalNotes?: string
    eventName?: string
  },
  options?: {
    notificationEmails?: string | null
  },
): Promise<void> {
  const recipients = parseNotificationEmails(options?.notificationEmails)
  const adminUrl = process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/event-client-submissions`
    : undefined

  const rows = [
    ['Client Name', submission.clientName],
    ['Company Name', submission.companyName],
    ['Job Title', submission.jobTitle],
    ['Phone Number', submission.phoneNumber],
    ['Email', submission.email],
    ['Sector', submission.sector],
    ['Service Required', submission.serviceRequired],
    ['Client Interests', submission.clientInterests],
    ['Priority Level', submission.priorityLevel],
    ['Additional Notes', submission.additionalNotes],
    ['Event Name', submission.eventName],
  ]

  const htmlRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value!)}</p>`,
    )
    .join('')

  const html = `
    <h2>New Visitors Form Submission</h2>
    <div>${htmlRows}</div>
    ${adminUrl ? `<p><a href="${escapeHtml(adminUrl)}">View in admin panel</a></p>` : ''}
  `

  const text = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')

  await sendEmail({
    to: recipients,
    subject: `New Visitors Form: ${submission.clientName}${submission.eventName ? ` — ${submission.eventName}` : ''}`,
    html,
    text: `New visitors form submission\n\n${text}`,
    replyTo: submission.email,
  })
}

export { parseNotificationEmails }
