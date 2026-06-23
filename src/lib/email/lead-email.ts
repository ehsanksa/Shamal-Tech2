/**
 * Lead email functions
 * Handles sending emails related to leads
 * Uses Payload CMS email plugin (@payloadcms/email-nodemailer)
 */

import { sendEmail } from './index'
import { generateLeadResponseEmail, type LeadResponseEmailData } from './templates/lead-response'

/**
 * Send automated response email to a lead
 */
export async function sendLeadResponseEmail(data: LeadResponseEmailData): Promise<void> {
  const html = generateLeadResponseEmail(data)
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'hello@shamal.sa'

  await sendEmail({
    to: data.leadEmail,
    subject: 'Thank You for Contacting Shamal Technologies',
    html,
    from: fromEmail,
    replyTo: fromEmail,
  })
}

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
  services?: Array<{ title?: string; slug?: string }>
}): Promise<void> {
  const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER

  if (!contactEmail) {
    throw new Error('CONTACT_EMAIL or SMTP_FROM must be set to send lead notifications')
  }

  const servicesList = lead.services && lead.services.length > 0
    ? lead.services.map((s) => s.title || s.slug || 'Unknown').join(', ')
    : 'None selected'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Received</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #0066cc;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 10px;
    }
    .lead-info {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .lead-info p {
      margin: 10px 0;
    }
    .lead-info strong {
      color: #0066cc;
      display: inline-block;
      min-width: 120px;
    }
    .message-box {
      background-color: #f0f7ff;
      border-left: 4px solid #0066cc;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>New Lead Received</h2>
    
    <div class="lead-info">
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
      ${lead.phone ? `<p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>` : ''}
      ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
      ${lead.subject ? `<p><strong>Subject:</strong> ${lead.subject}</p>` : ''}
      <p><strong>Services:</strong> ${servicesList}</p>
    </div>
    
    <div class="message-box">
      <p><strong>Message:</strong></p>
      <p>${lead.message.replace(/\n/g, '<br>')}</p>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #888888;">
      Please follow up with this lead as soon as possible.
    </p>
  </div>
</body>
</html>
  `.trim()

  await sendEmail({
    to: contactEmail,
    subject: `New Lead: ${lead.name}${lead.company ? ` from ${lead.company}` : ''}`,
    html,
    replyTo: lead.email,
  })
}

