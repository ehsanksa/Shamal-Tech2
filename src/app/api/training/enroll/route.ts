import { NextResponse } from 'next/server'

import { upsertEnrollment } from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

const DEFAULT_COURSE = 'drone-fundamentals'

/** POST /api/training/enroll — assign enrollment for current student. */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as {
    courseId?: string
    mode?: 'assigned' | 'manual'
  }
  const courseId = body.courseId?.trim() || DEFAULT_COURSE
  const mode = body.mode === 'manual' ? 'manual' : 'assigned'

  await upsertEnrollment({
    studentId: profile.id,
    studentEmail: profile.email,
    courseSlug: courseId,
    accessLevel: mode,
    notes: mode === 'assigned' ? 'Academy enrollment assigned' : 'Manual enrollment request',
  })

  return NextResponse.json({
    ok: true,
    message: mode === 'assigned' ? 'Enrollment assigned.' : 'Enrollment submitted for admin approval.',
  })
}
