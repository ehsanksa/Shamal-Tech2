import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import configPromise from '@/payload.config'
import { ANALYTICS_EVENT_TYPES } from '@/lib/analytics/eventTypes'
import type { AnalyticsEventType } from '@/lib/analytics/eventTypes'
import { recordAnalyticsEventFromRequest } from '@/lib/analytics/recordEvent'
import { getPayload } from 'payload'

export const runtime = 'nodejs'

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
    if (!body || typeof body !== 'object') {
      return cors(NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }))
    }
    const eventType = body.eventType as string
    const allowed = ANALYTICS_EVENT_TYPES as readonly string[]
    if (!allowed.includes(eventType)) {
      return cors(NextResponse.json({ error: 'Invalid eventType' }, { status: 400 }))
    }

    const h = await headers()
    const host = h.get('host') || ''
    const proto = h.get('x-forwarded-proto') || 'https'
    const pageUrl =
      typeof body.pageUrl === 'string' && body.pageUrl.length > 0
        ? body.pageUrl
        : `${proto}://${host}/`

    const result = await recordAnalyticsEventFromRequest(payload, req, {
      eventType: eventType as AnalyticsEventType,
      pageUrl,
      sessionId: String(body.sessionId || ''),
      productId: body.productId as number | string | null | undefined,
      orderId: body.orderId != null ? String(body.orderId) : null,
      searchKeyword: body.searchKeyword != null ? String(body.searchKeyword) : null,
      referrerUrl: body.referrerUrl != null ? String(body.referrerUrl) : null,
      metaData: (body.metaData as Record<string, unknown>) || null,
    })

    if (!result.ok) {
      return cors(NextResponse.json({ error: result.error }, { status: result.status }))
    }
    return cors(NextResponse.json({ ok: true }, { status: 200 }))
  } catch (error) {
    // Never block page rendering due to analytics write failures.
    console.warn('Analytics track skipped:', error)
    return cors(NextResponse.json({ ok: false, skipped: true }, { status: 200 }))
  }
}
