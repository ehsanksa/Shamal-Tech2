/**
 * Sales team WhatsApp alerts via Meta WhatsApp Cloud API (no n8n).
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
 */

export type SalesWhatsAppAlert = {
  quotationNumber?: string
  name: string
  company: string
  phone: string
  email: string
  productsSummary: string
  projectRequirement: string
  industry?: string
  projectLocation?: string
  budgetRange?: string
  clickupTaskUrl?: string
}

function getWhatsAppConfig(): {
  accessToken: string
  phoneNumberId: string
  salesTo: string
} | null {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim()
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()
  const salesTo =
    process.env.SALES_TEAM_WHATSAPP_NUMBER?.trim().replace(/\D/g, '') ||
    process.env.MAINTENANCE_WHATSAPP_NUMBER?.trim().replace(/\D/g, '') ||
    process.env.CONTACT_PHONE?.trim().replace(/\D/g, '') ||
    ''

  if (!accessToken || !phoneNumberId || !salesTo) {
    return null
  }
  return { accessToken, phoneNumberId, salesTo }
}

function buildAlertText(alert: SalesWhatsAppAlert): string {
  const lines = [
    '🛒 New Product Quote RFQ',
    '',
  ]
  if (alert.quotationNumber) lines.push(`Quotation: ${alert.quotationNumber}`, '')
  lines.push(
    `Company: ${alert.company}`,
    `Contact: ${alert.name}`,
    `Phone: ${alert.phone}`,
    `Email: ${alert.email}`,
  )
  if (alert.industry) lines.push(`Industry: ${alert.industry}`)
  if (alert.projectLocation) lines.push(`Location: ${alert.projectLocation}`)
  if (alert.budgetRange) lines.push(`Budget: ${alert.budgetRange}`)
  lines.push('', 'Products:', alert.productsSummary)
  lines.push('', 'Requirements:', alert.projectRequirement)
  if (alert.clickupTaskUrl) lines.push('', `ClickUp: ${alert.clickupTaskUrl}`)
  return lines.join('\n')
}

/**
 * Send a text message to the sales team WhatsApp number.
 * Returns true on success; false if skipped or failed (never throws).
 */
export async function sendSalesTeamWhatsAppAlert(alert: SalesWhatsAppAlert): Promise<boolean> {
  const config = getWhatsAppConfig()
  if (!config) {
    console.warn(
      '[WhatsApp] Skipped — set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and SALES_TEAM_WHATSAPP_NUMBER',
    )
    return false
  }

  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || 'v21.0'
  const url = `https://graph.facebook.com/${apiVersion}/${config.phoneNumberId}/messages`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: config.salesTo,
        type: 'text',
        text: { preview_url: true, body: buildAlertText(alert) },
      }),
    })

    if (!res.ok) {
      console.error('[WhatsApp] API error:', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (err) {
    console.error('[WhatsApp] Send failed:', err)
    return false
  }
}
