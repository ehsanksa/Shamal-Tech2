'use client'

import { useCallback, useEffect, useState } from 'react'

export type TrainingUser = {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  warmLead: boolean
}

/**
 * Client hook: loads /api/training/auth/me (ClickUp-backed role).
 */
export function useTrainingUser() {
  const [user, setUser] = useState<TrainingUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const res = await fetch('/api/training/auth/me', { credentials: 'include' })
    const data = (await res.json()) as { user: TrainingUser | null }
    setUser(data.user)
    return data.user
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  return { user, loading, refresh, setUser }
}
