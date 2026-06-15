import { findUserByEmail, TRAINING_CLICKUP_FIELDS as FIELD } from './repository'
import { normalizeRole } from './role'
import { getTrainingSession } from './session'
import type { TrainingRole } from './types'

export type TrainingProfile = {
  id: string
  email: string
  name: string
  role: TrainingRole
  warmLead: boolean
}

/**
 * Authoritative user profile from Payload or ClickUp + session identity.
 */
export async function getCurrentTrainingProfile(): Promise<TrainingProfile | null> {
  const session = await getTrainingSession()
  if (!session) return null
  const record = await findUserByEmail(session.email)
  if (!record) return null
  return {
    id: record.id,
    email: session.email,
    name: String(record.fields[FIELD.name as keyof typeof record.fields] || session.name),
    role: normalizeRole(String(record.fields[FIELD.role as keyof typeof record.fields])),
    warmLead: Boolean(record.fields[FIELD.warmLead as keyof typeof record.fields]),
  }
}
