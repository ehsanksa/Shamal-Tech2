import {
  areRequiredAssignmentsSatisfied,
  type AssignmentSubmissionRecord,
} from './assignments'
import type { TrainingCourse } from './courses'

export type CertificateEligibility = {
  eligible: boolean
  lessonsComplete: boolean
  assignmentsSatisfied: boolean
  certificateEnabled: boolean
  pendingAssignmentTitles: string[]
  blockMessage?: string
}

/** Certificate: all lessons complete + required assignments (if any). No enrollment gate. */
export function evaluateCertificateEligibility(input: {
  course: TrainingCourse
  progressPercent: number
  completed: boolean
  submissions: AssignmentSubmissionRecord[]
}): CertificateEligibility {
  const { course, progressPercent, completed, submissions } = input
  const lessonsComplete = completed || progressPercent >= 100
  const { satisfied: assignmentsSatisfied, pending } = areRequiredAssignmentsSatisfied(
    course,
    submissions,
  )

  let blockMessage: string | undefined
  if (!course.certificateEnabled) {
    blockMessage = 'This course does not issue a completion certificate.'
  } else if (!lessonsComplete) {
    blockMessage = 'Complete all lessons to download your certificate.'
  } else if (!assignmentsSatisfied) {
    blockMessage = 'Submit the required assignment to download your certificate.'
  }

  const eligible = course.certificateEnabled && lessonsComplete && assignmentsSatisfied

  return {
    eligible,
    lessonsComplete,
    assignmentsSatisfied,
    certificateEnabled: course.certificateEnabled,
    pendingAssignmentTitles: pending.map((a) => a.title),
    blockMessage,
  }
}
