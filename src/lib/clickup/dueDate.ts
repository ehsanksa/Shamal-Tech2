/**
 * ClickUp due_date (ms) for the submission instant.
 * Paired with `due_date_time: false` so the task shows a date-only due date (Today / Tomorrow).
 */
export function clickUpDueDateFromSubmissionMs(submittedAt: Date = new Date()): number {
  return submittedAt.getTime()
}
