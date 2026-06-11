import type SMTPTransport from 'nodemailer/lib/smtp-transport'

/** Trim and strip accidental surrounding quotes from env values (common in Vercel UI). */
export function readSmtpEnv(key: string): string | undefined {
  const raw = process.env[key]
  if (raw == null || raw === '') return undefined
  const trimmed = raw.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function getSmtpTransportOptions(): SMTPTransport.Options | null {
  const host = readSmtpEnv('SMTP_HOST')
  const user = readSmtpEnv('SMTP_USER')
  const pass = readSmtpEnv('SMTP_PASSWORD')
  const port = parseInt(readSmtpEnv('SMTP_PORT') || '587', 10)
  const secureRaw = readSmtpEnv('SMTP_SECURE')
  const secure =
    typeof secureRaw === 'string' ? secureRaw === 'true' : port === 465

  if (!host || !user || !pass) return null

  return {
    host,
    port,
    secure,
    requireTLS: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: readSmtpEnv('SMTP_REJECT_UNAUTHORIZED') !== 'false',
      minVersion: 'TLSv1.2',
    },
  }
}

/**
 * Payload/nodemailer verify on init causes SMTP AUTH on every serverless cold start.
 * Skip by default; set SMTP_SKIP_VERIFY=false locally to test credentials.
 */
export function shouldSkipSmtpVerify(): boolean {
  return readSmtpEnv('SMTP_SKIP_VERIFY') !== 'false'
}
