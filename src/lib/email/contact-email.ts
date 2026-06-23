/**
 * Contact form email flow — one customer auto-reply and one internal notification per submission.
 */

import { sendEmail } from './index'
import { readSmtpEnv } from './smtpEnv'
import { resolveContactFormRecipientEmail } from './contactFormRecipient'
import {
  contactAutoReplySubject,
  generateLeadResponseEmail,
} from './templates/lead-response'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getShamalFromEmail(): string {
  return readSmtpEnv('SMTP_FROM') || readSmtpEnv('SMTP_USER') || 'hello@shamal.sa'
}

function formatSubmittedAt(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Riyadh',
  })
}

export interface ContactFormSubmission {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
  ticketNumber: string
  services?: string[]
}

/**
 * sendCustomerAutoReply()
 * Sends one formatted HTML thank-you email to the customer. Called once per submission.
 */
export async function sendCustomerAutoReply(submission: ContactFormSubmission): Promise<void> {
  const fromEmail = getShamalFromEmail()
  const html = generateLeadResponseEmail({
    leadName: submission.name,
    leadEmail: submission.email,
    ticketNumber: submission.ticketNumber,
    inquirySubject: submission.subject,
  })

  const { messageId } = await sendEmail({
    to: submission.email,
    subject: contactAutoReplySubject(submission.ticketNumber),
    html,
    from: fromEmail,
    replyTo: fromEmail,
  })

  console.log('[contact-email] Customer auto-reply sent', {
    to: submission.email,
    ticketNumber: submission.ticketNumber,
    messageId: messageId ?? null,
  })
}

/**
 * sendInternalContactNotification()
 * Sends one internal notification to the assigned Shamal contact. Called once per submission.
 */
export async function sendInternalContactNotification(
  submission: ContactFormSubmission,
  options?: {
    recipientEmail?: string | null
    submittedAt?: Date
  },
): Promise<void> {
  const assigneeEmail = resolveContactFormRecipientEmail(options?.recipientEmail)
  const fromEmail = getShamalFromEmail()
  const submittedAtLabel = formatSubmittedAt(options?.submittedAt ?? new Date())
  const servicesLabel =
    submission.services && submission.services.length > 0
      ? submission.services.join(', ')
      : undefined

  const fields: Array<[string, string | undefined]> = [
    ['Ticket Number', submission.ticketNumber],
    ['Name', submission.name],
    ['Email', submission.email],
    ['Phone', submission.phone],
    ['Company', submission.company],
    ['Subject', submission.subject],
    ['Services', servicesLabel],
    ['Message', submission.message],
    ['Submitted', submittedAtLabel],
  ]

  const htmlRows = fields
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value!)}</p>`,
    )
    .join('')

  const text = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Reference:</strong> ${escapeHtml(submission.ticketNumber)}</p>
    <div>${htmlRows}</div>
  `.trim()

  const { messageId } = await sendEmail({
    to: assigneeEmail,
    subject: `New Contact Form Submission - ${submission.name} | Ref: ${submission.ticketNumber}`,
    html,
    text: `New contact form submission\n\n${text}`,
    from: fromEmail,
    replyTo: submission.email,
  })

  console.log('[contact-email] Internal notification sent', {
    to: assigneeEmail,
    ticketNumber: submission.ticketNumber,
    messageId: messageId ?? null,
  })
}
