import { NextResponse } from 'next/server'

import configPromise from '../../../../payload.config'
import { getPayload } from 'payload'
import { recordAnalyticsEventTrusted } from '@/lib/analytics/recordEvent'
import {
  sendCustomerAutoReply,
  sendInternalContactNotification,
} from '../../../../lib/email/contact-email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, services, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    const formNotificationSettings = await payload.findGlobal({
      slug: 'form-notification-settings',
      depth: 0,
    })

    // Create contact submission (keep for backward compatibility)
    const submission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        subject: subject || undefined,
        services: services && Array.isArray(services) ? services : undefined,
        message,
        status: 'new',
      },
      context: {
        disableRevalidate: true,
      },
    })

    // Create lead in the Leads collection
    let lead
    try {
      lead = await payload.create({
        collection: 'leads',
        data: {
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          subject: subject || undefined,
          services: services && Array.isArray(services) ? services : undefined,
          message,
          leadOrigin: 'website', // Triggers ClickUp sync via afterChange hook
          source: 'contact-form',
          status: 'new',
          priority: 'medium',
        },
        context: {
          disableRevalidate: true,
        },
      })
    } catch (error) {
      console.error('Failed to create lead:', error)
      // Continue even if lead creation fails
    }

    const submissionData = {
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      subject: subject || undefined,
      message,
    }

    // One customer auto-reply per submission
    try {
      await sendCustomerAutoReply(submissionData)

      if (lead) {
        await payload.update({
          collection: 'leads',
          id: lead.id,
          data: {
            emailSent: true,
            emailSentAt: new Date().toISOString(),
          },
          context: {
            disableRevalidate: true,
          },
        })
      }
    } catch (error) {
      console.error('Failed to send customer auto-reply:', error)
    }

    // One internal notification per submission
    try {
      await sendInternalContactNotification(submissionData, {
        recipientEmail: formNotificationSettings.contactFormRecipientEmail,
      })
    } catch (error) {
      console.error('Failed to send internal contact notification:', error)
    }

    try {
      await recordAnalyticsEventTrusted(payload, {
        sessionId: `srv:contact:${submission.id}`,
        eventType: 'CONTACT_SUBMITTED',
        pageUrl: '/contact',
        metaData: { contactSubmissionId: submission.id },
        source: 'direct',
        deviceType: 'unknown',
        browser: 'Other',
      })
    } catch (e) {
      console.error('Analytics CONTACT_SUBMITTED failed', e)
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

