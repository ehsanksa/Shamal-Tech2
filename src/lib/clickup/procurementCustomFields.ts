/**
 * ClickUp custom-field mapping for Smart Procurement Requests list.
 * Fields that do not exist on the list are skipped (never throws).
 */

import { itemCategoryLabel, priorityLabel } from '../procurement/constants'

const API = 'https://api.clickup.com/api/v2'

type CfMeta = {
  id: string
  name: string
  type: string
  type_config?: {
    options?: Array<{ id: string; name: string; orderindex?: number }>
  }
}

const fieldMetaCache = new Map<string, Map<string, CfMeta>>()

/** Canonical field names on list 901220061684 (Smart Procurement Requests). */
export const PROCUREMENT_CLICKUP_FIELDS = {
  requestId: 'Request ID',
  requesterName: 'Requester Name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  department: 'Department',
  project: 'Project',
  itemCategory: 'Item Category',
  priority: 'Priority',
  itemName: 'Item / Service Name',
  detailedDescription: 'Detailed Description',
  productUrl: 'Product URL',
  quantity: 'Quantity',
  vendor: 'Vendor',
  estimatedUnitCost: 'Estimated Unit Cost',
  estimatedCost: 'Estimated Cost',
  requiredDate: 'Required Date',
  businessJustification: 'Business Justification',
  submissionDate: 'Submission Date',
} as const

async function getFieldMetaByName(listId: string, token: string): Promise<Map<string, CfMeta>> {
  const cached = fieldMetaCache.get(listId)
  if (cached) return cached

  const res = await fetch(`${API}/list/${listId}/field`, {
    headers: { Authorization: token },
  })
  if (!res.ok) {
    console.warn('[ClickUp] Failed to load procurement custom fields:', res.status)
    return new Map()
  }

  const data = (await res.json()) as { fields?: CfMeta[] }
  const map = new Map<string, CfMeta>()
  for (const f of data.fields ?? []) {
    map.set(f.name, f)
  }
  fieldMetaCache.set(listId, map)
  return map
}

/** Clear cached field metadata (e.g. after setup script creates new fields). */
export function clearProcurementFieldMetaCache(): void {
  fieldMetaCache.clear()
}

function formatValue(meta: CfMeta, value: unknown): unknown {
  if (value === undefined || value === null || value === '') return undefined
  const t = meta.type
  if (t === 'number' || t === 'currency') {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : undefined
  }
  if (t === 'drop_down' || t === 'labels') {
    const raw = String(value).trim()
    const options = meta.type_config?.options ?? []
    const match = options.find(
      (o) => String(o.name ?? '').trim().toLowerCase() === raw.toLowerCase(),
    )
    if (match?.id) return t === 'labels' ? [match.id] : match.id
    // ClickUp dropdown create sometimes accepts option name/index during create;
    // for set-value we need option id — skip unmatched.
    return undefined
  }
  if (t === 'date') {
    if (typeof value === 'string') {
      const ms = Date.parse(value)
      return Number.isNaN(ms) ? undefined : ms
    }
    if (typeof value === 'number') return value
    return undefined
  }
  if (t === 'email' || t === 'phone' || t === 'url' || t === 'short_text' || t === 'text') {
    return String(value)
  }
  return String(value)
}

export type ProcurementCustomFieldValues = {
  requestId?: string | null
  requesterName?: string | null
  email?: string | null
  phoneNumber?: string | null
  companyName?: string | null
  department?: string | null
  project?: string | null
  itemCategory?: string | null
  itemCategoryOther?: string | null
  priority?: string | null
  itemName?: string | null
  detailedDescription?: string | null
  productUrl?: string | null
  quantity?: number | null
  preferredVendor?: string | null
  estimatedUnitCost?: number | null
  estimatedTotalCost?: number | null
  requiredByDate?: string | null
  businessJustification?: string | null
  submittedAt?: string | null
}

export async function buildProcurementCustomFields(
  listId: string,
  values: ProcurementCustomFieldValues,
): Promise<Array<{ id: string; value: unknown }>> {
  const token = process.env.CLICKUP_API_TOKEN?.trim()
  if (!token || !listId) return []

  try {
    // Always refresh so newly created fields are picked up without restart.
    fieldMetaCache.delete(listId)
    const metaByName = await getFieldMetaByName(listId, token)

    const category =
      values.itemCategory === 'other' && values.itemCategoryOther?.trim()
        ? 'Other'
        : itemCategoryLabel(values.itemCategory)

    const entries: Array<[string, unknown]> = [
      [PROCUREMENT_CLICKUP_FIELDS.requestId, values.requestId],
      [PROCUREMENT_CLICKUP_FIELDS.requesterName, values.requesterName],
      [PROCUREMENT_CLICKUP_FIELDS.email, values.email],
      [PROCUREMENT_CLICKUP_FIELDS.phone, values.phoneNumber],
      [PROCUREMENT_CLICKUP_FIELDS.company, values.companyName],
      [PROCUREMENT_CLICKUP_FIELDS.department, values.department],
      [PROCUREMENT_CLICKUP_FIELDS.project, values.project],
      [PROCUREMENT_CLICKUP_FIELDS.itemCategory, category],
      [PROCUREMENT_CLICKUP_FIELDS.priority, priorityLabel(values.priority)],
      [PROCUREMENT_CLICKUP_FIELDS.itemName, values.itemName],
      [PROCUREMENT_CLICKUP_FIELDS.detailedDescription, values.detailedDescription],
      [PROCUREMENT_CLICKUP_FIELDS.productUrl, values.productUrl],
      [PROCUREMENT_CLICKUP_FIELDS.quantity, values.quantity],
      [PROCUREMENT_CLICKUP_FIELDS.vendor, values.preferredVendor],
      [PROCUREMENT_CLICKUP_FIELDS.estimatedUnitCost, values.estimatedUnitCost],
      [
        PROCUREMENT_CLICKUP_FIELDS.estimatedCost,
        values.estimatedTotalCost ?? values.estimatedUnitCost,
      ],
      [PROCUREMENT_CLICKUP_FIELDS.requiredDate, values.requiredByDate],
      [PROCUREMENT_CLICKUP_FIELDS.businessJustification, values.businessJustification],
      [PROCUREMENT_CLICKUP_FIELDS.submissionDate, values.submittedAt],
    ]

    const out: Array<{ id: string; value: unknown }> = []
    for (const [name, raw] of entries) {
      if (raw === undefined || raw === null || raw === '') continue
      const meta = metaByName.get(name)
      if (!meta) {
        console.warn(`[ClickUp] Procurement custom field missing on list: "${name}"`)
        continue
      }
      const formatted = formatValue(meta, raw)
      if (formatted !== undefined) {
        out.push({ id: meta.id, value: formatted })
      }
    }
    return out
  } catch (error) {
    console.warn('[ClickUp] Procurement custom fields skipped:', error)
    return []
  }
}
