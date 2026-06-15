import { NextResponse } from 'next/server'

import {
  createPaymentRecord,
  updateUserRole,
  upsertEnrollment,
} from '@/lib/training/repository'
import { getStripeKeys } from '@/lib/training/env'
import { notifyPaymentSuccess } from '@/lib/training/n8n'
import configPromise from '@/payload.config'
import { recordAnalyticsEventTrusted } from '@/lib/analytics/recordEvent'
import { getPayload } from 'payload'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

/**
 * POST /api/training/webhooks/stripe — Stripe webhook: upgrade user + enrollment.
 */
export async function POST(req: Request) {
  const { secretKey, webhookSecret } = getStripeKeys()
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 })
  }

  const raw = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const userId = session.metadata?.training_user_id
  const email = session.metadata?.training_email || session.customer_details?.email || session.customer_email
  const courseId = session.metadata?.training_course_id || 'drone-fundamentals'

  if (!userId || !email) {
    return NextResponse.json({ received: true, skipped: true })
  }

  const amount = (session.amount_total ?? 0) / 100
  const currency = (session.currency || 'sar').toUpperCase()

  try {
    await updateUserRole(userId, 'paid')
    await upsertEnrollment({
      studentId: userId,
      studentEmail: email,
      courseSlug: courseId,
      accessLevel: 'paid',
    })
    await createPaymentRecord({
      email,
      amount,
      currency,
      stripeSessionId: session.id,
    })
    await notifyPaymentSuccess({
      user_id: userId,
      email,
      course_id: courseId,
      progress: 0,
      timestamp: new Date().toISOString(),
      amount,
      currency,
    })

    try {
      const payload = await getPayload({ config: configPromise })
      await recordAnalyticsEventTrusted(payload, {
        sessionId: `training:${userId}`,
        eventType: 'PURCHASE_SUCCESS',
        pageUrl: '/training/dashboard',
        orderId: session.id,
        metaData: {
          amount,
          currency,
          courseId,
          source: 'training-stripe',
        },
        source: 'direct',
        deviceType: 'unknown',
        browser: 'Other',
      })
    } catch (analyticsErr) {
      console.error('Stripe webhook analytics write failed', analyticsErr)
    }
  } catch (e) {
    console.error('Stripe webhook handler error', e)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
