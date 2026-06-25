'use client'

import { useCallback, useEffect, useState } from 'react'

type StatusResponse = {
  scheduleCron: string
  scheduleDescription: string
  nextScheduledBackup: string
  status: null | {
    lastSuccess: null | { at: string; s3Key: string; sizeBytes: number; trigger: string }
    lastFailure: null | { at: string; message: string; trigger: string }
    recentAttempts: Array<{
      at: string
      ok: boolean
      message: string
      trigger: string
      s3Key?: string
      sizeBytes?: number
    }>
  }
  storageHealth: null | {
    at: string
    ok: boolean
    s3Key?: string
    sizeBytes?: number
    error?: string
  }
}

type ListResponse = {
  backups: Array<{ key: string; size: number; lastModified: string }>
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

export default function BackupRecoveryCenter() {
  const [statusPayload, setStatusPayload] = useState<StatusResponse | null>(null)
  const [listPayload, setListPayload] = useState<ListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [sRes, lRes] = await Promise.all([
        fetch('/api/backup/status', { credentials: 'include' }),
        fetch('/api/backup/list', { credentials: 'include' }),
      ])
      if (sRes.status === 401 || lRes.status === 401) {
        setError('Admin sign-in required.')
        return
      }
      if (!sRes.ok) {
        setError((await sRes.json().catch(() => ({})))?.error ?? 'Failed to load status')
        return
      }
      if (!lRes.ok) {
        setError((await lRes.json().catch(() => ({})))?.error ?? 'Failed to load backup list')
        return
      }
      setStatusPayload((await sRes.json()) as StatusResponse)
      setListPayload((await lRes.json()) as ListResponse)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const backupNow = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/backup/run', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Backup failed')
        return
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Backup failed')
    } finally {
      setBusy(false)
    }
  }

  const download = async (key: string) => {
    setError(null)
    try {
      const res = await fetch(
        `/api/backup/download?key=${encodeURIComponent(key)}`,
        { credentials: 'include' },
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Download failed')
        return
      }
      if (data.url) {
        window.open(data.url as string, '_blank', 'noopener,noreferrer')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed')
    }
  }

  const remove = async (key: string) => {
    const fileName = key.split('/').pop() ?? key
    if (!window.confirm(`Delete backup "${fileName}"? This cannot be undone.`)) {
      return
    }

    setDeletingKey(key)
    setError(null)
    try {
      const res = await fetch(`/api/backup/delete?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Delete failed')
        return
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingKey(null)
    }
  }

  return (
    <div
      style={{
        marginBottom: '2rem',
        padding: '1.25rem',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '4px',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Backup &amp; Recovery Center</h2>
      <p style={{ marginTop: 0, color: 'var(--theme-elevation-600)', fontSize: '13px' }}>
        ZIP to S3 under <code>database-backups/</code>: <code>payload-export.json</code> (all
        collections + globals) and <code>mongo-raw/*.jsonl</code> (one extended-JSON line per
        MongoDB document, suitable for inspection or custom restore). Admin only; requires S3 env
        vars. For a classic BSON dump on a machine with MongoDB tools, run{' '}
        <code>pnpm backup:mongo</code> locally.
      </p>

      {error ? (
        <p style={{ color: 'var(--theme-error-500)', marginBottom: '1rem' }}>{error}</p>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="btn btn--style-primary btn--size-medium"
          disabled={busy}
          onClick={() => void backupNow()}
        >
          {busy ? 'Running…' : 'Backup now'}
        </button>
        <button
          type="button"
          className="btn btn--style-secondary btn--size-medium"
          disabled={busy}
          onClick={() => void load()}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Schedule</div>
          <div style={{ fontWeight: 600 }}>{statusPayload?.scheduleDescription ?? '—'}</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            Cron: <code>{statusPayload?.scheduleCron ?? '—'}</code>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>
            Next scheduled backup (UTC)
          </div>
          <div style={{ fontWeight: 600 }}>
            {statusPayload?.nextScheduledBackup
              ? new Date(statusPayload.nextScheduledBackup).toLocaleString()
              : '—'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>
            Last successful backup
          </div>
          <div style={{ fontWeight: 600 }}>
            {statusPayload?.status?.lastSuccess
              ? new Date(statusPayload.status.lastSuccess.at).toLocaleString()
              : '—'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Storage health</div>
          <div style={{ fontWeight: 600 }}>
            {statusPayload?.storageHealth
              ? statusPayload.storageHealth.ok
                ? 'OK'
                : `Error: ${statusPayload.storageHealth.error ?? 'unknown'}`
              : '—'}
          </div>
          {statusPayload?.storageHealth?.at ? (
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Checked {new Date(statusPayload.storageHealth.at).toLocaleString()}
            </div>
          ) : null}
        </div>
      </div>

      {statusPayload?.status?.lastFailure ? (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '4px',
            background: 'var(--theme-error-50)',
            color: 'var(--theme-error-600)',
            fontSize: '13px',
          }}
        >
          <strong>Last failure:</strong> {statusPayload.status.lastFailure.message} (
          {new Date(statusPayload.status.lastFailure.at).toLocaleString()})
        </div>
      ) : null}

      <h3 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>Backup history</h3>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(listPayload?.backups ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} style={{ color: 'var(--theme-elevation-500)' }}>
                  No backups in S3 yet. Run &quot;Backup now&quot; or wait for the daily cron (requires
                  S3 env and IAM permissions).
                </td>
              </tr>
            ) : (
              listPayload!.backups.map((b) => (
                <tr key={b.key}>
                  <td>
                    <code style={{ fontSize: '12px' }}>{b.key.split('/').pop()}</code>
                  </td>
                  <td>{formatBytes(b.size)}</td>
                  <td>{new Date(b.lastModified).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn--style-secondary btn--size-small"
                        disabled={deletingKey === b.key}
                        onClick={() => void download(b.key)}
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        className="btn btn--style-secondary btn--size-small"
                        disabled={deletingKey === b.key}
                        style={{ color: 'var(--theme-error-500)' }}
                        onClick={() => void remove(b.key)}
                      >
                        {deletingKey === b.key ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>Recent backup attempts</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>OK</th>
              <th>Trigger</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {(statusPayload?.status?.recentAttempts ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} style={{ color: 'var(--theme-elevation-500)' }}>
                  No attempts recorded (status file is created after the first backup).
                </td>
              </tr>
            ) : (
              statusPayload!.status!.recentAttempts.map((a) => (
                <tr key={`${a.at}-${a.message}`}>
                  <td>{new Date(a.at).toLocaleString()}</td>
                  <td>{a.ok ? 'yes' : 'no'}</td>
                  <td>{a.trigger}</td>
                  <td style={{ fontSize: '12px' }}>
                    {a.message}
                    {a.s3Key ? (
                      <>
                        {' '}
                        <code>{a.s3Key.split('/').pop()}</code>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
