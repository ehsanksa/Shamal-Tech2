import type { CourseClientPayload } from './course-access'
import type { TrainingCourse } from './courses'
import { evaluateCertificateEligibility } from './certificate-eligibility'

export type CourseSimState =
  | 'zero'
  | 'partial'
  | 'complete'
  | 'cert-ready'
  | 'assignment-required'
  | 'assignment-submitted'

const VALID: CourseSimState[] = [
  'zero',
  'partial',
  'complete',
  'cert-ready',
  'assignment-required',
  'assignment-submitted',
]

export function parseCourseSimState(value: string | null): CourseSimState | null {
  if (!value || process.env.NODE_ENV !== 'development') return null
  return VALID.includes(value as CourseSimState) ? (value as CourseSimState) : null
}

export function applyCourseSimState(
  payload: CourseClientPayload,
  simState: CourseSimState,
  course: TrainingCourse,
): CourseClientPayload {
  const allLessonIds = course.modules.flatMap((m) => m.videos.map((v) => v.id))
  let watchedIds: string[] = []

  if (simState === 'zero') {
    watchedIds = []
  } else if (simState === 'partial') {
    watchedIds = allLessonIds.slice(0, Math.max(1, Math.floor(allLessonIds.length / 2)))
  } else {
    watchedIds = [...allLessonIds]
  }

  const mockAssignment = {
    enabled: true as const,
    scope: 'course' as const,
    scopeId: course.id,
    title: 'Field operations reflection (simulated)',
    instructions: 'Simulated assignment for UI testing in development.',
    submissionType: 'text' as const,
    requiredForCertificate: true,
    requireAdminAcceptance: false,
  }

  const mockSubmissions =
    simState === 'assignment-submitted'
      ? [{ scope: 'course' as const, scopeId: course.id, status: 'submitted' as const }]
      : []

  const progressPercent =
    allLessonIds.length === 0
      ? 0
      : Math.round((watchedIds.length / allLessonIds.length) * 100)
  const allLessonsComplete = allLessonIds.length > 0 && watchedIds.length === allLessonIds.length

  const eligibility = evaluateCertificateEligibility({
    course: {
      ...course,
      assignment:
        simState === 'assignment-required' || simState === 'assignment-submitted'
          ? mockAssignment
          : course.assignment,
    },
    progressPercent,
    completed: allLessonsComplete,
    submissions: mockSubmissions,
  })

  const effectiveAssignment =
    simState === 'assignment-required' || simState === 'assignment-submitted'
      ? {
          ...mockAssignment,
          submission:
            simState === 'assignment-submitted'
              ? {
                  scope: 'course' as const,
                  scopeId: course.id,
                  status: 'submitted' as const,
                  submittedAt: new Date().toISOString(),
                  textAnswer: 'Simulated submission for development testing.',
                }
              : null,
          displayStatus:
            simState === 'assignment-submitted'
              ? ('submitted' as const)
              : ('pending' as const),
        }
      : payload.effectiveAssignment

  return {
    ...payload,
    progressPercent,
    watchedVideoIds: watchedIds,
    completed: allLessonsComplete,
    certificateAvailable: eligibility.eligible,
    certificateStatus: eligibility.eligible
      ? 'available'
      : !eligibility.assignmentsSatisfied && eligibility.lessonsComplete
        ? 'needs-assignment'
        : 'needs-lessons',
    certificateBlockMessage: eligibility.eligible ? undefined : eligibility.blockMessage,
    effectiveAssignment,
    requiredAssignmentsPending: eligibility.pendingAssignmentTitles,
    simState,
  }
}
