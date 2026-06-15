import { NextResponse } from 'next/server'

import { upsertEnrollment } from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

const DEFAULT_COURSE = 'drone-fundamentals'

/**
 * POST /api/training/enroll — complete enrollment (manual approval or immediate access).
 * Body: { courseId?, mode?: 'free' | 'manual' }
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (profile.role === 'paid' || profile.role === 'admin') {
    return NextResponse.json({ ok: true, message: 'You already have full course access.' })
  }

  const body = (await req.json().catch(() => ({}))) as {
    courseId?: string
    mode?: 'free' | 'manual'
  }
  const courseId = body.courseId?.trim() || DEFAULT_COURSE
  const mode = body.mode === 'manual' ? 'manual' : 'free'

  await upsertEnrollment({
    studentId: profile.id,
    studentEmail: profile.email,
    courseSlug: courseId,
    accessLevel: mode,
    notes: mode === 'free' ? 'Academy enrollment' : 'Manual enrollment request',
  })

  return NextResponse.json({
    ok: true,
    message:
      mode === 'free'
        ? 'Enrollment complete. Full course access is now active.'
        : 'Enrollment submitted for admin approval.',
  })
}
