import { describe, expect, it } from 'vitest'

import { contactAutoReplySubject } from '@/lib/email/templates/lead-response'
import { quotationAutoReplySubject } from '@/lib/email/templates/quotation-auto-reply'
import { trainingInterestAutoReplySubject } from '@/lib/email/templates/training-interest-auto-reply'

describe('form reference email subjects', () => {
  it('formats contact subject with STCF reference', () => {
    expect(contactAutoReplySubject('STCF0001')).toBe(
      'Thank You for Contacting Shamal Technologies | Ref: STCF0001',
    )
  })

  it('formats quotation subject with STQF reference', () => {
    expect(quotationAutoReplySubject('STQF0042')).toBe(
      'Quotation Request Received | Ref: STQF0042',
    )
  })

  it('formats training subject with STT reference', () => {
    expect(trainingInterestAutoReplySubject('STT0007')).toBe(
      'Training Interest Received | Ref: STT0007',
    )
  })
})

describe('reference number format', () => {
  it('uses four-digit padding', () => {
    const format = (prefix: string, seq: number) => `${prefix}${String(seq).padStart(4, '0')}`
    expect(format('STCF', 1)).toBe('STCF0001')
    expect(format('STQF', 12)).toBe('STQF0012')
    expect(format('STT', 123)).toBe('STT0123')
  })
})
