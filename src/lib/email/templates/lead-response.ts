/**
 * Contact form auto-reply — preserves existing layout; opening copy updated per ticket requirements.
 */

import {
  escapeHtml,
  renderReferenceHighlightBox,
  renderShamalFormEmailLayout,
} from './shamal-form-email-layout'

export interface LeadResponseEmailData {
  leadName: string
  leadEmail: string
  ticketNumber: string
  inquirySubject?: string
  siteName?: string
  siteUrl?: string
  contactEmail?: string
  contactPhone?: string
  logoUrl?: string
}

export function contactAutoReplySubject(ticketNumber: string): string {
  return `Thank You for Contacting Shamal Technologies | Ref: ${ticketNumber}`
}

export function generateLeadResponseEmail(data: LeadResponseEmailData): string {
  const {
    leadName,
    ticketNumber,
    inquirySubject,
    siteName = 'Shamal Technologies',
    siteUrl,
    contactEmail,
    contactPhone,
    logoUrl,
  } = data

  const safeName = escapeHtml(leadName)
  const safeSiteName = escapeHtml(siteName)
  const inquiryTopic = inquirySubject?.trim()
    ? escapeHtml(inquirySubject.trim())
    : 'your inquiry'
  const safeTicket = escapeHtml(ticketNumber)

  const bodyHtml = `
              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Dear <strong>${safeName}</strong>,
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Thank you for reaching out to <strong>${safeSiteName}</strong>. We have successfully received your inquiry.
              </p>

              ${renderReferenceHighlightBox('Your Ticket Number', ticketNumber)}

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Your ticket number is <strong>${safeTicket}</strong> regarding <strong>${inquiryTopic}</strong>.
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 22px 0;">
                Our team will review your message and get back to you as soon as possible. We usually respond within
                <strong>24 hours</strong> during working days.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef6ff; border-left:5px solid #005EB8; border-radius:8px; margin:25px 0;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="margin:0 0 12px 0; color:#005EB8; font-size:17px;">
                      What happens next?
                    </h3>

                    <p style="margin:0 0 8px 0; font-size:15px; line-height:1.6;">
                      ✔ Our team will review your requirements and operational context.
                    </p>

                    <p style="margin:0 0 8px 0; font-size:15px; line-height:1.6;">
                      ✔ The relevant department will evaluate the best drone, geospatial, or AI solution for you.
                    </p>

                    <p style="margin:0; font-size:15px; line-height:1.6;">
                      ✔ We will follow up by email or phone with next steps.
                    </p>
                  </td>
                </tr>
              </table>

              <h3 style="margin:28px 0 14px 0; color:#003B73; font-size:18px;">
                Explore Shamal Technologies
              </h3>

              <p style="font-size:15px; line-height:1.7; margin:0 0 18px 0;">
                While you wait, discover our drone surveying, GIS mapping, industrial inspection,
                environmental monitoring, and AI-powered geospatial solutions for government and enterprise sectors across Saudi Arabia.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:18px 0 28px 0;">
                <tr>
                  <td align="center" style="padding:8px;">
                    <a href="${escapeHtml((siteUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'https://shamal.sa').replace(/\/$/, ''))}/services" style="display:inline-block; background-color:#005EB8; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:6px; font-size:14px; font-weight:bold;">
                      View Our Services
                    </a>
                  </td>
                  <td align="center" style="padding:8px;">
                    <a href="${escapeHtml((siteUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'https://shamal.sa').replace(/\/$/, ''))}" style="display:inline-block; background-color:#003B73; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:6px; font-size:14px; font-weight:bold;">
                      Visit Website
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc; border-radius:8px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="margin:0 0 12px 0; color:#003B73; font-size:17px;">
                      Need immediate assistance?
                    </h3>

                    <p style="margin:0 0 10px 0; font-size:15px; line-height:1.6;">
                      For urgent operational questions or time-sensitive field support, reply directly to this email or call us.
                    </p>
                  </td>
                </tr>
              </table>`

  return renderShamalFormEmailLayout({
    pageTitle: `Thank You for Contacting ${siteName}`,
    headerTitle: 'Thank You for Contacting Us',
    headerSubtitle: 'Your message has safely reached Shamal Technologies.',
    accentMessage: 'Mission received — our team is already reviewing your request',
    bodyHtml,
    signOffHtml: `<p style="font-size:16px; line-height:1.7; margin:22px 0 0 0;">
                Best regards,<br />
                <strong>${safeSiteName} Team</strong>
              </p>`,
    siteName,
    siteUrl,
    contactEmail,
    contactPhone,
    logoUrl,
  })
}
