/**
 * Centralized env reads for the training module (no secrets in client bundles).
 */

export function getTrainingJwtSecret(): string {
  const s = process.env.TRAINING_JWT_SECRET
  if (!s) {
    throw new Error('TRAINING_JWT_SECRET is not set')
  }
  return s
}

export function isTrainingJwtSecretConfigured(): boolean {
  return Boolean(process.env.TRAINING_JWT_SECRET?.trim())
}

export function getN8nWebhookBaseUrl(): string | null {
  const u = process.env.N8N_WEBHOOK_BASE_URL?.replace(/\/$/, '')
  return u || null
}

/** ClickUp lists for training (tasks = rows; custom field names must match TRAINING_CLICKUP_FIELD_* defaults or your env). */
export function getClickupTrainingConfig() {
  const token = process.env.CLICKUP_API_TOKEN?.trim()
  const usersList = process.env.TRAINING_CLICKUP_USERS_LIST_ID?.trim()
  const progressList = process.env.TRAINING_CLICKUP_PROGRESS_LIST_ID?.trim()
  const paymentsList = process.env.TRAINING_CLICKUP_PAYMENTS_LIST_ID?.trim()
  if (!token || !usersList || !progressList || !paymentsList) {
    return null
  }
  return { token, usersList, progressList, paymentsList }
}

export function isClickupTrainingConfigured(): boolean {
  return getClickupTrainingConfig() !== null
}

export function getStripeKeys() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  }
}

export function getVimeoAccessToken(): string | null {
  return process.env.VIMEO_ACCESS_TOKEN || null
}

export function getTrainingPriceCourseId(): string {
  return process.env.TRAINING_STRIPE_PRICE_ID || process.env.TRAINING_DEFAULT_COURSE_ID || 'drone-fundamentals'
}

/** Comma-separated admin emails (must match registered user email) */
export function isStripeConfigured(): boolean {
  const { secretKey } = getStripeKeys()
  return Boolean(process.env.STRIPE_PRICE_ID?.trim() && secretKey?.trim())
}

export function isTrainingAuthAvailable(): boolean {
  return isTrainingJwtSecretConfigured()
}

export function getAdminEmails(): Set<string> {
  const raw = process.env.TRAINING_ADMIN_EMAILS || ''
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  )
}
