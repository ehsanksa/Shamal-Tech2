import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { canAccessBusinessAnalytics } from '@/access/analyticsSuperAdmin'
import configPromise from '@/payload.config'

export async function requireBackupAdmin(): Promise<
  | { payload: Awaited<ReturnType<typeof getPayload>> }
  | { response: NextResponse }
> {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!(await canAccessBusinessAnalytics(payload, user))) {
    if (!user) {
      return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { payload }
}
