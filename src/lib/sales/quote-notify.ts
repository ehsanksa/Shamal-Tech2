import type { Payload } from 'payload'

import { pushLeadToClickUp } from '@/lib/clickup/pushLeadToClickUp'
import { formatQuoteLinesForMessage, type QuoteLineItem } from '@/lib/products/quote-cart'
import { sendSalesTeamWhatsAppAlert } from '@/lib/sales/whatsapp'

export type QuoteNotifyInput = {
  leadId: string
  quotationNumber: string
  name: string
  email: string
  phone: string
  company: string
  industry?: string
  projectLocation?: string
  budgetRange?: string
  projectRequirement: string
  quoteLines: QuoteLineItem[]
  timestamp: string
}

/** Sync quote RFQ to ClickUp and notify sales on WhatsApp. */
export async function notifyQuoteRfqLead(
  payload: Payload,
  lead: {
    id: string
    name?: string | null
    email?: string | null
    phone?: string | null
    company?: string | null
    message?: string | null
    industry?: string | null
    projectLocation?: string | null
    budgetRange?: string | null
    quotationNumber?: string | null
    source?: string | null
  },
  input: QuoteNotifyInput,
): Promise<{ clickupTaskId?: string; clickupTaskUrl?: string; whatsappSent: boolean }> {
  let clickupTaskId: string | undefined
  let clickupTaskUrl: string | undefined

  const clickUp = await pushLeadToClickUp(payload, {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: input.projectRequirement,
    industry: lead.industry,
    projectLocation: lead.projectLocation,
    budgetRange: lead.budgetRange,
    quotationNumber: input.quotationNumber,
    source: 'product-quote-cart',
    quoteProducts: input.quoteLines.map((l) => ({
      productName: l.name,
      quantity: l.quantity,
      category: l.category,
    })),
  })

  if (clickUp) {
    clickupTaskId = clickUp.id
    clickupTaskUrl = clickUp.url
    try {
      await payload.update({
        collection: 'leads',
        id: lead.id,
        data: {
          pushedToClickUp: true,
          clickupTaskId: clickUp.id,
          clickupTaskUrl: clickUp.url,
        },
        context: { disableRevalidate: true },
        overrideAccess: true,
      })
    } catch (err) {
      console.error('[Quote] Failed to save ClickUp task on lead:', err)
    }
  }

  const productsText = formatQuoteLinesForMessage(input.quoteLines)

  const whatsappSent = await sendSalesTeamWhatsAppAlert({
    quotationNumber: input.quotationNumber,
    name: input.name,
    company: input.company,
    phone: input.phone,
    email: input.email,
    productsSummary: productsText,
    projectRequirement: input.projectRequirement,
    industry: input.industry,
    projectLocation: input.projectLocation,
    budgetRange: input.budgetRange,
    clickupTaskUrl,
  })

  return { clickupTaskId, clickupTaskUrl, whatsappSent }
}
