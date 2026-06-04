/**
 * Shared logic: build ClickUp task from a lead and create it.
 * Used by the afterChange hook (website leads) and by the manual "Push to ClickUp" endpoint.
 * Returns task id + url on success, null on failure. Never throws.
 */

import type { Payload } from 'payload'
import { createClickUpTask } from './createTask'
import { formatQuoteLinesForMessage, type QuoteLineItem } from '../products/quote-cart'

/** Lead-like doc with optional populated services / quote products */
type LeadDoc = {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  industry?: string | null
  projectLocation?: string | null
  budgetRange?: string | null
  services?: Array<string | { title?: string }> | null
  quoteProducts?: Array<{
    productName?: string | null
    quantity?: number | null
    category?: string | null
  }> | null
}

export async function pushLeadToClickUp(
  payload: Payload,
  lead: LeadDoc,
): Promise<{ id: string; url: string } | null> {
  const serviceNames: string[] = []
  if (lead.services && Array.isArray(lead.services) && lead.services.length > 0) {
    for (const s of lead.services) {
      if (typeof s === 'object' && s !== null && 'title' in s) {
        serviceNames.push((s as { title: string }).title)
      } else if (typeof s === 'string') {
        try {
          const service = await payload.findByID({
            collection: 'services',
            id: s,
            depth: 0,
          })
          serviceNames.push(service.title)
        } catch {
          serviceNames.push('Unknown')
        }
      }
    }
  }

  const quoteLines: QuoteLineItem[] =
    lead.quoteProducts?.map((q) => ({
      productId: '',
      name: q.productName || 'Product',
      quantity: q.quantity || 1,
      category: q.category,
    })) || []

  const productLabel =
    quoteLines.length > 0
      ? quoteLines.map((l) => `${l.name}×${l.quantity}`).join(', ')
      : null

  const serviceLabel = serviceNames.length > 0 ? serviceNames.join(', ') : null
  const interestLabel = productLabel || serviceLabel || 'General'

  const company = lead.company?.trim() || '—'
  const name = lead.name?.trim() || 'Unknown'
  const taskName = `${company} – ${name} – ${interestLabel}`

  const descriptionParts = [
    `**Name:** ${lead.name || '—'}`,
    `**Email:** ${lead.email || '—'}`,
    `**Phone:** ${lead.phone || '—'}`,
    `**Company:** ${lead.company || '—'}`,
  ]

  if (lead.industry) descriptionParts.push(`**Industry:** ${lead.industry}`)
  if (lead.projectLocation) descriptionParts.push(`**Project location:** ${lead.projectLocation}`)
  if (lead.budgetRange) descriptionParts.push(`**Budget range:** ${lead.budgetRange}`)
  if (serviceLabel) descriptionParts.push(`**Services:** ${serviceLabel}`)
  if (quoteLines.length > 0) {
    descriptionParts.push(`**Products (Quote Cart):**\n${formatQuoteLinesForMessage(quoteLines)}`)
  }
  descriptionParts.push(`**Message:**\n${lead.message || '—'}`)

  const description = descriptionParts.join('\n')

  return createClickUpTask({ name: taskName, description })
}
