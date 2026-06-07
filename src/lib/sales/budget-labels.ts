export const BUDGET_RANGE_LABELS: Record<string, string> = {
  'under-100k': 'Under SAR 100k',
  '100k-500k': 'SAR 100k – 500k',
  '500k-1m': 'SAR 500k – 1M',
  '1m-plus': 'SAR 1M+',
  unsure: 'Not sure yet',
}

export function formatBudgetRange(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined
  return BUDGET_RANGE_LABELS[value] || value
}
