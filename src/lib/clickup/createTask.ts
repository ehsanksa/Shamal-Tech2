/**
 * ClickUp API - Create Task
 *
 * Creates a task in the ClickUp Sales Pipeline.
 * Used by the Leads afterChange hook for website-originated leads.
 *
 * @see https://developer.clickup.com/reference/createtask
 */

import { syncClickUpTaskAssignees } from './assignees'
import { clickUpDueDateFromSubmissionMs } from './dueDate'

export interface CreateClickUpTaskParams {
  name: string
  description: string
  /** ClickUp workspace member user IDs */
  assignees?: number[]
  /** Override default CLICKUP_LIST_ID (e.g. Training Platform list in BD) */
  listId?: string
  /** List status name, e.g. "New Request" */
  status?: string
  /** ClickUp priority: 1 urgent, 2 high, 3 normal, 4 low */
  priority?: 1 | 2 | 3 | 4
  /** Due date in unix ms */
  dueDateMs?: number
  customFields?: Array<{ id: string; value: unknown }>
}

export interface CreateClickUpTaskResult {
  id: string
  url: string
}

export interface UpdateClickUpTaskParams {
  taskId: string
  name: string
  description: string
  assignees?: number[]
}

/**
 * Updates an existing ClickUp task.
 * NEVER throws - all errors are caught and logged.
 */
export async function updateClickUpTask(
  params: UpdateClickUpTaskParams,
): Promise<CreateClickUpTaskResult | null> {
  const apiToken = process.env.CLICKUP_API_TOKEN
  const taskId = params.taskId?.trim()

  if (!apiToken || !taskId) {
    console.error('[ClickUp] Missing CLICKUP_API_TOKEN or task ID for update')
    return null
  }

  const assigneeIds = params.assignees?.filter((id) => id > 0) ?? []

  try {
    const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: 'PUT',
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: params.name,
        description: params.description,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[ClickUp] Update API error ${response.status}: ${response.statusText}`, errorBody)
      return null
    }

    const data = (await response.json()) as {
      id?: string
      url?: string
    }

    if (assigneeIds.length) {
      await syncClickUpTaskAssignees(taskId, assigneeIds)
    }

    const taskUrl = data.url || `https://app.clickup.com/t/${taskId}`
    return { id: taskId, url: taskUrl }
  } catch (error) {
    console.error('[ClickUp] Failed to update task:', error)
    return null
  }
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
  const listId = params.listId?.trim() || process.env.CLICKUP_LIST_ID?.trim()

  if (!apiToken || !listId) {
    console.error('[ClickUp] Missing CLICKUP_API_TOKEN or list ID')
    return null
  }

  const assigneeIds = params.assignees?.filter((id) => id > 0) ?? []

  const buildBody = (includeStatus: boolean) => {
    const body: Record<string, unknown> = {
      name: params.name,
      description: params.description,
      due_date: params.dueDateMs ?? clickUpDueDateFromSubmissionMs(),
      due_date_time: Boolean(params.dueDateMs),
      // Assignees are added after creation via syncClickUpTaskAssignees.
      // BD space rejects multiple assignees on POST (ITEM_417).
    }
    if (includeStatus && params.status?.trim()) {
      body.status = params.status.trim()
    }
    if (params.priority) {
      body.priority = params.priority
    }
    if (params.customFields?.length) {
      body.custom_fields = params.customFields
    }
    return body
  }

  try {
    let response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildBody(true)),
    })

    // Retry without status if the list does not define "New Request"
    if (!response.ok && params.status?.trim()) {
      const errorBody = await response.text()
      console.warn(
        `[ClickUp] Create with status failed (${response.status}); retrying without status:`,
        errorBody,
      )
      response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
        method: 'POST',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildBody(false)),
      })
    }

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
      const assigned = await syncClickUpTaskAssignees(taskId, assigneeIds)
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
