'use client'

import { useState } from 'react'

import type { ClientAssignmentPayload } from '@/lib/training/course-access'
import { cn } from '@/utilities/ui'

const STATUS_LABELS: Record<ClientAssignmentPayload['displayStatus'], string> = {
  none: 'No assignment',
  pending: 'Assignment pending',
  submitted: 'Submitted',
  reviewed: 'Under review',
  accepted: 'Accepted',
  rejected: 'Rejected — please resubmit',
}

type Props = {
  courseId: string
  assignment: ClientAssignmentPayload
  onSubmitted: () => void
}

export function TrainingAssignmentCard({ courseId, assignment, onSubmitted }: Props) {
  const [textAnswer, setTextAnswer] = useState(assignment.submission?.textAnswer || '')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const showText =
    assignment.submissionType === 'text' || assignment.submissionType === 'both'
  const showFile =
    assignment.submissionType === 'file' || assignment.submissionType === 'both'
  const canSubmit = assignment.displayStatus === 'pending' || assignment.displayStatus === 'rejected'
  const isLocked = !canSubmit

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('courseId', courseId)
      formData.append('scope', assignment.scope)
      formData.append('scopeId', assignment.scopeId)
      if (textAnswer.trim()) formData.append('textAnswer', textAnswer.trim())
      if (file) formData.append('file', file)

      const res = await fetch('/api/training/assignments/submit', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const json = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) {
        setError(json?.error || 'Submission failed')
        return
      }
      setSuccess('Assignment submitted successfully.')
      onSubmitted()
    } catch {
      setError('Could not submit assignment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Course assignment</p>
          <h3 className="mt-1 font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
            {assignment.title}
          </h3>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            assignment.displayStatus === 'accepted' && 'bg-success/15 text-success',
            assignment.displayStatus === 'submitted' && 'bg-secondary/15 text-secondary',
            assignment.displayStatus === 'reviewed' && 'bg-warning/15 text-foreground',
            assignment.displayStatus === 'rejected' && 'bg-destructive/15 text-destructive',
            assignment.displayStatus === 'pending' && 'bg-muted text-muted-foreground',
          )}
        >
          {STATUS_LABELS[assignment.displayStatus]}
        </span>
      </div>

      {assignment.instructions ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {assignment.instructions}
        </p>
      ) : null}

      {assignment.referenceFileUrl ? (
        <p className="mt-3 text-sm">
          <a
            href={assignment.referenceFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-secondary hover:underline"
          >
            Download assignment reference file
          </a>
        </p>
      ) : null}

      {assignment.dueDate ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Due {new Date(assignment.dueDate).toLocaleDateString()}
        </p>
      ) : null}

      {assignment.requiredForCertificate ? (
        <p className="mt-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground">
          Required for certificate
          {assignment.requireAdminAcceptance
            ? ' — admin acceptance required after submission.'
            : ' — submit before downloading your certificate.'}
        </p>
      ) : null}

      {assignment.submission?.adminRemarks ? (
        <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">
          <span className="font-medium">Instructor remarks: </span>
          {assignment.submission.adminRemarks}
        </p>
      ) : null}

      {assignment.submission?.submittedFileUrl ? (
        <p className="mt-3 text-sm">
          <a
            href={assignment.submission.submittedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-secondary hover:underline"
          >
            View your submitted file
          </a>
        </p>
      ) : null}

      {assignment.submission?.submittedAt && isLocked ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Submitted {new Date(assignment.submission.submittedAt).toLocaleString()}
        </p>
      ) : null}

      {canSubmit ? (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {success ? <p className="text-sm text-success">{success}</p> : null}
          {showText ? (
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="assignment-text">
                Your response
              </label>
              <textarea
                id="assignment-text"
                required={showText && !showFile}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          ) : null}
          {showFile ? (
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="assignment-file">
                Upload file
              </label>
              <input
                id="assignment-file"
                type="file"
                required={showFile && !assignment.submission?.submittedFileUrl}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full text-sm"
              />
            </div>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit assignment'}
          </button>
        </form>
      ) : null}
    </section>
  )
}
