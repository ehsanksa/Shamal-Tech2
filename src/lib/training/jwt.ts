/**
 * JWT helpers for training sessions (signed with TRAINING_JWT_SECRET).
 */

import { SignJWT, jwtVerify } from 'jose'

import { getTrainingJwtSecret } from './env'
import type { TrainingJwtPayload, TrainingRole } from './types'

const COOKIE_NAME = 'training_session'
const EXPIRY = '7d'

function getSecretKey() {
  return new TextEncoder().encode(getTrainingJwtSecret())
}

export async function signTrainingToken(payload: Omit<TrainingJwtPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecretKey())
}

export async function verifyTrainingToken(token: string): Promise<TrainingJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    const sub = String(payload.sub || '')
    const email = String(payload.email || '')
    const name = String(payload.name || '')
    const rawRole = String(payload.role || '').toLowerCase().trim()
    const role: TrainingRole = rawRole === 'admin' ? 'admin' : 'student'
    if (!sub || !email || !rawRole) {
      return null
    }
    return { sub, email, name, role }
  } catch {
    return null
  }
}

export { COOKIE_NAME }
