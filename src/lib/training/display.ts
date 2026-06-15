import type { TrainingRole } from './types'

/** User-facing access label — never expose internal role names in UI. */
export function accessLabel(role: TrainingRole): string {
  if (role === 'admin') return 'Academy administrator'
  return 'Full enrollment'
}

/** Registered academy students can access the full curriculum. */
export function hasFullCourseAccess(_role: TrainingRole): boolean {
  return true
}
