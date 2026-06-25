import {
  CLICKUP_ASSIGNEE_TRAINING_INTEREST_DEFAULT_EMAIL,
  resolveClickUpUserIdByEmail,
} from './assignees'

export type TrainingFormClickUpAssigneeRow = {
  email?: string | null
  id?: string | null
}

export type FormNotificationSettingsLike = {
  trainingFormClickUpAssignees?: TrainingFormClickUpAssigneeRow[] | null
  /** @deprecated Legacy single assignee — migrated automatically when reading */
  trainingFormClickUpAssigneeEmail?: string | null
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Emails configured in admin for training interest ClickUp tasks. */
export function resolveTrainingInterestClickUpAssigneeEmails(
  settings?: FormNotificationSettingsLike | null,
): string[] {
  const fromArray = (settings?.trainingFormClickUpAssignees ?? [])
    .map((row) => row?.email?.trim())
    .filter((email): email is string => Boolean(email && isValidEmail(email)))

  if (fromArray.length > 0) {
    return [...new Set(fromArray.map(normalizeEmail))]
  }

  const legacy = settings?.trainingFormClickUpAssigneeEmail?.trim()
  if (legacy && isValidEmail(legacy)) {
    return [normalizeEmail(legacy)]
  }

  return [normalizeEmail(CLICKUP_ASSIGNEE_TRAINING_INTEREST_DEFAULT_EMAIL)]
}

export async function getTrainingInterestClickUpAssigneeIds(
  settings?: FormNotificationSettingsLike | null,
): Promise<number[]> {
  const emails = resolveTrainingInterestClickUpAssigneeEmails(settings)
  const ids: number[] = []

  for (const email of emails) {
    const id = await resolveClickUpUserIdByEmail(email)
    if (id) {
      ids.push(id)
    } else {
      console.error(`[ClickUp] Could not resolve training interest assignee for ${email}`)
    }
  }

  return [...new Set(ids.filter((id) => id > 0))]
}
