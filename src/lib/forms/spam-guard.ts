/**
 * Heuristics for public form spam (contact-form bots, random names, junk messages).
 * Tuned against submissions like "tXQZnPloyeDoAhUXHIZxKMDz" / "nyEDiNS".
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function isValidPublicEmail(email: string): boolean {
  const trimmed = email.trim()
  if (trimmed.length < 5 || trimmed.length > 254) return false
  if (!EMAIL_RE.test(trimmed)) return false
  if (trimmed.includes('..') || /\s/.test(trimmed)) return false
  return true
}

function countCaseTransitions(value: string): number {
  let count = 0
  for (let i = 1; i < value.length; i++) {
    const prev = value[i - 1]
    const next = value[i]
    if (/[a-z]/.test(prev) && /[A-Z]/.test(next)) count++
    else if (/[A-Z]/.test(prev) && /[a-z]/.test(next)) count++
  }
  return count
}

function isMostlyNonLatin(name: string): boolean {
  const letters = [...name].filter((char) => /\p{L}/u.test(char))
  if (letters.length === 0) return false
  const latin = letters.filter((char) => /[A-Za-z]/.test(char)).length
  return latin / letters.length < 0.5
}

/** Plausible given/family token: Title Case, lowercase, short ALL CAPS, Mc/Mac/O' names, or non-Latin. */
export function isPlausibleNameToken(word: string): boolean {
  if (!word) return false
  if (/^[\p{L}\p{M}.'’-]+$/u.test(word) && !/[A-Za-z]/.test(word)) return true
  if (/^[a-z]+(?:['’-]?[a-z]+)*$/.test(word)) return true
  if (/^[A-Z]{2,10}$/.test(word)) return true
  if (/^(?:Mc|Mac|O')[A-Z][a-z]+$/.test(word)) return true
  if (/^[A-Z][a-z]+(?:['’-]?[A-Z]?[a-z]+)*$/.test(word)) return true
  return false
}

export function looksLikeGibberishName(name: string): boolean {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 80) return true
  if (isMostlyNonLatin(trimmed)) return false

  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length === 0) return true

  const compact = trimmed.replace(/[\s.'’-]/g, '')
  const mixedCase = /[a-z]/.test(compact) && /[A-Z]/.test(compact)

  if (words.length === 1 && mixedCase && compact.length >= 5 && !isPlausibleNameToken(words[0])) {
    return true
  }

  if (words.length === 1 && mixedCase && compact.length >= 12) {
    if (countCaseTransitions(compact) / compact.length >= 0.2) return true
  }

  return words.some((word) => {
    if (!/[A-Za-z]/.test(word)) return false
    return !isPlausibleNameToken(word) && countCaseTransitions(word) >= 3
  })
}

export function isLikelySpamMessage(message: string): boolean {
  const trimmed = message.trim()
  if (trimmed.length < 2) return true
  if (trimmed.length > 10000) return true
  const urls = trimmed.match(/https?:\/\//gi) ?? []
  return urls.length >= 4
}

export type SpamContentInput = {
  name?: string
  email?: string
  message?: string
  subject?: string
  skipNameCheck?: boolean
  skipMessageCheck?: boolean
}

export function evaluateSpamContent(input: SpamContentInput): { spam: boolean; reasons: string[] } {
  const reasons: string[] = []
  const name = input.name?.trim() ?? ''
  const email = input.email?.trim() ?? ''
  const message = input.message?.trim() ?? ''
  const subject = input.subject?.trim() ?? ''

  if (email && !isValidPublicEmail(email)) reasons.push('invalid-email')
  if (!input.skipNameCheck && name && looksLikeGibberishName(name)) reasons.push('gibberish-name')
  if (!input.skipMessageCheck && message && isLikelySpamMessage(message)) reasons.push('spam-message')
  if (subject && looksLikeGibberishName(subject) && !/\s/.test(subject) && subject.length >= 8) {
    reasons.push('gibberish-subject')
  }

  return { spam: reasons.length > 0, reasons }
}
