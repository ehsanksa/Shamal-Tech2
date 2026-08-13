import { NextResponse } from 'next/server'
import type { Payload } from 'payload'

import { getClientIp } from '@/lib/analytics/clientIp'
import { evaluatePublicFormSubmission } from '@/lib/forms/form-protection'
import { enforceFormRateLimit } from '@/lib/forms/form-rate-limit'
import { verifyTurnstileIfConfigured } from '@/lib/forms/turnstile'

type GuardOptions = {
  form: 'contact' | 'quote' | 'newsletter' | 'training-interest'
  body: Record<string, unknown>
  name?: string
  email?: string
  message?: string
  subject?: string
  skipNameCheck?: boolean
  skipMessageCheck?: boolean
  /** JSON body returned when spam is silently dropped (bots should see success). */
  fakeSuccessBody: Record<string, unknown>
  loadPayload: () => Promise<Payload>
}

export type PublicFormGuardResult =
  | { ok: true; ip: string; payload: Payload }
  | { ok: false; response: NextResponse }

/**
 * Shared public-form gate: honeypot / timing / heuristics, optional Turnstile, then rate limit.
 * Spam is dropped before `loadPayload()` so bot floods do not open Mongo or send mail.
 */
export async function guardPublicFormRequest(
  request: Request,
  options: GuardOptions,
): Promise<PublicFormGuardResult> {
  const ip = getClientIp(request.headers)
  const protection = evaluatePublicFormSubmission({
    website: options.body.website,
    formStartedAt: options.body.formStartedAt,
    name: options.name,
    email: options.email,
    message: options.message,
    subject: options.subject,
    skipNameCheck: options.skipNameCheck,
    skipMessageCheck: options.skipMessageCheck,
  })

  if (protection.action === 'drop') {
    console.warn(`[${options.form}] dropped submission`, { reasons: protection.reasons, ip })
    return { ok: false, response: NextResponse.json(options.fakeSuccessBody, { status: 200 }) }
  }

  const turnstileOk = await verifyTurnstileIfConfigured(options.body.turnstileToken, ip)
  if (!turnstileOk) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 },
      ),
    }
  }

  const payload = await options.loadPayload()
  const rate = await enforceFormRateLimit(payload, {
    form: options.form,
    ip,
    email: options.email,
  })
  if (!rate.allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
      ),
    }
  }

  return { ok: true, ip, payload }
}
