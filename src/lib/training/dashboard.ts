import { findFirstIncompleteLesson, formatHoursFromMinutes } from './course-stats'
import { toCourseSummary } from './course-access'
import { evaluateCertificateEligibility } from './certificate-eligibility'
import { watchedDurationMinutes } from './courses'
import { accessLabel } from './display'
import { loadAllCourses } from './load-courses'
import {
  findCertificateForStudentCourse,
  listAssignmentSubmissionsForCourse,
  listEnrollmentsForStudent,
  listProgressForStudent,
} from './repository'
import type { TrainingRole } from './types'

export type DashboardCourse = {
  id: string
  title: string
  thumbnail: string
  progressPercent: number
  lessonCount: number
  durationLabel: string
  certificateEnabled: boolean
  completed: boolean
}

export type DashboardData = {
  accessLabel: string
  enrolledCourses: DashboardCourse[]
  continueLearning: {
    courseId: string
    courseTitle: string
    lessonId: string
    lessonTitle: string
    progressPercent: number
  } | null
  certificates: Array<{
    courseId: string
    courseTitle: string
    certificateId: string
    issuedAt: string
  }>
  trainingHours: string
  trainingMinutes: number
  progressOverview: {
    enrolledCount: number
    completedCount: number
    inProgressCount: number
    averageProgress: number
  }
  pendingAssignments: Array<{
    courseId: string
    courseTitle: string
    assignmentTitle: string
    status: 'pending' | 'submitted' | 'reviewed' | 'accepted' | 'rejected'
    adminRemarks?: string
  }>
}

export async function buildDashboardData(
  email: string,
  role: TrainingRole,
): Promise<DashboardData> {
  const courses = await loadAllCourses()
  const enrollments = await listEnrollmentsForStudent(email)
  const enrolledSlugs = new Set(
    enrollments.filter((e) => e.status === 'active').map((e) => e.courseSlug),
  )
  const progressRecords = await listProgressForStudent(email)
  const progressByCourse = new Map(progressRecords.map((p) => [p.courseSlug, p]))

  const enrolledCourses: DashboardCourse[] = []
  let totalTrainingMinutes = 0

  for (const course of courses) {
    const hasEnrollment = enrolledSlugs.has(course.id)
    const progress = progressByCourse.get(course.id)
    const isEnrolled = hasEnrollment

    if (!isEnrolled) continue

    const watched = new Set(progress?.watchedIds ?? [])
    totalTrainingMinutes += watchedDurationMinutes(course, watched)
    const summary = toCourseSummary(course)

    enrolledCourses.push({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      progressPercent: progress?.progressPercent ?? 0,
      lessonCount: summary.lessonCount,
      durationLabel: summary.durationLabel,
      certificateEnabled: course.certificateEnabled,
      completed: Boolean(progress?.completed) || (progress?.progressPercent ?? 0) >= 100,
    })
  }

  let continueLearning: DashboardData['continueLearning'] = null
  const sortedProgress = [...progressRecords].sort((a, b) => {
    const aTime = a.lastActivity ? Date.parse(a.lastActivity) : 0
    const bTime = b.lastActivity ? Date.parse(b.lastActivity) : 0
    return bTime - aTime
  })

  const candidateSlugs =
    sortedProgress.length > 0
      ? sortedProgress.map((p) => p.courseSlug).filter((slug) => enrolledSlugs.has(slug))
      : enrolledCourses.map((c) => c.id)

  for (const slug of candidateSlugs) {
    const course = courses.find((c) => c.id === slug)
    if (!course) continue
    const progress = progressByCourse.get(slug)
    const watched = new Set(progress?.watchedIds ?? [])
    const next = findFirstIncompleteLesson(course, watched)
    if (next) {
      continueLearning = {
        courseId: course.id,
        courseTitle: course.title,
        lessonId: next.lessonId,
        lessonTitle: next.title,
        progressPercent: progress?.progressPercent ?? 0,
      }
      break
    }
  }

  if (!continueLearning && enrolledCourses.length > 0) {
    const first = courses.find((c) => c.id === enrolledCourses[0].id)
    if (first) {
      const firstLesson = first.modules[0]?.videos[0]
      if (firstLesson) {
        continueLearning = {
          courseId: first.id,
          courseTitle: first.title,
          lessonId: firstLesson.id,
          lessonTitle: firstLesson.title,
          progressPercent: 0,
        }
      }
    }
  }

  const certificates: DashboardData['certificates'] = []
  const pendingAssignments: DashboardData['pendingAssignments'] = []
  for (const enrolled of enrolledCourses) {
    if (!enrolled.certificateEnabled) continue
    const course = courses.find((c) => c.id === enrolled.id)
    if (!course) continue
    const progress = progressByCourse.get(enrolled.id)
    for (const submission of storedSubmissions) {
      if (submission.status === 'accepted') continue
      pendingAssignments.push({
        courseId: enrolled.id,
        courseTitle: enrolled.title,
        assignmentTitle: submission.assignmentTitle,
        status: submission.status === 'reviewed' ? 'submitted' : submission.status,
        adminRemarks: submission.adminRemarks,
      })
    }

    const storedSubmissions = await listAssignmentSubmissionsForCourse(email, enrolled.id)
    const submissions = storedSubmissions.map((s) => ({
      scope: s.scope,
      scopeId: s.scopeId,
      status: s.status,
    }))
    const eligibility = evaluateCertificateEligibility({
      course,
      progressPercent: progress?.progressPercent ?? enrolled.progressPercent,
      completed: enrolled.completed,
      submissions,
    })
    if (!eligibility.eligible) continue
    const cert = await findCertificateForStudentCourse(email, enrolled.id)
    certificates.push({
      courseId: enrolled.id,
      courseTitle: enrolled.title,
      certificateId: cert?.certificateId || '',
      issuedAt: cert?.issuedAt || '',
    })
  }

  const completedCount = enrolledCourses.filter((c) => c.completed).length
  const inProgressCount = enrolledCourses.filter(
    (c) => !c.completed && c.progressPercent > 0,
  ).length
  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + c.progressPercent, 0) / enrolledCourses.length,
        )
      : 0

  return {
    accessLabel: accessLabel(role),
    enrolledCourses,
    continueLearning,
    certificates,
    trainingHours: formatHoursFromMinutes(totalTrainingMinutes),
    trainingMinutes: totalTrainingMinutes,
    progressOverview: {
      enrolledCount: enrolledCourses.length,
      completedCount,
      inProgressCount,
      averageProgress,
    },
    pendingAssignments,
  }
}
