/**
 * ClickUp task assignees — resolve workspace member IDs by email.
 * @see https://developer.clickup.com/reference/getauthorizedteams
 */

const API = 'https://api.clickup.com/api/v2'

export const CLICKUP_ASSIGNEE_CONTACT_EMAIL = 'r.mohammed@shamal.sa'
export const CLICKUP_ASSIGNEE_QUOTE_EMAIL = 'k.shami@shamal.sa'

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

/** Ensure assignees are on a task (PUT add — safe if already assigned). */
export async function ensureClickUpTaskAssignees(taskId: string, assigneeIds: number[]): Promise<boolean> {
  const apiToken = getApiToken()
  const ids = [...new Set(assigneeIds.filter((id) => id > 0))]
  if (!apiToken || !ids.length || !taskId) return false

  try {
    const res = await fetch(`${API}/task/${taskId}`, {
      method: 'PUT',
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignees: { add: ids },
      }),
    })
    if (!res.ok) {
      console.error(
        `[ClickUp] Failed to assign task ${taskId}:`,
        res.status,
        await res.text().catch(() => ''),
      )
      return false
    }
    return true
  } catch (err) {
    console.error('[ClickUp] Assign task error:', err)
    return false
  }
}
