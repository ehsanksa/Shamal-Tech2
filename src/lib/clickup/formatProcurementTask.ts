import {
  itemCategoryLabel,
  priorityLabel,
  type ProcurementPriority,
} from '../procurement/constants'

export type ProcurementClickUpFields = {
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

function line(label: string, value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null
  return `${label}: ${value}`
}

export function clickUpTaskTitleForProcurement(doc: ProcurementClickUpFields): string {
  const priority = priorityLabel(doc.priority).toUpperCase() || 'MEDIUM'
  const item = doc.itemName?.trim() || 'Item'
  const company = doc.companyName?.trim() || 'Unknown Company'
  return `[${priority}] - ${item} - ${company}`
}

export function formatProcurementClickUpDescription(doc: ProcurementClickUpFields): string {
  const category =
    doc.itemCategory === 'other' && doc.itemCategoryOther?.trim()
      ? `Other (${doc.itemCategoryOther.trim()})`
      : itemCategoryLabel(doc.itemCategory)

  const estimatedCost =
    doc.estimatedTotalCost != null
      ? String(doc.estimatedTotalCost)
      : doc.estimatedUnitCost != null
        ? String(doc.estimatedUnitCost)
        : undefined

  const lines = [
    line('Request ID', doc.requestId),
    line('Requester Name', doc.requesterName),
    line('Email', doc.email),
    line('Phone', doc.phoneNumber),
    line('Company', doc.companyName),
    line('Department', doc.department),
    line('Project', doc.project),
    line('Item Category', category),
    line('Priority', priorityLabel(doc.priority as ProcurementPriority)),
    line('Item / Service Name', doc.itemName),
    line('Quantity', doc.quantity),
    line('Estimated Cost', estimatedCost),
    line('Estimated Unit Cost', doc.estimatedUnitCost),
    line('Preferred Vendor', doc.preferredVendor),
    line('Required By Date', doc.requiredByDate),
    line('Product URL', doc.productUrl),
    line('Detailed Description', doc.detailedDescription),
    line('Business Justification', doc.businessJustification),
    line('Submission Date', doc.submittedAt),
  ].filter(Boolean)

  return lines.join('\n')
}

/** ClickUp native priority: 1 urgent, 2 high, 3 normal, 4 low */
export function clickUpPriorityFromProcurement(
  priority?: string | null,
): 1 | 2 | 3 | 4 {
  switch (priority) {
    case 'urgent':
      return 1
    case 'high':
      return 2
    case 'low':
      return 4
    default:
      return 3
  }
}
