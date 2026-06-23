/**
 * Contact form email flow — one customer auto-reply and one internal notification per submission.
 */

import { sendEmail } from './index'
import { readSmtpEnv } from './smtpEnv'
import { generateLeadResponseEmail } from './templates/lead-response'

/** Shamal assignee for contact form internal notifications. */
export const CONTACT_FORM_ASSIGNEE_EMAIL = 'r.aljahdali@shamal.sa'

const SHAMAL_BRAND_NAME = 'Shamal Technologies'

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
  })

  const { messageId } = await sendEmail({
    to: submission.email,
    subject: `Thank You for Contacting ${SHAMAL_BRAND_NAME}`,
    html,
    from: fromEmail,
    replyTo: fromEmail,
  })

  console.log('[contact-email] Customer auto-reply sent', {
    to: submission.email,
    messageId: messageId ?? null,
  })
}

/**
 * sendInternalContactNotification()
 * Sends one internal notification to the assigned Shamal contact. Called once per submission.
 */
export async function sendInternalContactNotification(
  submission: ContactFormSubmission,
  submittedAt: Date = new Date(),
): Promise<void> {
  const assigneeEmail =
    readSmtpEnv('CONTACT_FORM_ASSIGNEE_EMAIL') || CONTACT_FORM_ASSIGNEE_EMAIL
  const fromEmail = getShamalFromEmail()
  const submittedAtLabel = formatSubmittedAt(submittedAt)

  const fields: Array<[string, string | undefined]> = [
    ['Name', submission.name],
    ['Email', submission.email],
    ['Phone', submission.phone],
    ['Company', submission.company],
    ['Subject', submission.subject],
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
    <div>${htmlRows}</div>
  `.trim()

  const ccEmail = readSmtpEnv('CONTACT_FORM_CC_EMAIL')
  const cc =
    ccEmail && ccEmail.toLowerCase() !== assigneeEmail.toLowerCase() ? ccEmail : undefined

  const { messageId } = await sendEmail({
    to: assigneeEmail,
    subject: `New Contact Form Submission - ${submission.name}`,
    html,
    text: `New contact form submission\n\n${text}`,
    from: fromEmail,
    replyTo: submission.email,
    cc,
  })

  console.log('[contact-email] Internal notification sent', {
    to: assigneeEmail,
    cc: cc ?? null,
    messageId: messageId ?? null,
  })
}
