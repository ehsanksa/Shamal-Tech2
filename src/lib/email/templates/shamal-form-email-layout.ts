/**
 * Shared Shamal Technologies HTML email shell for form auto-replies.
 */

import { SHAMAL_LOGO_PRIMARY } from '@/lib/company-profile/assets'

export interface ShamalFormEmailLayoutOptions {
  pageTitle: string
  headerTitle: string
  headerSubtitle?: string
  accentMessage?: string
  bodyHtml: string
  signOffHtml?: string
  siteName?: string
  siteUrl?: string
  contactEmail?: string
  contactPhone?: string
  logoUrl?: string
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('966') && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  return phone
}

export function renderReferenceHighlightBox(label: string, referenceNumber: string): string {
  const safeLabel = escapeHtml(label)
  const safeRef = escapeHtml(referenceNumber)
  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef6ff; border:1px solid #b6d4fe; border-left:5px solid #005EB8; border-radius:8px; margin:22px 0;">
      <tr>
        <td style="padding:18px 20px; text-align:center;">
          <p style="margin:0 0 6px 0; color:#003B73; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.4px;">
            ${safeLabel}
          </p>
          <p style="margin:0; color:#005EB8; font-size:22px; font-weight:700; letter-spacing:0.5px;">
            ${safeRef}
          </p>
        </td>
      </tr>
    </table>
  `.trim()
}

export function renderShamalFormEmailLayout(options: ShamalFormEmailLayoutOptions): string {
  const {
    pageTitle,
    headerTitle,
    headerSubtitle,
    accentMessage,
    bodyHtml,
    signOffHtml,
    siteName = 'Shamal Technologies',
    siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://shamal.sa',
    contactEmail = process.env.CONTACT_EMAIL || 'hello@shamal.sa',
    contactPhone = process.env.CONTACT_PHONE || '+966530301370',
    logoUrl,
  } = options

  const safePageTitle = escapeHtml(pageTitle)
  const safeHeaderTitle = escapeHtml(headerTitle)
  const safeHeaderSubtitle = headerSubtitle ? escapeHtml(headerSubtitle) : ''
  const safeAccent = accentMessage ? escapeHtml(accentMessage) : ''
  const safeSiteName = escapeHtml(siteName)
  const safeSiteUrl = escapeHtml(siteUrl.replace(/\/$/, ''))
  const safeContactEmail = escapeHtml(contactEmail)
  const safeContactPhone = escapeHtml(formatPhoneDisplay(contactPhone))
  const telHref = contactPhone.replace(/\s/g, '')
  const resolvedLogoUrl = escapeHtml(
    logoUrl || `${siteUrl.replace(/\/$/, '')}${SHAMAL_LOGO_PRIMARY}`,
  )

  const accentBand = accentMessage
    ? `
          <tr>
            <td style="background:linear-gradient(135deg,#003B73,#005EB8); padding:14px 35px; text-align:center;">
              <p style="margin:0; color:#ffffff; font-size:14px; font-weight:600; letter-spacing:0.3px;">
                ${safeAccent}
              </p>
            </td>
          </tr>`
    : ''

  const signOff = signOffHtml
    ? signOffHtml
    : `<p style="font-size:16px; line-height:1.7; margin:22px 0 0 0;">
                Best regards,<br />
                <strong>${safeSiteName} Team</strong>
              </p>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safePageTitle}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f7fb; padding:30px 0;">
    <tr>
      <td align="center">

        <table width="650" cellpadding="0" cellspacing="0" role="presentation" style="max-width:650px; width:100%; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <tr>
            <td style="background-color:#ffffff; padding:32px 35px 24px 35px; text-align:center; border-bottom:4px solid #005EB8;">
              <img
                src="${resolvedLogoUrl}"
                alt="${safeSiteName} Logo"
                width="190"
                style="max-width:190px; width:190px; height:auto; display:block; margin:0 auto 20px auto; border:0;"
              />

              <h1 style="margin:0; color:#003B73; font-size:26px; font-weight:700; line-height:1.3;">
                ${safeHeaderTitle}
              </h1>

              ${
                safeHeaderSubtitle
                  ? `<p style="margin:10px 0 0 0; color:#4b5563; font-size:15px; line-height:1.6;">${safeHeaderSubtitle}</p>`
                  : ''
              }
            </td>
          </tr>
          ${accentBand}

          <tr>
            <td style="padding:35px;">
              ${bodyHtml}
              ${signOff}
            </td>
          </tr>

          <tr>
            <td style="background-color:#0f172a; padding:24px 35px; text-align:center;">
              <p style="margin:0 0 8px 0; color:#ffffff; font-size:14px; font-weight:bold;">
                ${safeSiteName}
              </p>

              <p style="margin:0 0 12px 0; color:#cbd5e1; font-size:13px; line-height:1.6;">
                Website: <a href="${safeSiteUrl}" style="color:#93c5fd; text-decoration:none;">${safeSiteUrl}</a><br />
                Email: <a href="mailto:${safeContactEmail}" style="color:#93c5fd; text-decoration:none;">${safeContactEmail}</a><br />
                Phone: <a href="tel:${telHref}" style="color:#93c5fd; text-decoration:none;">${safeContactPhone}</a>
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
