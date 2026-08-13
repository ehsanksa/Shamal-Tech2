import { NextResponse } from 'next/server'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { recordAnalyticsEventTrusted } from '@/lib/analytics/recordEvent'
import { sendNewsletterNotification } from '../../../../lib/email'
import { guardPublicFormRequest } from '@/lib/forms/guard-public-form'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, source } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const guard = await guardPublicFormRequest(request, {
      form: 'newsletter',
      body,
      email,
      skipNameCheck: true,
      skipMessageCheck: true,
      fakeSuccessBody: { success: true, message: 'Successfully subscribed to newsletter' },
      loadPayload: () => getPayload({ config: configPromise }),
    })
    if (!guard.ok) return guard.response

    const payload = guard.payload

    // Check if email already exists
    const existing = await payload.find({
      collection: 'newsletter-subscriptions',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Email is already subscribed' },
        { status: 400 }
      )
    }

    // Save to Payload (MongoDB) as the only source of truth
    const subscription = await payload.create({
      collection: 'newsletter-subscriptions',
      data: {
        email,
        status: 'active',
        source: source || 'website',
      },
      context: {
        disableRevalidate: true,
      },
    })

    // Send instant email notification to hello@shamal.sa
    // Only send after successful CMS save to ensure record exists
    try {
      await sendNewsletterNotification(email, source || 'website')
    } catch (error) {
      // Log error but don't fail the subscription since CMS record is already saved
      console.error('Failed to send newsletter notification email:', error)
    }

    try {
      await recordAnalyticsEventTrusted(payload, {
        sessionId: `srv:newsletter:${subscription.id}`,
        eventType: 'NEWSLETTER_JOINED',
        pageUrl: '/',
        metaData: { newsletterSubscriptionId: subscription.id },
        source: 'direct',
        deviceType: 'unknown',
        browser: 'Other',
      })
    } catch (e) {
      console.error('Analytics NEWSLETTER_JOINED failed', e)
    }

    // Return success with subscription ID for reference
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        id: subscription.id,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

