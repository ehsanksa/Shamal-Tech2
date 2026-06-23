/**
 * Training interest form emails.
 */

import { sendEmail } from './index'
import { resolveTrainingFormRecipientEmail } from './contactFormRecipient'
import { readSmtpEnv } from './smtpEnv'
import {
  generateTrainingInterestAutoReplyEmail,
  trainingInterestAutoReplySubject,
} from './templates/training-interest-auto-reply'
import { escapeHtml, renderReferenceHighlightBox } from './templates/shamal-form-email-layout'

function getShamalFromEmail(): string {
  return readSmtpEnv('SMTP_FROM') || readSmtpEnv('SMTP_USER') || 'hello@shamal.sa'
}

export interface TrainingInterestSubmissionEmailData {
  fullName: string
  email: string
  mobile: string
  city: string
  referenceNumber: string
  nationality?: string
  organization?: string
  jobTitle?: string
  registeringAs?: string
  droneExperience?: string
  trainingPurpose: string
  expectedOutcomes?: string
  additionalInfo?: string
  referralSource?: string
}

/**
 * sendTrainingInterestAutoReply()
 * Sends one formatted HTML thank-you email to the applicant. Called once per submission.
 */
export async function sendTrainingInterestAutoReply(input: {
  applicantName: string
  applicantEmail: string
  referenceNumber: string
}): Promise<void> {
  const fromEmail = getShamalFromEmail()
  const html = generateTrainingInterestAutoReplyEmail({
    applicantName: input.applicantName,
    referenceNumber: input.referenceNumber,
  })

  const { messageId } = await sendEmail({
    to: input.applicantEmail,
    subject: trainingInterestAutoReplySubject(input.referenceNumber),
    html,
    from: fromEmail,
    replyTo: fromEmail,
  })

  console.log('[training-interest-email] Customer auto-reply sent', {
    to: input.applicantEmail,
    referenceNumber: input.referenceNumber,
    messageId: messageId ?? null,
  })
}

/**
 * sendTrainingInterestInternalNotification()
 * Sends one internal notification to the assigned Shamal contact. Called once per submission.
 */
export async function sendTrainingInterestInternalNotification(
  submission: TrainingInterestSubmissionEmailData,
  options?: {
    recipientEmail?: string | null
  },
): Promise<void> {
  const assigneeEmail = resolveTrainingFormRecipientEmail(options?.recipientEmail)
  const fromEmail = getShamalFromEmail()

  const fields: Array<[string, string | undefined]> = [
    ['Reference Number', submission.referenceNumber],
    ['Full Name', submission.fullName],
    ['Email', submission.email],
    ['Mobile', submission.mobile],
    ['City', submission.city],
    ['Nationality', submission.nationality],
    ['Organization', submission.organization],
    ['Job Title', submission.jobTitle],
    ['Registering As', submission.registeringAs],
    ['Drone / GIS Experience', submission.droneExperience],
    ['Training Purpose', submission.trainingPurpose],
    ['Expected Outcomes', submission.expectedOutcomes],
    ['Additional Info', submission.additionalInfo],
    ['Referral Source', submission.referralSource],
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
    <h2>New Training Interest Form Submission</h2>
    ${renderReferenceHighlightBox('Training Reference Number', submission.referenceNumber)}
    <div>${htmlRows}</div>
  `.trim()

  const { messageId } = await sendEmail({
    to: assigneeEmail,
    subject: `Training Interest Received - ${submission.fullName} | Ref: ${submission.referenceNumber}`,
    html,
    text: `New training interest form submission\n\n${text}`,
    from: fromEmail,
    replyTo: submission.email,
  })

  console.log('[training-interest-email] Internal notification sent', {
    to: assigneeEmail,
    referenceNumber: submission.referenceNumber,
    messageId: messageId ?? null,
  })
}
