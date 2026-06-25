/**
 * Push training platform interest form submissions to ClickUp (BD → Training Platform list).
 * Assignee is configured in admin → Form Notification Settings.
 */

import { createClickUpTask, updateClickUpTask } from './createTask'
import {
  clickUpTaskTitleForTrainingInterest,
  formatTrainingInterestClickUpDescription,
  type TrainingInterestClickUpFields,
} from './formatTrainingInterestTask'
import { getTrainingInterestClickUpAssigneeIds } from './trainingInterestSettings'
import type { FormNotificationSettingsLike } from './trainingInterestSettings'

const API = 'https://api.clickup.com/api/v2'

type TrainingInterestDoc = TrainingInterestClickUpFields & {
  clickupTaskId?: string | null
}

export type PushTrainingInterestToClickUpOptions = {
  formSettings?: FormNotificationSettingsLike | null
}

async function findTrainingInterestTaskByEmail(
  listId: string,
  email: string,
): Promise<{ id: string; url: string } | null> {
  const apiToken = process.env.CLICKUP_API_TOKEN?.trim()
  if (!apiToken) return null

  const needle = email.trim().toLowerCase()
  if (!needle) return null

  try {
    const res = await fetch(
      `${API}/list/${listId}/task?archived=false&include_closed=true&subtasks=true&limit=100`,
      { headers: { Authorization: apiToken } },
    )
    if (!res.ok) {
      console.error('[ClickUp] Failed to search training interest tasks:', res.status)
      return null
    }

    const data = (await res.json()) as {
      tasks?: Array<{ id: string; url?: string; description?: string }>
    }

    for (const task of data.tasks ?? []) {
      const description = String(task.description ?? '').toLowerCase()
      if (description.includes(`email: ${needle}`)) {
        return {
          id: task.id,
          url: task.url || `https://app.clickup.com/t/${task.id}`,
        }
      }
    }
  } catch (err) {
    console.error('[ClickUp] Error searching training interest tasks:', err)
  }

  return null
}

export async function pushTrainingInterestToClickUp(
  doc: TrainingInterestDoc,
  options?: PushTrainingInterestToClickUpOptions,
): Promise<{ id: string; url: string } | null> {
  const listId = process.env.CLICKUP_TRAINING_PLATFORM_LIST_ID?.trim()
  if (!listId) {
    console.error('[ClickUp] Missing CLICKUP_TRAINING_PLATFORM_LIST_ID for training interest form')
    return null
  }

  const assigneeIds = await getTrainingInterestClickUpAssigneeIds(options?.formSettings)
  if (assigneeIds.length === 0) {
    console.error(
      '[ClickUp] No training interest assignee resolved; task will be created without assignees',
    )
  }

  const name = clickUpTaskTitleForTrainingInterest(doc.fullName || 'Unknown')
  const description = formatTrainingInterestClickUpDescription(doc)

  const existingTaskId = doc.clickupTaskId?.trim()
  if (existingTaskId) {
    const updated = await updateClickUpTask({
      taskId: existingTaskId,
      name,
      description,
      assignees: assigneeIds,
    })
    if (updated) return updated
  }

  if (doc.email) {
    const existing = await findTrainingInterestTaskByEmail(listId, doc.email)
    if (existing) {
      const updated = await updateClickUpTask({
        taskId: existing.id,
        name,
        description,
        assignees: assigneeIds,
      })
      if (updated) return updated
    }
  }

  return createClickUpTask({
    name,
    description,
    assignees: assigneeIds.length ? assigneeIds : undefined,
    listId,
  })
}
