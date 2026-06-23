/** Default internal recipient when admin setting is empty or invalid. */
export const CONTACT_FORM_DEFAULT_RECIPIENT_EMAIL = 'r.mohammed@shamal.sa'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function resolveContactFormRecipientEmail(value?: string | null): string {
  const trimmed = value?.trim()
  if (trimmed && EMAIL_PATTERN.test(trimmed)) {
    return trimmed
  }
  return CONTACT_FORM_DEFAULT_RECIPIENT_EMAIL
}
