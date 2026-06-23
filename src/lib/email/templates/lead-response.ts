/**
 * Lead Response Email Template
 * Branded HTML thank-you email for contact form submissions.
 */

import { SHAMAL_LOGO_PRIMARY } from '@/lib/company-profile/assets'

export interface LeadResponseEmailData {
  leadName: string
  leadEmail: string
  inquirySubject?: string
  siteName?: string
  siteUrl?: string
  contactEmail?: string
  contactPhone?: string
  logoUrl?: string
}

export const CONTACT_CUSTOMER_AUTO_REPLY_SUBJECT = "Liftoff! We've received your message 🚀"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('966') && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  return phone
}

export function generateLeadResponseEmail(data: LeadResponseEmailData): string {
  const {
    leadName,
    inquirySubject,
    siteName = 'Shamal Technologies',
    siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://shamal.sa',
    contactEmail = process.env.CONTACT_EMAIL || 'hello@shamal.sa',
    contactPhone = process.env.CONTACT_PHONE || '+966530301370',
    logoUrl,
  } = data

  const safeName = escapeHtml(leadName)
  const safeSiteName = escapeHtml(siteName)
  const safeSiteUrl = escapeHtml(siteUrl.replace(/\/$/, ''))
  const safeContactEmail = escapeHtml(contactEmail)
  const safeContactPhone = escapeHtml(formatPhoneDisplay(contactPhone))
  const telHref = contactPhone.replace(/\s/g, '')
  const inquiryTopic = inquirySubject?.trim()
    ? escapeHtml(inquirySubject.trim())
    : 'your inquiry'
  const resolvedLogoUrl = escapeHtml(
    logoUrl || `${siteUrl.replace(/\/$/, '')}${SHAMAL_LOGO_PRIMARY}`,
  )

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Contacting ${safeSiteName}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f7fb; padding:30px 0;">
    <tr>
      <td align="center">

        <table width="650" cellpadding="0" cellspacing="0" role="presentation" style="max-width:650px; width:100%; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <!-- Header: primary logo on light background -->
          <tr>
            <td style="background-color:#ffffff; padding:32px 35px 24px 35px; text-align:center; border-bottom:4px solid #005EB8;">
              <img
                src="${resolvedLogoUrl}"
                alt="${safeSiteName} Logo"
                width="190"
                style="max-width:190px; width:190px; height:auto; display:block; margin:0 auto 20px auto; border:0;"
              />

              <h1 style="margin:0; color:#003B73; font-size:26px; font-weight:700; line-height:1.3;">
                Thank You for Contacting Us
              </h1>

              <p style="margin:10px 0 0 0; color:#4b5563; font-size:15px; line-height:1.6;">
                Your message has safely reached ${safeSiteName}.
              </p>
            </td>
          </tr>

          <!-- Accent band -->
          <tr>
            <td style="background:linear-gradient(135deg,#003B73,#005EB8); padding:14px 35px; text-align:center;">
              <p style="margin:0; color:#ffffff; font-size:14px; font-weight:600; letter-spacing:0.3px;">
                Mission received — our team is already reviewing your request
              </p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:35px;">

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Hi <strong>${safeName}</strong>,
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Landed safely! We have successfully received your message at
                <strong>${safeSiteName}</strong>. Our engineering team is already reviewing your inquiry regarding
                <strong>${inquiryTopic}</strong>.
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 22px 0;">
                We typically respond within <strong>24 hours</strong> during business days.
                A specialist will contact you using the details you provided.
              </p>

              <!-- What happens next -->
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

              <!-- Explore -->
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
                    <a href="${safeSiteUrl}/services" style="display:inline-block; background-color:#005EB8; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:6px; font-size:14px; font-weight:bold;">
                      View Our Services
                    </a>
                  </td>
                  <td align="center" style="padding:8px;">
                    <a href="${safeSiteUrl}" style="display:inline-block; background-color:#003B73; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:6px; font-size:14px; font-weight:bold;">
                      Visit Website
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Urgent contact -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc; border-radius:8px;">
                <tr>
                  <td style="padding:20px;">
                    <h3 style="margin:0 0 12px 0; color:#003B73; font-size:17px;">
                      Need immediate assistance?
                    </h3>

                    <p style="margin:0 0 10px 0; font-size:15px; line-height:1.6;">
                      For urgent operational questions or time-sensitive field support, reply directly to this email or call us:
                    </p>

                    <p style="margin:0 0 8px 0; font-size:15px;">
                      <strong>Email:</strong>
                      <a href="mailto:${safeContactEmail}" style="color:#005EB8; text-decoration:none;">${safeContactEmail}</a>
                    </p>

                    <p style="margin:0; font-size:15px;">
                      <strong>Phone:</strong>
                      <a href="tel:${telHref}" style="color:#005EB8; text-decoration:none;">${safeContactPhone}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-size:16px; line-height:1.7; margin:28px 0 0 0;">
                Fly safe,
              </p>

              <p style="font-size:16px; line-height:1.7; margin:8px 0 0 0;">
                <strong>${safeSiteName} Support Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0f172a; padding:24px 35px; text-align:center;">
              <p style="margin:0 0 8px 0; color:#ffffff; font-size:14px; font-weight:bold;">
                ${safeSiteName}
              </p>

              <p style="margin:0 0 12px 0; color:#cbd5e1; font-size:13px; line-height:1.6;">
                Advanced Drone, Geospatial, GIS, Inspection &amp; AI Solutions
              </p>

              <p style="margin:0; color:#94a3b8; font-size:12px;">
                <a href="${safeSiteUrl}" style="color:#93c5fd; text-decoration:none;">${safeSiteUrl.replace(/^https?:\/\//, '')}</a>
                &nbsp;|&nbsp;
                <a href="tel:${telHref}" style="color:#93c5fd; text-decoration:none;">${safeContactPhone}</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`.trim()
}
