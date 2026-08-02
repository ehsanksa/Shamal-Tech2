import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import { ensurePermanentInternalDomain } from '../../../../lib/procurement/domains'
import { processDomainExpiry } from '../../../../lib/procurement/expiry'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 })
  }
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await ensurePermanentInternalDomain(payload)
    const result = await processDomainExpiry(payload)

    return NextResponse.json({
      ok: true,
      ...result,
    })
  } catch (error) {
    console.error('procurement domain-expiry-cron error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron failed' },
      { status: 500 },
    )
  }
}
