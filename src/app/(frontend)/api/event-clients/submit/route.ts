import { NextResponse } from 'next/server'

import configPromise from '../../../../../payload.config'
import { getPayload } from 'payload'

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

    return NextResponse.json({
      success: true,
      id: submission.id,
    })
  } catch (error) {
    console.error('Event client form submission error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
