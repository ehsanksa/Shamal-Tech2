'use client'

import React, { useCallback, useEffect, useState } from 'react'

type AssigneeRow = {
  email: string
}

export const ClickUpAssigneeSettings: React.FC = () => {
  const [assignees, setAssignees] = useState<AssigneeRow[]>([{ email: '' }])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${apiBase}/api/globals/form-notification-settings`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to load ClickUp assignee settings')
      const data = (await res.json()) as {
        trainingFormClickUpAssignees?: Array<{ email?: string | null }>
        trainingFormClickUpAssigneeEmail?: string | null
      }

      const rows = (data.trainingFormClickUpAssignees ?? [])
        .map((row) => ({ email: row.email?.trim() || '' }))
        .filter((row) => row.email)

      if (rows.length === 0 && data.trainingFormClickUpAssigneeEmail?.trim()) {
        rows.push({ email: data.trainingFormClickUpAssigneeEmail.trim() })
      }

      setAssignees(rows.length > 0 ? rows : [{ email: 'k.shami@shamal.sa' }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateEmail = (index: number, email: string) => {
    setAssignees((rows) => rows.map((row, i) => (i === index ? { email } : row)))
  }

  const addRow = () => {
    setAssignees((rows) => [...rows, { email: '' }])
  }

  const removeRow = (index: number) => {
    setAssignees((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== index)))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)

    const cleaned = assignees
      .map((row) => ({ email: row.email.trim() }))
      .filter((row) => row.email)

    if (cleaned.length === 0) {
      setError('Add at least one ClickUp assignee email.')
      setSaving(false)
      return
    }

    const invalid = cleaned.find((row) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
    if (invalid) {
      setError(`Invalid email: ${invalid.email}`)
      setSaving(false)
      return
    }

    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${apiBase}/api/globals/form-notification-settings`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainingFormClickUpAssignees: cleaned,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(body?.message || 'Failed to save ClickUp assignees')
      }
      setAssignees(cleaned)
      setMessage('ClickUp assignees saved. New submissions will use these emails.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        marginBottom: '1rem',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ marginBottom: '0.75rem' }}>
        <strong style={{ fontSize: '0.9375rem' }}>ClickUp task assignees</strong>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--theme-elevation-500)' }}>
          Every training interest submission creates a ClickUp task assigned to these workspace members.
          Add or remove emails without code changes.
        </p>
      </div>

      {loading ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500)' }}>Loading assignees…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {assignees.map((row, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="email"
                value={row.email}
                onChange={(e) => updateEmail(index, e.target.value)}
                placeholder="name@shamal.sa"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--theme-elevation-200)',
                  background: 'var(--theme-elevation-0)',
                  fontSize: '0.875rem',
                }}
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={assignees.length <= 1}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--theme-elevation-200)',
                  background: 'var(--theme-elevation-0)',
                  fontSize: '0.8125rem',
                  cursor: assignees.length <= 1 ? 'not-allowed' : 'pointer',
                  opacity: assignees.length <= 1 ? 0.5 : 1,
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={addRow}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--theme-elevation-200)',
                background: 'var(--theme-elevation-0)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              + Add assignee
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                background: 'var(--theme-elevation-800)',
                color: 'var(--theme-elevation-0)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save assignees'}
            </button>
          </div>

          {message && (
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--theme-success-500)' }}>{message}</p>
          )}
          {error && (
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--theme-error-500)' }}>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ClickUpAssigneeSettings
