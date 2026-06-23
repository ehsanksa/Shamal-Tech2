/**
 * Lead email functions — internal notifications for quote and legacy flows.
 */

import { sendEmail } from './index'
import { resolveQuotationFormRecipientEmail } from './contactFormRecipient'
import { escapeHtml, renderReferenceHighlightBox } from './templates/shamal-form-email-layout'

/**
 * Send notification email to internal team about a new lead
 */
export async function sendLeadNotificationEmail(lead: {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
  referenceNumber?: string
  referenceLabel?: string
  services?: Array<{ title?: string; slug?: string }>
  to?: string
}): Promise<void> {
  const recipientEmail = resolveQuotationFormRecipientEmail(
    lead.to || process.env.QUOTATION_FORM_RECIPIENT_EMAIL,
  )

  const servicesList = lead.services && lead.services.length > 0
    ? lead.services.map((s) => s.title || s.slug || 'Unknown').join(', ')
    : 'None selected'

  const referenceBlock =
    lead.referenceNumber && lead.referenceLabel
      ? renderReferenceHighlightBox(lead.referenceLabel, lead.referenceNumber)
      : lead.referenceNumber
        ? `<p><strong>Reference:</strong> ${escapeHtml(lead.referenceNumber)}</p>`
        : ''

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Received</title>
</head>
<body style="font-family:Arial, Helvetica, sans-serif; line-height:1.6; color:#333333; max-width:600px; margin:0 auto; padding:20px; background-color:#f4f7fb;">
  <div style="background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color:#005EB8; border-bottom:2px solid #005EB8; padding-bottom:10px;">New Lead Received</h2>
    ${referenceBlock}
    <div style="background-color:#f9f9f9; padding:20px; border-radius:4px; margin:20px 0;">
      <p style="margin:10px 0;"><strong style="color:#005EB8; display:inline-block; min-width:120px;">Name:</strong> ${escapeHtml(lead.name)}</p>
      <p style="margin:10px 0;"><strong style="color:#005EB8; display:inline-block; min-width:120px;">Email:</strong> <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>
      ${lead.phone ? `<p style="margin:10px 0;"><strong style="color:#005EB8; display:inline-block; min-width:120px;">Phone:</strong> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></p>` : ''}
      ${lead.company ? `<p style="margin:10px 0;"><strong style="color:#005EB8; display:inline-block; min-width:120px;">Company:</strong> ${escapeHtml(lead.company)}</p>` : ''}
      ${lead.subject ? `<p style="margin:10px 0;"><strong style="color:#005EB8; display:inline-block; min-width:120px;">Subject:</strong> ${escapeHtml(lead.subject)}</p>` : ''}
      <p style="margin:10px 0;"><strong style="color:#005EB8; display:inline-block; min-width:120px;">Services:</strong> ${escapeHtml(servicesList)}</p>
    </div>
    <div style="background-color:#eef6ff; border-left:4px solid #005EB8; padding:15px; margin:20px 0; border-radius:4px;">
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>
    </div>
    <p style="margin-top:30px; font-size:14px; color:#888888;">
      Please follow up with this lead as soon as possible.
    </p>
  </div>
</body>
</html>
  `.trim()

  const subjectRef = lead.referenceNumber ? ` | Ref: ${lead.referenceNumber}` : ''

  await sendEmail({
    to: recipientEmail,
    subject: `New Lead: ${lead.name}${lead.company ? ` from ${lead.company}` : ''}${subjectRef}`,
    html,
    replyTo: lead.email,
  })
}

