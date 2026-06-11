'use client'

import React, { useState } from 'react'

type ExportFormat = 'xlsx' | 'csv'

export const ExportEventClientsButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsLoading(format)
    setError(null)

    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(
        `${apiBase}/api/event-client-submissions/export?format=${format}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || data?.error || 'Failed to export submissions')
      }

      const blob = await response.blob()
      const contentDisposition = response.headers.get('content-disposition')
      const date = new Date().toISOString().slice(0, 10)
      const fallbackName =
        format === 'csv'
          ? `visitors-form-submissions-${date}.csv`
          : `visitors-form-submissions-${date}.xlsx`
      const fileName = contentDisposition?.match(/filename="(.+)"/)?.[1] || fallbackName

      const downloadUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="payload-field-type">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Download all visitors form submissions. Open any record to use these export buttons.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleExport('xlsx')}
            disabled={isLoading !== null}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading === 'xlsx' ? 'Exporting...' : 'Export to Excel (.xlsx)'}
          </button>
          <button
            type="button"
            onClick={() => void handleExport('csv')}
            disabled={isLoading !== null}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {isLoading === 'csv' ? 'Exporting...' : 'Export to CSV (.csv)'}
          </button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}

export default ExportEventClientsButton
