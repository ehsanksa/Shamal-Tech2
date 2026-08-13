import { evaluateSpamContent, type SpamContentInput } from './spam-guard'

/** Bots typically POST in well under a second; humans take longer even with autofill. */
export const MIN_FORM_FILL_MS = 2000
/** Reject replayed timestamps older than a day. */
export const MAX_FORM_FILL_MS = 24 * 60 * 60 * 1000

export type FormProtectionInput = SpamContentInput & {
  /** Honeypot — real users never see/fill this. */
  website?: unknown
  formStartedAt?: unknown
}

export type FormProtectionResult =
  | { action: 'allow' }
  | { action: 'drop'; reasons: string[] }

function parseFormStartedAt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim())
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/**
 * Cheap, no-I/O checks that stop the current contact-form bot scripts:
 * missing JS timestamp, filled honeypot, or gibberish names.
 */
export function evaluatePublicFormSubmission(input: FormProtectionInput): FormProtectionResult {
  const reasons: string[] = []

  if (typeof input.website === 'string' && input.website.trim() !== '') {
    reasons.push('honeypot')
  }

  const started = parseFormStartedAt(input.formStartedAt)
  if (started === null) {
    reasons.push('missing-timestamp')
  } else {
    const elapsed = Date.now() - started
    if (elapsed < MIN_FORM_FILL_MS) reasons.push('too-fast')
    if (elapsed > MAX_FORM_FILL_MS || elapsed < -10_000) reasons.push('invalid-timestamp')
  }

  const content = evaluateSpamContent(input)
  reasons.push(...content.reasons)

  if (reasons.length > 0) return { action: 'drop', reasons }
  return { action: 'allow' }
}

export function isContactAutoReplyEnabled(): boolean {
  const value = process.env.CONTACT_AUTO_REPLY_ENABLED
  if (value === undefined || value === '') return true
  return value !== 'false' && value !== '0'
}
