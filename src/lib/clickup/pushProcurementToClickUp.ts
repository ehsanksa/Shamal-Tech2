/**
 * Push procurement requests to ClickUp list:
 * Smart Procurement Requests — https://app.clickup.com/3846681/v/li/901220061684
 *
 * Requires CLICKUP_PROCUREMENT_LIST_ID (does not fall back to sales CLICKUP_LIST_ID).
 */

import { resolveClickUpUserIdByEmail } from './assignees'
import { createClickUpTask } from './createTask'
import {
  clickUpPriorityFromProcurement,
  clickUpTaskTitleForProcurement,
  formatProcurementClickUpDescription,
  type ProcurementClickUpFields,
} from './formatProcurementTask'
import { buildProcurementCustomFields } from './procurementCustomFields'
import {
  DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL,
  DEFAULT_PROCUREMENT_RECIPIENT_EMAIL,
} from '../procurement/constants'

export type ProcurementFormSettingsLike = {
  defaultAssigneeEmail?: string | null
  procurementRecipientEmail?: string | null
  additionalAssignees?: Array<{ email?: string | null }> | null
}

type ProcurementDoc = ProcurementClickUpFields & {
  clickupTaskId?: string | null
}

/** Dedicated procurement list — never mix with sales/contact list. */
export const DEFAULT_PROCUREMENT_CLICKUP_LIST_ID = '901220061684'

function parseUserId(raw?: string | null): number | null {
  if (!raw?.trim()) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

async function resolveAssigneeIds(settings?: ProcurementFormSettingsLike | null): Promise<number[]> {
  const defaultEmail =
    settings?.defaultAssigneeEmail?.trim() ||
    process.env.CLICKUP_ASSIGNEE_PROCUREMENT_EMAIL?.trim() ||
    DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL

  const fallbackEmail =
    settings?.procurementRecipientEmail?.trim() || DEFAULT_PROCUREMENT_RECIPIENT_EMAIL

  const ids: number[] = []
  const envUserId = parseUserId(process.env.CLICKUP_ASSIGNEE_PROCUREMENT_USER_ID)
  if (envUserId) ids.push(envUserId)

  const emails: string[] = []
  if (defaultEmail) emails.push(defaultEmail.toLowerCase())
  else if (fallbackEmail) emails.push(fallbackEmail.toLowerCase())

  for (const row of settings?.additionalAssignees ?? []) {
    const email = row.email?.trim().toLowerCase()
    if (email && !emails.includes(email)) emails.push(email)
  }

  for (const email of emails) {
    const id = await resolveClickUpUserIdByEmail(email)
    if (id && !ids.includes(id)) ids.push(id)
  }

  if (ids.length === 0 && fallbackEmail) {
    const fallbackId = await resolveClickUpUserIdByEmail(fallbackEmail)
    if (fallbackId) ids.push(fallbackId)
  }

  return ids
}

export async function pushProcurementToClickUp(
  doc: ProcurementDoc,
  options?: { formSettings?: ProcurementFormSettingsLike | null },
): Promise<{ id: string; url: string } | null> {
  const listId =
    process.env.CLICKUP_PROCUREMENT_LIST_ID?.trim() || DEFAULT_PROCUREMENT_CLICKUP_LIST_ID

  if (!listId) {
    console.error('[ClickUp] Missing CLICKUP_PROCUREMENT_LIST_ID for procurement')
    return null
  }

  // Guard against accidental use of the sales/contact list.
  if (process.env.CLICKUP_LIST_ID?.trim() && listId === process.env.CLICKUP_LIST_ID.trim()) {
    console.error(
      '[ClickUp] CLICKUP_PROCUREMENT_LIST_ID must not equal CLICKUP_LIST_ID (sales). Refusing to create task.',
    )
    return null
  }

  const assigneeIds = await resolveAssigneeIds(options?.formSettings)
  if (assigneeIds.length === 0) {
    console.error(
      '[ClickUp] No procurement assignee resolved; task will be created without assignees',
    )
  }

  const name = clickUpTaskTitleForProcurement(doc)
  const description = formatProcurementClickUpDescription(doc)
  const customFields = await buildProcurementCustomFields(listId, doc)

  let dueDateMs: number | undefined
  if (doc.requiredByDate) {
    const ms = Date.parse(doc.requiredByDate)
    if (!Number.isNaN(ms)) dueDateMs = ms
  }

  // This list inherits Finance space statuses: Open / in progress / Closed
  return createClickUpTask({
    name,
    description,
    listId,
    assignees: assigneeIds,
    status: 'Open',
    priority: clickUpPriorityFromProcurement(doc.priority),
    dueDateMs,
    customFields,
  })
}
