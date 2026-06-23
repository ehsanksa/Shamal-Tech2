import { formatBudgetRange } from '@/lib/sales/budget-labels'
import { formatQuoteLinesForMessage, type QuoteLineItem } from '@/lib/products/quote-cart'

export type ClickUpLeadFields = {
  name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  industry?: string | null
  projectLocation?: string | null
  budgetRange?: string | null
  quotationNumber?: string | null
  ticketNumber?: string | null
  source?: string | null
}

function line(label: string, value: string | null | undefined): string {
  return `${label}: ${value?.trim() || '—'}`
}

/** Plain-text ClickUp description for product quote RFQs (no markdown, no duplicate sections). */
export function formatQuoteClickUpDescription(
  lead: ClickUpLeadFields,
  quoteLines: QuoteLineItem[],
): string {
  const parts = [
    line('Quotation', lead.quotationNumber),
    '',
    line('Name', lead.name),
    line('Email', lead.email),
    line('Phone', lead.phone),
    line('Company', lead.company),
  ]

  if (lead.industry) parts.push(line('Industry', lead.industry))
  if (lead.projectLocation) parts.push(line('Project location', lead.projectLocation))
  const budget = formatBudgetRange(lead.budgetRange)
  if (budget) parts.push(line('Budget range', budget))

  if (quoteLines.length > 0) {
    parts.push('', 'Products:', formatQuoteLinesForMessage(quoteLines))
  }

  parts.push('', 'Project requirements:', lead.message?.trim() || '—')
  return parts.join('\n')
}

/** Plain-text ClickUp description for contact / service leads. */
export function formatContactClickUpDescription(
  lead: ClickUpLeadFields,
  serviceLabel: string | null,
): string {
  const parts = [
    line('Ticket', lead.ticketNumber),
    line('Name', lead.name),
    line('Email', lead.email),
    line('Phone', lead.phone),
    line('Company', lead.company),
  ]
  if (serviceLabel) parts.push(line('Services', serviceLabel))
  parts.push('', 'Message:', lead.message?.trim() || '—')
  return parts.join('\n')
}

export function isProductQuoteLead(lead: ClickUpLeadFields, quoteLineCount: number): boolean {
  return (
    Boolean(lead.quotationNumber) ||
    lead.source === 'product-quote-cart' ||
    quoteLineCount > 0
  )
}

export function clickUpTaskTitleForQuote(quotationNumber: string): string {
  return quotationNumber
}

export function clickUpTaskTitleForContact(
  company: string,
  name: string,
  interestLabel: string,
): string {
  return `${company} – ${name} – ${interestLabel}`
}
