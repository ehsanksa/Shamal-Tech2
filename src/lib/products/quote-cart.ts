export type QuoteLineItem = {
  productId: string
  name: string
  category?: string | null
  quantity: number
}

export const QUOTE_CART_STORAGE_KEY = 'shamal_quote_cart_v1'

export function parseQuoteCartFromStorage(raw: string | null): QuoteLineItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is QuoteLineItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as QuoteLineItem).productId === 'string' &&
        typeof (item as QuoteLineItem).name === 'string' &&
        typeof (item as QuoteLineItem).quantity === 'number' &&
        (item as QuoteLineItem).quantity > 0,
    )
  } catch {
    return []
  }
}

export function formatQuoteLinesForMessage(lines: QuoteLineItem[]): string {
  return lines.map((l) => `• ${l.name} × ${l.quantity}${l.category ? ` (${l.category})` : ''}`).join('\n')
}
