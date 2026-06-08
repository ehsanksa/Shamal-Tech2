/**
 * ClickUp due_date (ms) for the submission instant.
 *
 * Must be paired with `due_date_time: true` on create — when `due_date_time` is false,
 * ClickUp rewrites the value to a fixed midnight offset and list view shows "Tomorrow".
 */
export function clickUpDueDateFromSubmissionMs(submittedAt: Date = new Date()): number {
  return submittedAt.getTime()
}
