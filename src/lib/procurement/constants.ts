export const PERMANENT_INTERNAL_DOMAIN = 'shamal.sa'

export const PROCUREMENT_FORM_CLOSED_MESSAGE =
  'Procurement request submissions are currently unavailable. Please contact the Procurement Department.'

export const PROCUREMENT_FORM_CLOSED_MESSAGE_AR =
  'طلبات المشتريات غير متاحة حالياً. يرجى التواصل مع قسم المشتريات.'

export const PROCUREMENT_DOMAIN_UNAUTHORIZED_MESSAGE =
  'Your email domain is not authorized to submit procurement requests. Please contact the Procurement Administrator.'

export const PROCUREMENT_DOMAIN_UNAUTHORIZED_MESSAGE_AR =
  'نطاق بريدك الإلكتروني غير مصرح له بتقديم طلبات المشتريات. يرجى التواصل مع مسؤول المشتريات.'

export const DOMAIN_EXPIRY_NOTICE_DAYS = [30, 7, 0] as const

export const DEFAULT_PROCUREMENT_ASSIGNEE_NAME = 'Mohammed Arif'
export const DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL = 'm.aljahdali@shamal.sa'
export const DEFAULT_PROCUREMENT_SENDER_EMAIL = 'hello@shamal.sa'
export const DEFAULT_PROCUREMENT_RECIPIENT_EMAIL = 'm.aljahdali@shamal.sa'
export const DEFAULT_MAX_ATTACHMENT_SIZE_MB = 5

export const PROCUREMENT_ITEM_CATEGORIES = [
  { label: 'Stationery', value: 'stationery' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Software / License', value: 'software_license' },
  { label: 'Office Furniture', value: 'office_furniture' },
  { label: 'Safety Equipment', value: 'safety_equipment' },
  { label: 'Drone Equipment', value: 'drone_equipment' },
  { label: 'Survey Equipment', value: 'survey_equipment' },
  { label: 'Vehicle Related', value: 'vehicle_related' },
  { label: 'Services', value: 'services' },
  { label: 'Other', value: 'other' },
] as const

export type ProcurementItemCategory = (typeof PROCUREMENT_ITEM_CATEGORIES)[number]['value']

export const PROCUREMENT_PRIORITIES = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const

export type ProcurementPriority = (typeof PROCUREMENT_PRIORITIES)[number]['value']

export const PROCUREMENT_PRIORITY_COLORS: Record<
  ProcurementPriority,
  { bg: string; text: string; border: string; label: string }
> = {
  low: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', label: 'Low' },
  medium: { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd', label: 'Medium' },
  high: { bg: '#ffedd5', text: '#c2410c', border: '#fdba74', label: 'High' },
  urgent: { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5', label: 'Urgent' },
}

export const PROCUREMENT_ALLOWED_ATTACHMENT_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
] as const

export const PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.jpg',
  '.jpeg',
  '.png',
] as const

export function itemCategoryLabel(value?: string | null): string {
  const match = PROCUREMENT_ITEM_CATEGORIES.find((c) => c.value === value)
  return match?.label || value || ''
}

export function priorityLabel(value?: string | null): string {
  const match = PROCUREMENT_PRIORITIES.find((p) => p.value === value)
  return match?.label || value || ''
}
