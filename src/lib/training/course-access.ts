/**
 * Role-based course payloads for the training viewer (no Vimeo).
 * Launch rule: logged-in students can access every lesson in the course.
 */

import {
  assignmentDisplayStatus,
  findModuleForLesson,
  resolveEffectiveAssignment,
  submissionForAssignment,
  type AssignmentSubmissionRecord,
} from './assignments'
import { evaluateCertificateEligibility } from './certificate-eligibility'
import type { TrainingRole } from './types'
import { getCourseBySlug, courseCompletionPercent } from './load-courses'
import type { TrainingAssignment, TrainingCourse, TrainingVideo } from './courses'
import { countLessons, formatDuration, totalDurationMinutes } from './course-stats'

export type ClientLesson = {
  id: string
  title: string
  durationMin?: number
  videoUrl?: string
  documentUrl?: string
  content?: string
  completed?: boolean
}

export type ClientModule = {
  id: string
  title: string
  description?: string
  videos: ClientLesson[]
}

export type CourseSummary = {
  id: string
  title: string
  description: string
  thumbnail: string
  banner: string
  durationHours?: number
  durationLabel: string
  lessonCount: number
  certificateEnabled: boolean
  learningObjectives: string[]
  instructor: TrainingCourse['instructor']
}

export type ClientAssignmentPayload = TrainingAssignment & {
  submission: AssignmentSubmissionRecord | null
  displayStatus: 'none' | 'pending' | 'submitted' | 'reviewed' | 'accepted' | 'rejected'
}

export type CertificateStatus = 'available' | 'needs-lessons' | 'needs-assignment' | 'disabled'

export type CourseClientPayload = {
  course: CourseSummary
  modules: ClientModule[]
  progressPercent: number
  watchedVideoIds: string[]
  completed: boolean
  certificateAvailable: boolean
  certificateStatus: CertificateStatus
  certificateBlockMessage?: string
  effectiveAssignment: ClientAssignmentPayload | null
  requiredAssignmentsPending: string[]
  simState?: string
}

function mapClientLesson(v: TrainingVideo, watched: Set<string>): ClientLesson {
  return {
    id: v.id,
    title: v.title,
    durationMin: v.durationMin,
    videoUrl: v.videoUrl,
    documentUrl: v.documentUrl,
    content: v.content,
    completed: watched.has(v.id),
  }
}

export function toCourseSummary(course: TrainingCourse): CourseSummary {
  const minutes = totalDurationMinutes(course)
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    banner: course.banner || course.thumbnail,
    durationHours: course.durationHours,
    durationLabel: course.durationHours
      ? `${course.durationHours} hr estimated`
      : formatDuration(minutes),
    lessonCount: countLessons(course),
    certificateEnabled: course.certificateEnabled,
    learningObjectives: course.learningObjectives,
    instructor: course.instructor,
  }
}

function toClientAssignment(
  assignment: TrainingAssignment | undefined,
  submissions: AssignmentSubmissionRecord[],
): ClientAssignmentPayload | null {
  if (!assignment) return null
  const submission = submissionForAssignment(submissions, assignment) || null
  return {
    ...assignment,
    submission,
    displayStatus: assignmentDisplayStatus(assignment, submission || undefined),
  }
}

export async function buildCourseClientPayload(
  courseId: string,
  _role: TrainingRole,
  watched: Set<string>,
  submissions: AssignmentSubmissionRecord[] = [],
  activeLessonId?: string | null,
): Promise<CourseClientPayload | null> {
  const course = (await getCourseBySlug(courseId)) as TrainingCourse | undefined
  if (!course) return null

  const modules: ClientModule[] = course.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    description: mod.description,
    videos: mod.videos.map((v) => mapClientLesson(v, watched)),
  }))

  const progressPercent = courseCompletionPercent(course, watched)
  const allLessonIds = course.modules.flatMap((m) => m.videos.map((v) => v.id))
  const allLessonsComplete =
    allLessonIds.length > 0 && allLessonIds.every((id) => watched.has(id))

  const eligibility = evaluateCertificateEligibility({
    course,
    progressPercent,
    completed: allLessonsComplete,
    submissions,
  })

  const certificateStatus: CertificateStatus = !course.certificateEnabled
    ? 'disabled'
    : eligibility.eligible
      ? 'available'
      : !eligibility.assignmentsSatisfied && eligibility.lessonsComplete
        ? 'needs-assignment'
        : 'needs-lessons'

  const moduleForLesson = activeLessonId
    ? findModuleForLesson(course, activeLessonId)
    : undefined
  const effective = resolveEffectiveAssignment(
    course,
    moduleForLesson?.id || null,
    activeLessonId || null,
  )

  return {
    course: toCourseSummary(course),
    modules,
    progressPercent,
    watchedVideoIds: [...watched],
    completed: allLessonsComplete,
    certificateAvailable: eligibility.eligible,
    certificateStatus,
    certificateBlockMessage: eligibility.eligible ? undefined : eligibility.blockMessage,
    effectiveAssignment: toClientAssignment(effective, submissions),
    requiredAssignmentsPending: eligibility.pendingAssignmentTitles,
  }
}

export async function listCourseSummaries(): Promise<CourseSummary[]> {
  const { loadAllCourses } = await import('./load-courses')
  const courses = await loadAllCourses()
  return courses.map(toCourseSummary)
}
