import { NextResponse } from 'next/server'

import { getCourseBySlug } from '@/lib/training/load-courses'
import { courseCompletionPercent } from '@/lib/training/courses'
import { getProgressForCourse, upsertProgress } from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'
import { notifyProgressUpdate } from '@/lib/training/n8n'

/**
 * POST /api/training/progress — persist lesson progress (Payload source of truth).
 * Body: { courseId, lessonId? } or { courseId, watchedVideoIds? }
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as {
    courseId?: string
    lessonId?: string
    watchedVideoIds?: string[]
  }
  const courseId = body.courseId?.trim()
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 })
  }

  const course = await getCourseBySlug(courseId)
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const existing = await getProgressForCourse(profile.email, courseId)
  const watchedSet = new Set(existing?.watchedIds ?? [])

  const lessonId = body.lessonId?.trim()
  if (lessonId) {
    watchedSet.add(lessonId)
  } else if (Array.isArray(body.watchedVideoIds)) {
    for (const id of body.watchedVideoIds) {
      if (typeof id === 'string' && id.trim()) watchedSet.add(id.trim())
    }
  } else {
    return NextResponse.json({ error: 'lessonId or watchedVideoIds required' }, { status: 400 })
  }

  const allLessonIds = course.modules.flatMap((m) => m.videos.map((v) => v.id))
  const progress = courseCompletionPercent(course, watchedSet)
  const completed =
    allLessonIds.length > 0 && allLessonIds.every((id) => watchedSet.has(id))
  const watchedVideoIds = [...watchedSet]

  await upsertProgress({
    email: profile.email,
    courseId,
    progressPercent: progress,
    completed,
    watchedVideoIds,
  })

  const ts = new Date().toISOString()
  await notifyProgressUpdate({
    user_id: profile.id,
    email: profile.email,
    course_id: courseId,
    progress,
    timestamp: ts,
    completed,
  })

  return NextResponse.json({
    ok: true,
    progress,
    progressPercent: progress,
    completed,
    watchedVideoIds,
  })
}
