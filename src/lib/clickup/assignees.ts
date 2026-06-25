/**
 * ClickUp task assignees — resolve workspace member IDs by email.
 * @see https://developer.clickup.com/reference/getauthorizedteams
 */

const API = 'https://api.clickup.com/api/v2'

export const CLICKUP_ASSIGNEE_CONTACT_EMAIL = 'r.mohammed@shamal.sa'
export const CLICKUP_ASSIGNEE_QUOTE_EMAIL = 'k.shami@shamal.sa'
export const CLICKUP_ASSIGNEE_TRAINING_INTEREST_DEFAULT_EMAIL = 'k.shami@shamal.sa'

const emailToUserIdCache = new Map<string, number>()

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function parseUserId(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw
  if (typeof raw === 'string' && raw.trim()) {
    const n = Number(raw)
    if (Number.isFinite(n) && n > 0) return n
  }
  return null
}

function getApiToken(): string | null {
  return process.env.CLICKUP_API_TOKEN?.trim() || null
}

async function loadWorkspaceMemberIds(apiToken: string): Promise<void> {
  const res = await fetch(`${API}/team`, {
    headers: { Authorization: apiToken },
  })
  if (!res.ok) {
    throw new Error(`ClickUp teams API ${res.status}: ${await res.text().catch(() => '')}`)
  }

  const data = (await res.json()) as {
    teams?: Array<{
      members?: Array<{ user?: { id?: unknown; email?: string } }>
    }>
  }

  for (const team of data.teams || []) {
    for (const member of team.members || []) {
      const email = member.user?.email
      const userId = parseUserId(member.user?.id)
      if (email && userId) {
        emailToUserIdCache.set(normalizeEmail(email), userId)
      }
    }
  }
}

/** Resolve a ClickUp user ID from email (cached per process). */
export async function resolveClickUpUserIdByEmail(email: string): Promise<number | null> {
  const normalized = normalizeEmail(email)
  if (emailToUserIdCache.has(normalized)) {
    return emailToUserIdCache.get(normalized) ?? null
  }

  const apiToken = getApiToken()
  if (!apiToken) return null

  try {
    await loadWorkspaceMemberIds(apiToken)
    return emailToUserIdCache.get(normalized) ?? null
  } catch (err) {
    console.error('[ClickUp] Failed to resolve user by email:', err)
    return null
  }
}

function userIdFromEnv(envKey: string): number | null {
  return parseUserId(process.env[envKey])
}

async function resolveAssigneeId(emailEnvKey: string, defaultEmail: string, userIdEnvKey: string): Promise<number | null> {
  const fromEnv = userIdFromEnv(userIdEnvKey)
  if (fromEnv) return fromEnv

  const email = process.env[emailEnvKey]?.trim() || defaultEmail
  const id = await resolveClickUpUserIdByEmail(email)
  if (!id) {
    console.error(`[ClickUp] Could not resolve assignee user ID for ${email}. Set ${userIdEnvKey} in .env`)
  }
  return id
}

/** Assignee for /contact form leads. */
export function getContactFormAssigneeId(): Promise<number | null> {
  return resolveAssigneeId(
    'CLICKUP_ASSIGNEE_CONTACT_EMAIL',
    CLICKUP_ASSIGNEE_CONTACT_EMAIL,
    'CLICKUP_ASSIGNEE_CONTACT_USER_ID',
  )
}

/** Assignee for product quote cart RFQs. */
export function getQuoteRequestAssigneeId(): Promise<number | null> {
  return resolveAssigneeId(
    'CLICKUP_ASSIGNEE_QUOTE_EMAIL',
    CLICKUP_ASSIGNEE_QUOTE_EMAIL,
    'CLICKUP_ASSIGNEE_QUOTE_USER_ID',
  )
}

/**
 * Assignee for Training Platform Interest Form submissions (/training/interest).
 * Email comes from admin Form Notification Settings unless overridden.
 */
