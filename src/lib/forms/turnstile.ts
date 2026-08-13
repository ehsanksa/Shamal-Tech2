/**
 * Optional Cloudflare Turnstile verification.
 * When TURNSTILE_SECRET_KEY is unset, verification is skipped (other guards still apply).
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function isTurnstileRequired(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim())
}

export function getTurnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  return key || undefined
}

export async function verifyTurnstileIfConfigured(
  token: unknown,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) return true

  if (typeof token !== 'string' || token.trim() === '') return false

  try {
    const body = new URLSearchParams({
      secret,
      response: token.trim(),
    })
    if (ip) body.set('remoteip', ip)

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (error) {
    console.error('[turnstile] verification failed', error)
    return false
  }
}
