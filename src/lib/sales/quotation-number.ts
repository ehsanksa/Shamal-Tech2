import type { Payload } from 'payload'

import { allocateFormReferenceNumber } from '@/lib/forms/form-reference-number'

/** Allocate the next quotation reference (STQF0001, STQF0002, …). */
export async function allocateQuotationNumber(payload: Payload): Promise<string> {
  return allocateFormReferenceNumber(payload, 'STQF')
}
