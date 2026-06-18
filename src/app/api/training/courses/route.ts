import { NextResponse } from 'next/server'

import { listCourseSummaries } from '@/lib/training/course-access'
import { getCurrentTrainingProfile } from '@/lib/training/profile'
import { listEnrollmentsForStudent } from '@/lib/training/repository'

/** GET /api/training/courses — catalog summaries for logged-in users */
export async function GET() {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const courses = await listCourseSummaries()
  if (profile.role === 'admin') {
    return NextResponse.json({ courses })
  }
  const enrollments = await listEnrollmentsForStudent(profile.email)
  const activeCourseSlugs = new Set(
    enrollments.filter((enrollment) => enrollment.status === 'active').map((enrollment) => enrollment.courseSlug),
  )
  const enrolledCourses = courses.filter((course) => activeCourseSlugs.has(course.id))
  return NextResponse.json({ courses: enrolledCourses })
}
