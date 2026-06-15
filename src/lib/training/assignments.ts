import type { TrainingAssignment, TrainingCourse, TrainingModule, TrainingVideo } from './courses'

export type AssignmentScope = TrainingAssignment['scope']

export type AssignmentSubmissionStatus = 'submitted' | 'reviewed' | 'accepted' | 'rejected'

export type AssignmentSubmissionRecord = {
  scope: AssignmentScope
  scopeId: string
  status: AssignmentSubmissionStatus
  submittedAt?: string
  adminRemarks?: string
  textAnswer?: string
  submittedFileUrl?: string
}

export type ClientAssignment = TrainingAssignment & {
  submission?: AssignmentSubmissionRecord | null
  displayStatus: 'none' | 'pending' | 'submitted' | 'reviewed' | 'accepted' | 'rejected'
}

function mapAssignmentFromPayload(
  raw: {
    enabled?: boolean | null
    title?: string | null
    instructions?: string | null
    referenceFileUrl?: string | null
    dueDate?: string | null
    submissionType?: string | null
    requiredForCertificate?: boolean | null
    requireAdminAcceptance?: boolean | null
  } | null | undefined,
  scope: AssignmentScope,
  scopeId: string,
): TrainingAssignment | undefined {
  if (!raw?.enabled || !raw.title?.trim()) return undefined
  const submissionType =
    raw.submissionType === 'file' || raw.submissionType === 'both' ? raw.submissionType : 'text'
  return {
    enabled: true,
    scope,
    scopeId,
    title: raw.title.trim(),
    instructions: raw.instructions?.trim() || '',
    referenceFileUrl: raw.referenceFileUrl || undefined,
    dueDate: raw.dueDate || undefined,
    submissionType,
    requiredForCertificate: Boolean(raw.requiredForCertificate),
    requireAdminAcceptance: Boolean(raw.requireAdminAcceptance),
  }
}

export function mapAssignmentGroup(
  assignment: Parameters<typeof mapAssignmentFromPayload>[0],
  scope: AssignmentScope,
  scopeId: string,
): TrainingAssignment | undefined {
  return mapAssignmentFromPayload(assignment, scope, scopeId)
}

export function collectCourseAssignments(course: TrainingCourse): TrainingAssignment[] {
  const list: TrainingAssignment[] = []
  if (course.assignment) list.push(course.assignment)
  for (const mod of course.modules) {
    if (mod.assignment) list.push(mod.assignment)
    for (const lesson of mod.videos) {
      if (lesson.assignment) list.push(lesson.assignment)
    }
  }
  return list
}

export function resolveEffectiveAssignment(
  course: TrainingCourse,
  moduleId: string | null,
  lessonId: string | null,
): TrainingAssignment | undefined {
  if (lessonId) {
    for (const mod of course.modules) {
      for (const lesson of mod.videos) {
        if (lesson.id === lessonId && lesson.assignment) return lesson.assignment
      }
    }
  }
  if (moduleId) {
    const mod = course.modules.find((m) => m.id === moduleId)
    if (mod?.assignment) return mod.assignment
  }
  return course.assignment
}

export function assignmentKey(scope: AssignmentScope, scopeId: string): string {
  return `${scope}:${scopeId}`
}

export function submissionForAssignment(
  submissions: AssignmentSubmissionRecord[],
  assignment: TrainingAssignment,
): AssignmentSubmissionRecord | undefined {
  return submissions.find(
    (s) => s.scope === assignment.scope && s.scopeId === assignment.scopeId,
  )
}

export function assignmentDisplayStatus(
  assignment: TrainingAssignment | undefined,
  submission: AssignmentSubmissionRecord | undefined,
): ClientAssignment['displayStatus'] {
  if (!assignment) return 'none'
  if (!submission) return 'pending'
  if (submission.status === 'accepted') return 'accepted'
  if (submission.status === 'rejected') return 'rejected'
  if (submission.status === 'reviewed') return 'reviewed'
  return 'submitted'
}

export function isSubmissionSatisfiedForCertificate(
  assignment: TrainingAssignment,
  submission: AssignmentSubmissionRecord | undefined,
): boolean {
  if (!submission) return false
  if (submission.status === 'rejected') return false
  if (assignment.requireAdminAcceptance) {
    return submission.status === 'accepted'
  }
  return ['submitted', 'reviewed', 'accepted'].includes(submission.status)
}

export function getRequiredAssignments(course: TrainingCourse): TrainingAssignment[] {
  return collectCourseAssignments(course).filter((a) => a.requiredForCertificate)
}

export function areRequiredAssignmentsSatisfied(
  course: TrainingCourse,
  submissions: AssignmentSubmissionRecord[],
): { satisfied: boolean; pending: TrainingAssignment[] } {
  const required = getRequiredAssignments(course)
  const pending = required.filter(
    (a) => !isSubmissionSatisfiedForCertificate(a, submissionForAssignment(submissions, a)),
  )
  return { satisfied: pending.length === 0, pending }
}

export function findModuleForLesson(course: TrainingCourse, lessonId: string): TrainingModule | undefined {
  return course.modules.find((m) => m.videos.some((v) => v.id === lessonId))
}

export function findLesson(course: TrainingCourse, lessonId: string): TrainingVideo | undefined {
  for (const mod of course.modules) {
    const lesson = mod.videos.find((v) => v.id === lessonId)
    if (lesson) return lesson
  }
  return undefined
}
