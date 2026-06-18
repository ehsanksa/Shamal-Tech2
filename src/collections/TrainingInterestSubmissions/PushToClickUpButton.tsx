'use client'

import React, { useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const PushToClickUpButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const [pushed, setPushed] = useState(false)
  const [taskUrl, setTaskUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fields = useFormFields(([fields]) => ({
    pushedToClickUp: (fields?.pushedToClickUp?.value as boolean) ?? false,
    clickupTaskUrl: (fields?.clickupTaskUrl?.value as string) ?? null,
  }))

  const alreadyPushed = pushed || fields?.pushedToClickUp
  const displayUrl = taskUrl || fields?.clickupTaskUrl

  const handlePush = async () => {
    if (!id) {
      setError('Save the submission first to push to ClickUp.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${apiBase}/api/training-interest-submissions/${id}/push-to-clickup`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || data.errors?.[0]?.message || 'Failed to push to ClickUp')
        return
      }
      if (data.alreadyPushed) {
        setPushed(true)
        if (data.clickupTaskUrl) setTaskUrl(data.clickupTaskUrl)
      } else {
        setPushed(true)
        if (data.taskUrl) setTaskUrl(data.taskUrl)
      }
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payload-field-type">
      <div className="flex flex-col gap-2">
        {alreadyPushed ? (
          <>
            <p className="text-sm text-muted-foreground">This submission is synced to ClickUp.</p>
            {displayUrl && (
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                Open task in ClickUp →
              </a>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Create a task in ClickUp (BD → Training Platform list).
            </p>
            <button
              type="button"
              onClick={handlePush}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Pushing…' : 'Push to ClickUp'}
            </button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}

export default PushToClickUpButton
