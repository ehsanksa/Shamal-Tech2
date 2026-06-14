import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

export async function requireAdminUser(): Promise<
  { ok: true; user: User } | { ok: false; response: NextResponse }
> {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Admin sign-in required.' }, { status: 401 }) }
  }
  if (!user.roles?.includes('admin')) {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { ok: true, user }
}

export function checkMongoEnv(): { ok: boolean; missing: string[] } {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URI
  if (!uri) return { ok: false, missing: ['MONGODB_URI or DATABASE_URI'] }
  return { ok: true, missing: [] }
}

export function mongoEnvErrorMessage(): string {
  return 'MongoDB is not configured. Set MONGODB_URI (or DATABASE_URI) in Vercel env vars.'
}
