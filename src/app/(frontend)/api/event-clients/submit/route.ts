import { NextResponse } from 'next/server'

import configPromise from '../../../../../payload.config'
import { getPayload } from 'payload'
import { sendEventClientNotification } from '../../../../../lib/email/event-client-email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      clientName,
      companyName,
      jobTitle,
      phoneNumber,
      email,
      sector,
      serviceRequired,
      clientInterests,
      priorityLevel,
      additionalNotes,
      eventName,
    } = body

    if (!clientName || !email) {
      return NextResponse.json(
        { error: 'Client name and email are required' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const formSettings = (await payload.findGlobal({
      slug: 'visitors-form-settings',
      depth: 0,
    })) as {
      collectionEnabled?: boolean | null
      emailAlertsEnabled?: boolean | null
      notificationEmails?: string | null
      closedMessage?: string | null
      closedMessageAr?: string | null
    }

    if (formSettings.collectionEnabled === false) {
      return NextResponse.json(
        {
          error: 'Form closed',
          message:
            formSettings.closedMessage ||
            'This form is currently closed and not accepting new submissions.',
          messageAr:
            formSettings.closedMessageAr ||
            'هذا النموذج مغلق حالياً ولا يقبل تسجيلات جديدة.',
        },
        { status: 403 },
      )
    }

    let serviceLabel = serviceRequired || undefined
    if (serviceRequired && serviceRequired !== 'other') {
      try {
        const service = await payload.findByID({
          collection: 'services',
          id: serviceRequired,
          depth: 0,
        })
        serviceLabel = service.title || serviceRequired
      } catch {
        serviceLabel = serviceRequired
      }
    } else if (serviceRequired === 'other') {
      serviceLabel = 'Other'
    }

    let sectorLabel = sector || undefined
    if (sector && sector !== 'other') {
      const sectorsContent = await payload.findGlobal({
        slug: 'sectors-content',
        depth: 0,
      })
      const sectors = (sectorsContent as { sectors?: Array<{ slug?: string; name?: string }> })
        .sectors
      const match = sectors?.find((s) => s.slug === sector)
      if (match?.name) {
        sectorLabel = match.name
      }
    } else if (sector === 'other') {
      sectorLabel = 'Other'
    }

    const submission = await payload.create({
      collection: 'event-client-submissions',
      data: {
        clientName,
        companyName: companyName || undefined,
        jobTitle: jobTitle || undefined,
        phoneNumber: phoneNumber || undefined,
        email,
        sector: sectorLabel,
        serviceRequired: serviceLabel,
        clientInterests: clientInterests || undefined,
        priorityLevel: priorityLevel || 'medium',
        additionalNotes: additionalNotes || undefined,
        eventName: eventName || undefined,
        status: 'new',
      },
      context: {
        disableRevalidate: true,
      },
    })

    if (formSettings.emailAlertsEnabled !== false) {
      try {
        await sendEventClientNotification(
          {
            clientName,
            companyName: companyName || undefined,
            jobTitle: jobTitle || undefined,
            phoneNumber: phoneNumber || undefined,
            email,
            sector: sectorLabel,
            serviceRequired: serviceLabel,
            clientInterests: clientInterests || undefined,
            priorityLevel: priorityLevel || 'medium',
            additionalNotes: additionalNotes || undefined,
            eventName: eventName || undefined,
          },
          {
            notificationEmails: formSettings.notificationEmails,
          },
        )
      } catch (error) {
        console.error('Failed to send visitors form notification email:', error)
      }
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
    })
  } catch (error) {
    console.error('Event client form submission error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
