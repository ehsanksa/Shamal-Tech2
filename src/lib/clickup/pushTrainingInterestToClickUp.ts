/**
 * Push training platform interest form submissions to ClickUp (BD → Training Platform list).
 */

import { getContactFormAssigneeId } from './assignees'
import { createClickUpTask } from './createTask'
import {
  clickUpTaskTitleForTrainingInterest,
  formatTrainingInterestClickUpDescription,
  type TrainingInterestClickUpFields,
} from './formatTrainingInterestTask'

export async function pushTrainingInterestToClickUp(
  doc: TrainingInterestClickUpFields,
): Promise<{ id: string; url: string } | null> {
  const listId = process.env.CLICKUP_TRAINING_PLATFORM_LIST_ID?.trim()
  if (!listId) {
    console.error('[ClickUp] Missing CLICKUP_TRAINING_PLATFORM_LIST_ID for training interest form')
    return null
  }

  const assigneeId = await getContactFormAssigneeId()
  return createClickUpTask({
    name: clickUpTaskTitleForTrainingInterest(doc.fullName || 'Unknown', doc.organization),
    description: formatTrainingInterestClickUpDescription(doc),
    assignees: assigneeId ? [assigneeId] : undefined,
    listId,
  })
}
