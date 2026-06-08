/**
 * ClickUp API - Create Task
 *
 * Creates a task in the ClickUp Sales Pipeline.
 * Used by the Leads afterChange hook for website-originated leads.
 *
 * @see https://developer.clickup.com/reference/createtask
 */

import { ensureClickUpTaskAssignees } from './assignees'

export interface CreateClickUpTaskParams {
  name: string
  description: string
  /** ClickUp workspace member user IDs */
  assignees?: number[]
}

export interface CreateClickUpTaskResult {
  id: string
  url: string
}

/**
 * Creates a task in ClickUp.
 * Returns task ID and URL, or null if creation fails.
 * NEVER throws - all errors are caught and logged.
 */
export async function createClickUpTask(
  params: CreateClickUpTaskParams,
): Promise<CreateClickUpTaskResult | null> {
  const apiToken = process.env.CLICKUP_API_TOKEN
  const listId = process.env.CLICKUP_LIST_ID

  if (!apiToken || !listId) {
    console.error('[ClickUp] Missing CLICKUP_API_TOKEN or CLICKUP_LIST_ID')
    return null
  }

  const assigneeIds = params.assignees?.filter((id) => id > 0) ?? []

  try {
    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        ...(assigneeIds.length ? { assignees: assigneeIds } : {}),
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[ClickUp] API error ${response.status}: ${response.statusText}`, errorBody)
      return null
    }

    const data = (await response.json()) as {
      id?: string
      url?: string
      task?: { id?: string; url?: string }
    }
    const task = data.task ?? data
    const taskId = task.id
    if (!taskId) {
      console.error('[ClickUp] Response missing task id:', JSON.stringify(data))
      return null
    }

    if (assigneeIds.length) {
      const assigned = await ensureClickUpTaskAssignees(taskId, assigneeIds)
      if (!assigned) {
        console.error(`[ClickUp] Task ${taskId} created but assignees were not applied`, assigneeIds)
      }
    }

    const taskUrl = task.url || `https://app.clickup.com/t/${taskId}`
    return { id: taskId, url: taskUrl }
  } catch (error) {
    console.error('[ClickUp] Failed to create task:', error)
    return null
  }
}
