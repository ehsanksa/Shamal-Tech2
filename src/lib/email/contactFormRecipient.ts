/** Default internal recipient when admin setting is empty or invalid. */
export const CONTACT_FORM_DEFAULT_RECIPIENT_EMAIL = 'r.mohammed@shamal.sa'

/** Default internal recipient for quotation and training interest forms. */
export const QUOTATION_FORM_DEFAULT_RECIPIENT_EMAIL = 'k.shami@shamal.sa'

export const TRAINING_FORM_DEFAULT_RECIPIENT_EMAIL = 'k.shami@shamal.sa'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function resolveRecipientEmail(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (trimmed && EMAIL_PATTERN.test(trimmed)) {
    return trimmed
  }
  return fallback
}

export function resolveContactFormRecipientEmail(value?: string | null): string {
  return resolveRecipientEmail(value, CONTACT_FORM_DEFAULT_RECIPIENT_EMAIL)
}

export function resolveQuotationFormRecipientEmail(value?: string | null): string {
  return resolveRecipientEmail(value, QUOTATION_FORM_DEFAULT_RECIPIENT_EMAIL)
}

export function resolveTrainingFormRecipientEmail(value?: string | null): string {
  return resolveRecipientEmail(value, TRAINING_FORM_DEFAULT_RECIPIENT_EMAIL)
}