export async function getTrainingInterestFormAssigneeId(
  assigneeEmail?: string | null,
): Promise<number | null> {
  const email =
    assigneeEmail?.trim() ||
    process.env.CLICKUP_ASSIGNEE_TRAINING_INTEREST_EMAIL?.trim() ||
    CLICKUP_ASSIGNEE_TRAINING_INTEREST_DEFAULT_EMAIL

  const fromEnv = userIdFromEnv('CLICKUP_ASSIGNEE_TRAINING_INTEREST_USER_ID')
  if (fromEnv) return fromEnv

  const id = await resolveClickUpUserIdByEmail(email)
  if (!id) {
    console.error(
      `[ClickUp] Could not resolve training interest assignee for ${email}. Set CLICKUP_ASSIGNEE_TRAINING_INTEREST_USER_ID in .env`,
    )
  }
  return id
}

async function fetchClickUpTaskAssigneeIds(taskId: string): Promise<number[]> {
  const apiToken = getApiToken()
  if (!apiToken || !taskId) return []

  try {
    const res = await fetch(`${API}/task/${taskId}`, {
      headers: { Authorization: apiToken },
    })
    if (!res.ok) return []

    const data = (await res.json()) as {
      assignees?: Array<{ id?: unknown }>
    }
    return (data.assignees ?? [])
      .map((a) => parseUserId(a.id))
      .filter((id): id is number => id !== null)
  } catch {
    return []
  }
}

/** Set exact assignees on a task (removes others, adds missing). */
export async function syncClickUpTaskAssignees(
  taskId: string,
  assigneeIds: number[],
): Promise<boolean> {
  const apiToken = getApiToken()
  const desired = [...new Set(assigneeIds.filter((id) => id > 0))]
  if (!apiToken || !taskId) return false

  const current = await fetchClickUpTaskAssigneeIds(taskId)
  const toRemove = current.filter((id) => !desired.includes(id))
  const toAdd = desired.filter((id) => !current.includes(id))

  let anySuccess = desired.length === 0

  for (const id of toRemove) {
    try {
      const res = await fetch(`${API}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignees: { rem: [id] } }),
      })
      if (res.ok) anySuccess = true
      else {
        console.error(
          `[ClickUp] Failed to unassign user ${id} from task ${taskId}:`,
          res.status,
          await res.text().catch(() => ''),
        )
      }
    } catch (err) {
      console.error(`[ClickUp] Unassign user ${id} from task ${taskId} error:`, err)
    }
  }

  for (const id of toAdd) {
    try {
      const res = await fetch(`${API}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignees: { add: [id] } }),
      })
      if (res.ok) anySuccess = true
      else {
        console.error(
          `[ClickUp] Failed to assign user ${id} to task ${taskId}:`,
          res.status,
          await res.text().catch(() => ''),
        )
      }
    } catch (err) {
      console.error(`[ClickUp] Assign user ${id} to task ${taskId} error:`, err)
    }
  }

  if (desired.length > 0 && toAdd.length === 0 && toRemove.length === 0) {
    return current.length > 0 && desired.every((id) => current.includes(id))
  }

  return anySuccess
}

/** Ensure assignees are on a task (PUT add per user — partial success is allowed). */
export async function ensureClickUpTaskAssignees(taskId: string, assigneeIds: number[]): Promise<boolean> {
  const apiToken = getApiToken()
  const ids = [...new Set(assigneeIds.filter((id) => id > 0))]
  if (!apiToken || !ids.length || !taskId) return false

  let anySuccess = false

  for (const id of ids) {
    try {
      const res = await fetch(`${API}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignees: { add: [id] },
        }),
      })
      if (res.ok) {
        anySuccess = true
      } else {
        console.error(
          `[ClickUp] Failed to assign user ${id} to task ${taskId}:`,
          res.status,
          await res.text().catch(() => ''),
        )
      }
    } catch (err) {
      console.error(`[ClickUp] Assign user ${id} to task ${taskId} error:`, err)
    }
  }

  return anySuccess
}
