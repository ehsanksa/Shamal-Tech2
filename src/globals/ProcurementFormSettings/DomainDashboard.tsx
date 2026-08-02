'use client'

import React, { useCallback, useEffect, useState } from 'react'

type DashboardStats = {
  totalApprovedDomains: number
  activeDomains: number
  expiringWithin30Days: number
  expiredDomains: number
  totalRequests: number
  openRequests: number
  deliveredRequests: number
  monthlyEstimatedSpend: number
  requestsByDomain: Array<{ domain: string; count: number }>
  requestsByProject: Array<{ project: string; count: number }>
  requestsByPriority: Array<{ priority: string; count: number }>
  requestsByDepartment: Array<{ department: string; count: number }>
  requestsByCategory: Array<{ category: string; count: number }>
}

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 4,
  padding: '12px 14px',
  background: 'var(--theme-elevation-50)',
  minWidth: 140,
  flex: '1 1 140px',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.75,
  marginBottom: 4,
}

const valueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  lineHeight: 1.2,
}

function StatList({
  title,
  empty,
  items,
}: {
  title: string
  empty: string
  items: Array<{ label: string; count: number }>
}) {
  return (
    <div>
      <h4 style={{ margin: '0 0 8px', fontSize: 14 }}>{title}</h4>
      {items.length === 0 ? (
        <p style={{ opacity: 0.7, margin: 0 }}>{empty}</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {items.map((row) => (
            <li key={row.label}>
              <strong>{row.label}</strong>: {row.count}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DomainDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const apiBase = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await fetch(`${apiBase}/api/procurement/dashboard-stats`, {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to load procurement dashboard')
      }
      const data = (await res.json()) as DashboardStats
      setStats(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div style={{ margin: '8px 0 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16 }}>Procurement Dashboard</h3>
        <button
          type="button"
          onClick={() => void load()}
          style={{
            border: '1px solid var(--theme-elevation-250)',
            background: 'var(--theme-elevation-0)',
            borderRadius: 4,
            padding: '6px 10px',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      {loading && <p style={{ opacity: 0.7 }}>Loading dashboard…</p>}
      {error && <p style={{ color: 'var(--theme-error-500)' }}>{error}</p>}

      {stats && !loading && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <div style={cardStyle}>
              <div style={labelStyle}>Total Requests</div>
              <div style={valueStyle}>{stats.totalRequests}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Open Requests</div>
              <div style={valueStyle}>{stats.openRequests}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Delivered Requests</div>
              <div style={valueStyle}>{stats.deliveredRequests}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Monthly Estimated Spend</div>
              <div style={valueStyle}>
                {Number(stats.monthlyEstimatedSpend || 0).toLocaleString()}
              </div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Total Approved Domains</div>
              <div style={valueStyle}>{stats.totalApprovedDomains}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Active Domains</div>
              <div style={valueStyle}>{stats.activeDomains}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Expiring Within 30 Days</div>
              <div style={valueStyle}>{stats.expiringWithin30Days}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Expired Domains</div>
              <div style={valueStyle}>{stats.expiredDomains}</div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            <StatList
              title="Requests by Priority"
              empty="No submissions yet."
              items={(stats.requestsByPriority || []).map((r) => ({
                label: r.priority,
                count: r.count,
              }))}
            />
            <StatList
              title="Requests by Department"
              empty="No submissions yet."
              items={(stats.requestsByDepartment || []).map((r) => ({
                label: r.department,
                count: r.count,
              }))}
            />
            <StatList
              title="Requests by Project"
              empty="No submissions yet."
              items={(stats.requestsByProject || []).map((r) => ({
                label: r.project,
                count: r.count,
              }))}
            />
            <StatList
              title="Requests by Item Category"
              empty="No submissions yet."
              items={(stats.requestsByCategory || []).map((r) => ({
                label: r.category,
                count: r.count,
              }))}
            />
            <StatList
              title="Requests by Domain"
              empty="No submissions yet."
              items={(stats.requestsByDomain || []).map((r) => ({
                label: r.domain,
                count: r.count,
              }))}
            />
          </div>
        </>
      )}
    </div>
  )
}
