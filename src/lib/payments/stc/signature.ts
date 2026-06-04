import { createHash } from 'crypto'

import type { StcPaymentConfig } from './env'

function buildShaString(
  params: Record<string, string>,
  phrase: string,
): string {
  const keys = Object.keys(params)
    .filter((k) => k !== 'signature')
    .sort()

  let shaString = phrase
  for (const key of keys) {
    const value = params[key]
    if (value === '' || value === undefined || value === null) continue
    shaString += `${key}=${value}`
  }
  shaString += phrase
  return shaString
}

function hashShaString(shaString: string, shaType: 'sha256' | 'sha512'): string {
  return createHash(shaType).update(shaString).digest('hex')
}

/** Request signature for Amazon Payment Services / PayFort (STC Pay hosted checkout). */
export function signStcPaymentRequest(
  params: Record<string, string>,
  config: Pick<StcPaymentConfig, 'shaRequestPhrase' | 'shaType'>,
): string {
  const shaString = buildShaString(params, config.shaRequestPhrase)
  return hashShaString(shaString, config.shaType)
}

/** Verify return_url / notification POST body signature. */
export function verifyStcPaymentResponse(
  params: Record<string, string>,
  config: Pick<StcPaymentConfig, 'shaResponsePhrase' | 'shaType'>,
): boolean {
  const received = params.signature
  if (!received) return false
  const expected = hashShaString(buildShaString(params, config.shaResponsePhrase), config.shaType)
  return expected === received
}
