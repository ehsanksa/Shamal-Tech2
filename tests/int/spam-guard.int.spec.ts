import { describe, expect, it } from 'vitest'

import {
  evaluatePublicFormSubmission,
  MIN_FORM_FILL_MS,
} from '@/lib/forms/form-protection'
import {
  isPlausibleNameToken,
  isValidPublicEmail,
  looksLikeGibberishName,
} from '@/lib/forms/spam-guard'

describe('looksLikeGibberishName', () => {
  it('flags the contact-form bot names from the spam wave', () => {
    expect(looksLikeGibberishName('tXQZnPloyeDoAhUXHIZxKMDz')).toBe(true)
    expect(looksLikeGibberishName('nyEDiNS')).toBe(true)
    expect(looksLikeGibberishName('gmYXVD')).toBe(true)
    expect(looksLikeGibberishName('ZbOBFV')).toBe(true)
  })

  it('allows real people names', () => {
    expect(looksLikeGibberishName('Ahmed Ali')).toBe(false)
    expect(looksLikeGibberishName('Fatima Al-Saud')).toBe(false)
    expect(looksLikeGibberishName('Jean-Pierre')).toBe(false)
    expect(looksLikeGibberishName('McDonald')).toBe(false)
    expect(looksLikeGibberishName('mohammed')).toBe(false)
    expect(looksLikeGibberishName('José García')).toBe(false)
    expect(looksLikeGibberishName('محمد عبدالله')).toBe(false)
  })
})

describe('isPlausibleNameToken', () => {
  it('accepts title case and Mc names', () => {
    expect(isPlausibleNameToken('Ahmed')).toBe(true)
    expect(isPlausibleNameToken('McGregor')).toBe(true)
  })
})

describe('isValidPublicEmail', () => {
  it('accepts normal addresses and rejects junk', () => {
    expect(isValidPublicEmail('g.ap.e.rs1@gmail.com')).toBe(true)
    expect(isValidPublicEmail('not-an-email')).toBe(false)
    expect(isValidPublicEmail('a@b.c')).toBe(false)
  })
})

describe('evaluatePublicFormSubmission', () => {
  const started = Date.now() - MIN_FORM_FILL_MS - 50

  it('allows a normal filled-out form', () => {
    expect(
      evaluatePublicFormSubmission({
        website: '',
        formStartedAt: started,
        name: 'Ahmed Ali',
        email: 'ahmed@example.com',
        message: 'We need a drone survey for a construction site in NEOM.',
      }),
    ).toEqual({ action: 'allow' })
  })

  it('drops honeypot fills', () => {
    const result = evaluatePublicFormSubmission({
      website: 'https://spam.example',
      formStartedAt: started,
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      message: 'Hello',
    })
    expect(result.action).toBe('drop')
    if (result.action === 'drop') expect(result.reasons).toContain('honeypot')
  })

  it('drops API posts that omit the JS timestamp (current bot scripts)', () => {
    const result = evaluatePublicFormSubmission({
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      message: 'Hello',
    })
    expect(result.action).toBe('drop')
    if (result.action === 'drop') expect(result.reasons).toContain('missing-timestamp')
  })

  it('drops instant submissions', () => {
    const result = evaluatePublicFormSubmission({
      website: '',
      formStartedAt: Date.now(),
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      message: 'Hello',
    })
    expect(result.action).toBe('drop')
    if (result.action === 'drop') expect(result.reasons).toContain('too-fast')
  })

  it('drops gibberish names even with a valid timestamp', () => {
    const result = evaluatePublicFormSubmission({
      website: '',
      formStartedAt: started,
      name: 'tXQZnPloyeDoAhUXHIZxKMDz',
      email: 'g.ap.e.rs1@gmail.com',
      message: 'We have received your inquiry',
    })
    expect(result.action).toBe('drop')
    if (result.action === 'drop') expect(result.reasons).toContain('gibberish-name')
  })
})
