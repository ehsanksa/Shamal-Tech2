import { NextResponse } from 'next/server'

import configPromise from '@/payload.config'
import { pushTrainingInterestToClickUp } from '@/lib/clickup/pushTrainingInterestToClickUp'
import { resolveTrainingInterestClickUpAssigneeEmail } from '@/lib/clickup/trainingInterestSettings'
import { allocateFormReferenceNumber } from '@/lib/forms/form-reference-number'
import {
  sendTrainingInterestAutoReply,
  sendTrainingInterestInternalNotification,
} from '@/lib/email/training-interest-email'
import { getPayload } from 'payload'

const REGISTERING_AS_VALUES = new Set([
  'individual',
  'company-employee',
  'student',
  'government',
  'other',
])

const EXPERIENCE_VALUES = new Set(['yes', 'no', 'beginner', 'intermediate', 'advanced'])

const REFERRAL_VALUES = new Set([
  'linkedin',
  'instagram',
  'website',
  'google',
  'referral',
  'event',
  'other',
])

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

/**
 * POST /api/training/interest — public interest registration form.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const fullName = body.fullName?.trim()
    const mobile = body.mobile?.trim()
    const email = body.email?.trim()
    const city = body.city?.trim()
    const registeringAs = body.registeringAs?.trim()
    const droneExperience = body.droneExperience?.trim()
    const trainingPurpose = body.trainingPurpose?.trim()
    const consentGiven = body.consentGiven === true

    if (!fullName || !mobile || !email || !city) {
      return NextResponse.json(
        { error: 'Full name, mobile, email, and city are required.' },
        { status: 400 },
      )
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!registeringAs || !REGISTERING_AS_VALUES.has(registeringAs)) {
      return NextResponse.json({ error: 'Please select how you are registering.' }, { status: 400 })
    }
    if (!droneExperience || !EXPERIENCE_VALUES.has(droneExperience)) {
      return NextResponse.json(
        { error: 'Please indicate your drone or GIS experience.' },
        { status: 400 },
      )
    }
    if (!trainingPurpose) {
      return NextResponse.json(
        { error: 'Please tell us why you are interested in this training.' },
        { status: 400 },
      )
    }
    if (!consentGiven) {
      return NextResponse.json({ error: 'Consent is required to submit this form.' }, { status: 400 })
    }

    const referralSource = body.referralSource?.trim()

    if (referralSource && !REFERRAL_VALUES.has(referralSource)) {
      return NextResponse.json({ error: 'Invalid referral source.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const formNotificationSettings = await payload.findGlobal({
      slug: 'form-notification-settings',
      depth: 0,
    })

    const referenceNumber = await allocateFormReferenceNumber(payload, 'STT')

    const submission = await payload.create({
      collection: 'training-interest-submissions',
      data: {
        fullName,
        referenceNumber,
        mobile,
        email,
        city,
        nationality: body.nationality?.trim() || undefined,
        organization: body.organization?.trim() || undefined,
        jobTitle: body.jobTitle?.trim() || undefined,
        registeringAs,
        droneExperience,
        trainingPurpose,
        expectedOutcomes: body.expectedOutcomes?.trim() || undefined,
        additionalInfo: body.additionalInfo?.trim() || undefined,
        referralSource: referralSource || undefined,
        consentGiven: true,
        status: 'new',
      },
      overrideAccess: true,
      context: {
        disableRevalidate: true,
        skipClickUpHook: true,
      },
    })

    const clickUpResult = await pushTrainingInterestToClickUp(
      {
        ...submission,
        referenceNumber,
      },
      {
        assigneeEmail: resolveTrainingInterestClickUpAssigneeEmail(formNotificationSettings),
      },
    )
    if (clickUpResult) {
      try {
        await payload.update({
          collection: 'training-interest-submissions',
          id: submission.id,
          overrideAccess: true,
          data: {
            pushedToClickUp: true,
            clickupTaskId: clickUpResult.id,
            clickupTaskUrl: clickUpResult.url,
          },
          context: { disableRevalidate: true },
        })
      } catch (updateErr) {
        console.error('[TrainingInterest] Failed to save ClickUp task reference:', updateErr)
      }
    }

    try {
      await sendTrainingInterestAutoReply({
        applicantName: fullName,
        applicantEmail: email,
        referenceNumber,
      })
    } catch (emailErr) {
      console.error('[TrainingInterest] Auto-reply email failed:', emailErr)
    }

    try {
      await sendTrainingInterestInternalNotification(
        {
          fullName,
          email,
          mobile,
          city,
          referenceNumber,
          nationality: body.nationality?.trim() || undefined,
          organization: body.organization?.trim() || undefined,
          jobTitle: body.jobTitle?.trim() || undefined,
          registeringAs,
          droneExperience,
          trainingPurpose,
          expectedOutcomes: body.expectedOutcomes?.trim() || undefined,
          additionalInfo: body.additionalInfo?.trim() || undefined,
          referralSource: referralSource || undefined,
        },
        {
          recipientEmail: formNotificationSettings.trainingFormRecipientEmail,
        },
      )
    } catch (notifyErr) {
      console.error('[TrainingInterest] Internal notification email failed:', notifyErr)
    }

    return NextResponse.json({
      ok: true,
      id: submission.id,
      referenceNumber,
      message:
        'Thank you for registering your interest in Shamal Technologies training programs. Our team will review your submission and contact you soon with the relevant course details, schedule, and next steps.',
    })
  } catch (err) {
    console.error('[TrainingInterest] Submit error:', err)
    return NextResponse.json({ error: 'Failed to submit form. Please try again.' }, { status: 500 })
  }
}
