'use client'

import type { CourseClientPayload } from '@/lib/training/course-access'
import { cn } from '@/utilities/ui'

type Props = {
  courseId: string
  data: CourseClientPayload
}

export function TrainingCertificateCard({ courseId, data }: Props) {
  if (!data.course.certificateEnabled) return null

  const { certificateAvailable, certificateStatus, certificateBlockMessage } = data

  return (
    <section
      className={cn(
        'rounded-2xl border p-6 shadow-sm',
        certificateAvailable
          ? 'border-success/40 bg-gradient-to-br from-success/10 to-card'
          : 'border-border bg-card',
      )}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Completion certificate</p>

      {certificateAvailable ? (
        <>
          <h3 className="mt-2 font-[family-name:var(--font-rajdhani)] text-2xl font-bold text-foreground">
            Course completed
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You have completed all required lessons for this course.
          </p>
          <a
            href={`/api/training/certificate/${courseId}`}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground sm:w-auto"
          >
            Download certificate
          </a>
        </>
      ) : certificateStatus === 'needs-assignment' ? (
        <>
          <h3 className="mt-2 font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
            Lessons complete
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Submit the required assignment to download your certificate.
            {data.requiredAssignmentsPending.length > 0
              ? ` Pending: ${data.requiredAssignmentsPending.join(', ')}.`
              : ''}
          </p>
        </>
      ) : (
        <>
          <h3 className="mt-2 font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
            Certificate in progress
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {certificateBlockMessage ||
              'Complete all lessons to unlock your Shamal Technologies certificate.'}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            Progress: {data.progressPercent}%
          </p>
        </>
      )}
    </section>
  )
}
