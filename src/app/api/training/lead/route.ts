import { NextResponse } from 'next/server'

import { findUserByEmail, setWarmLead, TRAINING_CLICKUP_FIELDS as FIELD } from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'
import { notifyLeadCaptured } from '@/lib/training/n8n'

/**
 * POST /api/training/lead — warm lead capture (trial unlock intent).
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (profile.role !== 'trial') {
    return NextResponse.json({ error: 'Only trial users trigger lead capture' }, { status: 400 })
  }

  const body = (await req.json()) as { courseId?: string; action?: string }
  const courseId = body.courseId?.trim() || 'drone-fundamentals'

  await setWarmLead(profile.id, true)

  const record = await findUserByEmail(profile.email)
  const phone = record?.fields[FIELD.phone as keyof typeof record.fields] as string | undefined

  const ts = new Date().toISOString()
  await notifyLeadCaptured({
    user_id: profile.id,
    email: profile.email,
    name: profile.name,
    phone,
    course_id: courseId,
    progress: 0,
    timestamp: ts,
    action: body.action || 'buy_course',
  })

  return NextResponse.json({ ok: true, warmLead: true })
}
