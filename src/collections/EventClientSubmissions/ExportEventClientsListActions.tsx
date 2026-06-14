'use client'

import React, { useState } from 'react'

import {
  downloadEventClientSubmissions,
  type ExportFormat,
} from './exportSubmissions'

export const ExportEventClientsListActions: React.FC = () => {
  const [isLoading, setIsLoading] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsLoading(format)
    setError(null)

    try {
      await downloadEventClientSubmissions(format)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}
    >
      <span style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-500)' }}>
        Export all visitors:
      </span>
      <button
        type="button"
        onClick={() => void handleExport('xlsx')}
        disabled={isLoading !== null}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.375rem',
          backgroundColor: 'var(--theme-elevation-800)',
          color: 'var(--theme-elevation-0)',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          border: 'none',
          cursor: isLoading !== null ? 'not-allowed' : 'pointer',
          opacity: isLoading !== null ? 0.6 : 1,
        }}
      >
        {isLoading === 'xlsx' ? 'Exporting...' : 'Excel (.xlsx)'}
      </button>
      <button
        type="button"
        onClick={() => void handleExport('csv')}
        disabled={isLoading !== null}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.375rem',
          backgroundColor: 'var(--theme-elevation-100)',
          color: 'var(--theme-elevation-800)',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          border: '1px solid var(--theme-elevation-200)',
          cursor: isLoading !== null ? 'not-allowed' : 'pointer',
          opacity: isLoading !== null ? 0.6 : 1,
        }}
      >
        {isLoading === 'csv' ? 'Exporting...' : 'CSV (.csv)'}
      </button>
      {error && (
        <span style={{ fontSize: '0.875rem', color: 'var(--theme-error-500)' }}>{error}</span>
      )}
    </div>
  )
}

export default ExportEventClientsListActions
