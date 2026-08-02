/**
 * Optional ClickUp custom-field mapping for procurement tasks.
 * Fields that do not exist on the list are skipped (never throws).
 */

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

const DEFAULT_FIELD_NAMES = {
  priority: process.env.CLICKUP_PROCUREMENT_FIELD_PRIORITY || 'Priority',
  department: process.env.CLICKUP_PROCUREMENT_FIELD_DEPARTMENT || 'Department',
  project: process.env.CLICKUP_PROCUREMENT_FIELD_PROJECT || 'Project',
  company: process.env.CLICKUP_PROCUREMENT_FIELD_COMPANY || 'Company',
  estimatedCost: process.env.CLICKUP_PROCUREMENT_FIELD_ESTIMATED_COST || 'Estimated Cost',
  vendor: process.env.CLICKUP_PROCUREMENT_FIELD_VENDOR || 'Vendor',
  requiredDate: process.env.CLICKUP_PROCUREMENT_FIELD_REQUIRED_DATE || 'Required Date',
}

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

function formatValue(meta: CfMeta, value: unknown): unknown {
  if (value === undefined || value === null || value === '') return undefined
  const t = meta.type
  if (t === 'number' || t === 'currency') {
    return typeof value === 'number' ? value : Number(value)
  }
  if (t === 'drop_down' || t === 'labels') {
    const raw = String(value).trim()
    const options = meta.type_config?.options ?? []
    const match = options.find((o) => String(o.name ?? '').trim().toLowerCase() === raw.toLowerCase())
    if (match?.id) return t === 'labels' ? [match.id] : match.id
    return raw
  }
  if (t === 'date') {
    if (typeof value === 'string') {
      const ms = Date.parse(value)
      return Number.isNaN(ms) ? undefined : ms
    }
    return value
  }
  return String(value)
}

export async function buildProcurementCustomFields(
  listId: string,
  values: {
    priority?: string | null
    department?: string | null
    project?: string | null
    company?: string | null
    estimatedCost?: number | null
    vendor?: string | null
    requiredDate?: string | null
  },
): Promise<Array<{ id: string; value: unknown }>> {
  const token = process.env.CLICKUP_API_TOKEN?.trim()
  if (!token || !listId) return []

  try {
    const metaByName = await getFieldMetaByName(listId, token)
    const entries: Array<[string, unknown]> = [
      [DEFAULT_FIELD_NAMES.priority, values.priority],
      [DEFAULT_FIELD_NAMES.department, values.department],
      [DEFAULT_FIELD_NAMES.project, values.project],
      [DEFAULT_FIELD_NAMES.company, values.company],
      [DEFAULT_FIELD_NAMES.estimatedCost, values.estimatedCost],
      [DEFAULT_FIELD_NAMES.vendor, values.vendor],
      [DEFAULT_FIELD_NAMES.requiredDate, values.requiredDate],
    ]

    const out: Array<{ id: string; value: unknown }> = []
    for (const [name, raw] of entries) {
      if (raw === undefined || raw === null || raw === '') continue
      const meta = metaByName.get(name)
      if (!meta) continue
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
