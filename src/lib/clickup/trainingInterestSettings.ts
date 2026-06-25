import {
  CLICKUP_ASSIGNEE_TRAINING_INTEREST_DEFAULT_EMAIL,
  getTrainingInterestFormAssigneeId,
} from './assignees'

type FormNotificationSettingsLike = {
  trainingFormClickUpAssigneeEmail?: string | null
}

export function resolveTrainingInterestClickUpAssigneeEmail(
  settings?: FormNotificationSettingsLike | null,
): string {
  const email = settings?.trainingFormClickUpAssigneeEmail?.trim()
  return email || CLICKUP_ASSIGNEE_TRAINING_INTEREST_DEFAULT_EMAIL
}

export async function getTrainingInterestClickUpAssigneeIds(
  settings?: FormNotificationSettingsLike | null,
): Promise<number[]> {
  const email = resolveTrainingInterestClickUpAssigneeEmail(settings)
  const id = await getTrainingInterestFormAssigneeId(email)
  return id ? [id] : []
}
