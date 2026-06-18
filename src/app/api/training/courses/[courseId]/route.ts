import { NextResponse } from 'next/server'

import { buildCourseClientPayload } from '@/lib/training/course-access'
import { applyCourseSimState, parseCourseSimState } from '@/lib/training/dev-sim-state'
import { getCourseBySlug } from '@/lib/training/load-courses'
import { courseCompletionPercent } from '@/lib/training/courses'
import {
  getProgressForCourse,
  hasActiveEnrollment,
  listAssignmentSubmissionsForCourse,
} from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/**
 * GET /api/training/courses/[courseId] — role-aware course payload.
 * Dev only: ?simState=zero|partial|complete|cert-ready|assignment-required|assignment-submitted
 */
export async function GET(req: Request, ctx: { params: Promise<{ courseId: string }> }) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId } = await ctx.params
  const url = new URL(req.url)
  const activeLessonId = url.searchParams.get('lesson')
  const simState = parseCourseSimState(url.searchParams.get('simState'))

  const course = await getCourseBySlug(courseId)
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }
  if (profile.role !== 'admin') {
    const enrolled = await hasActiveEnrollment(profile.email, courseId)
    if (!enrolled) {
      return NextResponse.json(
        { error: 'Access not assigned. Please contact Shamal training admin.' },
        { status: 403 },
      )
    }
  }

  const progress = await getProgressForCourse(profile.email, courseId)
  const watched = new Set(simState ? [] : progress?.watchedIds || [])
  const storedSubmissions = simState ? [] : await listAssignmentSubmissionsForCourse(profile.email, courseId)
  const submissions = storedSubmissions.map((s) => ({
    scope: s.scope,
    scopeId: s.scopeId,
    status: s.status,
    submittedAt: s.submittedAt,
    adminRemarks: s.adminRemarks,
    textAnswer: s.textAnswer,
    submittedFileUrl: s.submittedFileUrl,
  }))

  const payload = await buildCourseClientPayload(
    courseId,
    profile.role,
    watched,
    submissions,
    activeLessonId,
  )
  if (!payload) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  if (!simState && progress) {
    const serverPercent = courseCompletionPercent(course, watched)
    const allIds = course.modules.flatMap((m) => m.videos.map((v) => v.id))
    payload.progressPercent = serverPercent
    payload.completed = allIds.length > 0 && allIds.every((id) => watched.has(id))
  }

  if (simState) {
    return NextResponse.json(applyCourseSimState(payload, simState, course))
  }

  return NextResponse.json(payload)
}
