import type { TrainingRole } from './types'

/** Normalize ClickUp / legacy labels ("Paid User") to app roles. */
export function normalizeRole(raw: string | undefined | null): TrainingRole {
  const r = String(raw || '')
    .toLowerCase()
    .trim()
  if (r.includes('admin')) return 'admin'
  return 'student'
}
