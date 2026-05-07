/**
 * Shared logic: build ClickUp task from a lead and create it.
 * Used by the afterChange hook (website leads) and by the manual "Push to ClickUp" endpoint.
 * Returns task id + url on success, null on failure. Never throws.
 */

import type { Payload } from 'payload'
import { createClickUpTask } from './createTask'

/** Lead-like doc with optional populated services */
type LeadDoc = {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  services?: Array<string | { title?: string }> | null
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
  const serviceLabel = serviceNames.length > 0 ? serviceNames.join(', ') : 'General'

  const company = lead.company?.trim() || '—'
  const name = lead.name?.trim() || 'Unknown'
  const taskName = `${company} – ${name} – ${serviceLabel}`

  const description = [
    `**Name:** ${lead.name || '—'}`,
    `**Email:** ${lead.email || '—'}`,
    `**Phone:** ${lead.phone || '—'}`,
    `**Company:** ${lead.company || '—'}`,
    `**Service:** ${serviceLabel}`,
    `**Message:**\n${lead.message || '—'}`,
  ].join('\n')

  return createClickUpTask({ name: taskName, description })
}
