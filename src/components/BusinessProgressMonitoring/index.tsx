'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { DashboardReport } from '@/lib/analytics/computeDashboard'

type Preset = 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'custom'

function useAnimatedInt(target: number, active: boolean) {
  const [v, setV] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (!active) {
      setV(target)
      return
    }
    const start = performance.now()
    const from = 0
    const dur = 550
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const ease = 1 - (1 - t) ** 3
      setV(Math.round(from + (target - from) * ease))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [target, active])
  return v
}

function Kpi({
  label,
  value,
  sub,
  animate,
}: {
  label: string
  value: number
  sub?: string
  animate?: boolean
}) {
  const n = useAnimatedInt(value, Boolean(animate))
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: 8,
        border: '1px solid var(--theme-elevation-150)',
        background: 'linear-gradient(145deg, var(--theme-elevation-50), var(--theme-elevation-100))',
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--theme-elevation-600)' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{n.toLocaleString()}</div>
      {sub ? <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginTop: 4 }}>{sub}</div> : null}
    </div>
  )
}

function FunnelRow({
  label,
  count,
  pctPrev,
  pctSuffix = 'vs prev',
}: {
  label: string
  count: number
  pctPrev: number | null
  pctSuffix?: string
}) {
  const w = pctPrev == null ? 100 : Math.min(100, Math.max(count > 0 ? 4 : 0, pctPrev))
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ color: 'var(--theme-elevation-600)' }}>
          {count.toLocaleString()}
          {pctPrev != null ? ` · ${pctPrev.toFixed(1)}% ${pctSuffix}` : ''}
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 6, background: 'var(--theme-elevation-150)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${w}%`,
            borderRadius: 6,
            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  )
}

function TrafficDonut({ traffic }: { traffic: DashboardReport['traffic'] }) {
  const total = traffic.reduce((s, x) => s + x.count, 0)
  if (total === 0) {
    return <p style={{ fontSize: 13, color: 'var(--theme-elevation-500)' }}>No page-view traffic in this range yet.</p>
  }
  let acc = 0
  const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#0d9488', '#4b5563', '#9ca3af']
  const segs = traffic.map((t, i) => {
    const pct = (t.count / total) * 100
    const start = acc
    acc += pct
    return `${colors[i % colors.length]} ${start}% ${acc}%`
  })
  const style: React.CSSProperties = {
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: `conic-gradient(${segs.join(', ')})`,
    margin: '0 auto',
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
      <div style={style} />
      <div style={{ flex: 1, minWidth: 200 }}>
        {traffic.map((t, i) => (
          <div key={t.bucket} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length] }} />
            <span style={{ flex: 1 }}>{t.label}</span>
            <span style={{ fontWeight: 600 }}>{t.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BusinessProgressMonitoring() {
  const [preset, setPreset] = useState<Preset>('today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [report, setReport] = useState<DashboardReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiPreset, setApiPreset] = useState<string | null>(null)

  const qs = useMemo(() => {
    if (preset === 'custom' && customFrom && customTo) {
      const from = new Date(`${customFrom}T00:00:00.000Z`).toISOString()
      const to = new Date(`${customTo}T23:59:59.999Z`).toISOString()
      return `preset=custom&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    }
    return `preset=${preset}`
  }, [preset, customFrom, customTo])

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      if (preset === 'custom' && (!customFrom || !customTo)) {
        setReport(null)
        setLoading(false)
        return
      }
      const res = await fetch(`/api/analytics/report?${qs}`, { credentials: 'include' })
      if (res.status === 403) {
        setForbidden(true)
        setReport(null)
        return
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError((j as { error?: string }).error ?? 'Failed to load analytics')
        setReport(null)
        return
      }
      setForbidden(false)
      const json = (await res.json()) as DashboardReport & { preset?: string }
      setApiPreset(json.preset ?? null)
      setReport(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [qs, preset, customFrom, customTo])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const id = window.setInterval(() => void load(), 30_000)
    return () => window.clearInterval(id)
  }, [load])

  const downloadXlsx = () => {
    const url = `/api/analytics/export?format=xlsx&${qs}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const downloadHtmlPdf = () => {
    const url = `/api/analytics/export?format=html&${qs}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const funnel = report?.funnel
  const pct = (a: number, b: number) => (b ? Math.min(999, (a / b) * 100) : 0)
  const shareLabel = (
    rows: DashboardReport['pageSessions'] | undefined,
    key: DashboardReport['pageSessions'][number]['key'],
    visitors: number | undefined,
  ) => {
    const row = rows?.find((r) => r.key === key)
    const n = visitors ?? 0
    if (!row || !n) return '0%'
    return `${Math.round((row.sessions / n) * 1000) / 10}%`
  }

  return (
    <div
      style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        background: 'var(--theme-elevation-0)',
        boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, letterSpacing: '0.04em', fontWeight: 700 }}>BUSINESS PROGRESS MONITORING</h2>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--theme-elevation-600)', fontSize: 13, maxWidth: 640 }}>
            Real-time public website traffic, customer engagement, sales funnel and growth analytics.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            disabled={forbidden}
            onClick={() => void downloadXlsx()}
          >
            Download Business Report (Excel)
          </button>
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            disabled={forbidden}
            onClick={() => void downloadHtmlPdf()}
          >
            Print-ready PDF (HTML)
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        {(
          [
            ['today', 'Today'],
            ['yesterday', 'Yesterday'],
            ['7d', '7 Days'],
            ['30d', '30 Days'],
            ['90d', '90 Days'],
          ] as const
        ).map(([p, label]) => (
          <button
            key={p}
            type="button"
            disabled={forbidden}
            className={preset === p ? 'btn btn--style-primary btn--size-small' : 'btn btn--style-secondary btn--size-small'}
            onClick={() => setPreset(p)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          disabled={forbidden}
          className={preset === 'custom' ? 'btn btn--style-primary btn--size-small' : 'btn btn--style-secondary btn--size-small'}
          onClick={() => setPreset('custom')}
        >
          Custom Range
        </button>
        {preset === 'custom' ? (
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <input
              type="date"
              disabled={forbidden}
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              style={{ padding: 6 }}
            />
            <span>→</span>
            <input
              type="date"
              disabled={forbidden}
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              style={{ padding: 6 }}
            />
          </span>
        ) : null}
      </div>

      {error ? (
        <p style={{ color: 'var(--theme-error-500)', marginTop: '1rem' }}>{error}</p>
      ) : null}
      {forbidden ? (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: 8,
            border: '1px solid var(--theme-warning-500)',
            background: 'var(--theme-warning-50)',
            color: 'var(--theme-elevation-900)',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <strong>Analytics access required.</strong> Your account does not have the <strong>Admin</strong> role, or the
          session has not picked up roles yet. Open <strong>Users</strong>, edit your user, enable the <strong>Admin</strong>{' '}
          role, save, then sign out and sign in again. This panel stays here so the dashboard layout does not jump.
        </div>
      ) : null}
      {loading && !report && !forbidden ? (
        <p style={{ marginTop: '1rem', color: 'var(--theme-elevation-600)' }}>Loading analytics…</p>
      ) : null}

      {report && !forbidden ? (
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{ fontSize: 14, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            Public impressions{apiPreset === 'today' ? ' (today)' : ''}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <Kpi label="Unique visitors" value={report.impressions.uniqueVisitors} animate />
            <Kpi label="Page views" value={report.impressions.pageViews} animate />
            <Kpi label="Unique sessions" value={report.impressions.uniqueSessions} animate />
            <Kpi label="Bounce rate %" value={Math.round(report.impressions.bounceRatePct)} sub="single-page sessions" animate />
            <Kpi label="Avg session (s)" value={Math.round(report.impressions.avgSessionDurationSec)} animate />
          </div>

          <h3 style={{ fontSize: 14, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Sales funnel tracker</h3>
          <div
            style={{
              padding: '1rem',
              borderRadius: 8,
              border: '1px solid var(--theme-elevation-150)',
              marginBottom: '1.5rem',
              background: 'var(--theme-elevation-50)',
            }}
          >
            {funnel ? (
              <>
                <FunnelRow label="Visitors (sessions)" count={funnel.visitors} pctPrev={null} />
                <FunnelRow label="Product engagement (sessions)" count={funnel.productViews} pctPrev={pct(funnel.productViews, funnel.visitors)} />
                <FunnelRow label="Add to cart / quote intent (sessions)" count={funnel.addToCart} pctPrev={pct(funnel.addToCart, funnel.productViews)} />
                <FunnelRow label="Checkout started (sessions)" count={funnel.checkoutStarted} pctPrev={pct(funnel.checkoutStarted, funnel.addToCart)} />
                <FunnelRow label="Orders paid (events)" count={funnel.ordersPaid} pctPrev={pct(funnel.ordersPaid, funnel.checkoutStarted)} />
                <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginTop: 8 }}>
                  Conversion vs traffic: product {funnel.pctProductFromVisitors}% · cart {funnel.pctCartFromProduct}% · checkout{' '}
                  {funnel.pctCheckoutFromCart}% · paid {funnel.pctPaidFromCheckout}%
                </div>
              </>
            ) : null}
          </div>

          <h3 style={{ fontSize: 14, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Visitors by page</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            {(report.pageSessions ?? []).map((row) => (
              <Kpi
                key={`kpi-${row.key}`}
                label={row.label}
                value={row.sessions}
                sub={`${shareLabel([row], row.key, funnel?.visitors)} of sessions · ${row.pageViews.toLocaleString()} views`}
                animate
              />
            ))}
          </div>
          <div
            style={{
              padding: '1rem',
              borderRadius: 8,
              border: '1px solid var(--theme-elevation-150)',
              marginBottom: '1.5rem',
              background: 'var(--theme-elevation-50)',
            }}
          >
            {(report.pageSessions ?? []).map((row) => (
              <FunnelRow
                key={row.key}
                label={`${row.label} (sessions)`}
                count={row.sessions}
                pctPrev={pct(row.sessions, funnel?.visitors ?? report.impressions.uniqueSessions)}
                pctSuffix="of sessions"
              />
            ))}
            <div style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginTop: 8 }}>
              Share of sessions that viewed each page · Main {shareLabel(report.pageSessions, 'main', funnel?.visitors)} · Products{' '}
              {shareLabel(report.pageSessions, 'products', funnel?.visitors)} · Services{' '}
              {shareLabel(report.pageSessions, 'services', funnel?.visitors)} · Careers{' '}
              {shareLabel(report.pageSessions, 'careers', funnel?.visitors)} · Training{' '}
              {shareLabel(report.pageSessions, 'training', funnel?.visitors)} · Blogs{' '}
              {shareLabel(report.pageSessions, 'blogs', funnel?.visitors)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Top viewed products</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th />
                      <th>Product</th>
                      <th>Views</th>
                      <th>Cart</th>
                      <th>Paid</th>
                      <th>Conv %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ color: 'var(--theme-elevation-500)' }}>
                          No product view events in this range yet.
                        </td>
                      </tr>
                    ) : (
                      report.topProducts.map((p) => (
                        <tr key={p.productId}>
                          <td style={{ width: 48 }}>
                            {p.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.imageUrl} alt="" width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--theme-elevation-150)' }} />
                            )}
                          </td>
                          <td>{p.name}</td>
                          <td>{p.views}</td>
                          <td>{p.addToCart}</td>
                          <td>{p.purchases}</td>
                          <td>{p.conversionPct}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Traffic source analysis</h3>
              <TrafficDonut traffic={report.traffic} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Customer growth monitor</h3>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 13, lineHeight: 1.7 }}>
                <li>New registrations: {report.customerGrowth.newRegistrations}</li>
                <li>Newsletter joins: {report.customerGrowth.newsletterJoins}</li>
                <li>Contact inquiries: {report.customerGrowth.contactInquiries}</li>
                <li>Guest sessions (no CMS user): {report.customerGrowth.guestSessions}</li>
                <li>Sessions with user hint: {report.customerGrowth.sessionsWithUserHint}</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Search intent</h3>
              {report.searchKeywords.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--theme-elevation-500)' }}>No search events in range.</p>
              ) : (
                <ol style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 13 }}>
                  {report.searchKeywords.slice(0, 10).map((k) => (
                    <li key={k.keyword}>
                      {k.keyword} <span style={{ color: 'var(--theme-elevation-600)' }}>({k.count})</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Device &amp; region</h3>
              <p style={{ fontSize: 13, marginTop: 0 }}>
                Mobile {report.devices.mobilePct}% · Desktop {report.devices.desktopPct}% · Tablet {report.devices.tabletPct}% · Unknown{' '}
                {report.devices.unknownPct}%
              </p>
              <p style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 4 }}>Top countries (from edge headers)</p>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 13 }}>
                {report.geo.topCountries.map((c) => (
                  <li key={c.name}>
                    {c.name}: {c.count}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: 'var(--theme-elevation-600)', marginBottom: 4, marginTop: 8 }}>Top cities</p>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 13 }}>
                {report.geo.topCities.map((c) => (
                  <li key={c.name}>
                    {c.name}: {c.count}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--theme-elevation-150)', borderRadius: 8 }}>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Revenue snapshot</h3>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 13, lineHeight: 1.7 }}>
                <li>Today (UTC, purchases): {report.revenue.today.toLocaleString(undefined, { style: 'currency', currency: 'SAR' })}</li>
                <li>Last 7 days: {report.revenue.week.toLocaleString(undefined, { style: 'currency', currency: 'SAR' })}</li>
                <li>Last 30 days: {report.revenue.month.toLocaleString(undefined, { style: 'currency', currency: 'SAR' })}</li>
                <li>In selected range: {report.revenue.rangeTotal.toLocaleString(undefined, { style: 'currency', currency: 'SAR' })}</li>
                <li>Avg order value (range): {report.revenue.avgOrderValue.toLocaleString(undefined, { style: 'currency', currency: 'SAR' })}</li>
                <li>Paid orders (events in range): {report.revenue.paidOrders}</li>
                <li>Lost deals (CRM, range): {report.revenue.cancelledOrLost}</li>
              </ul>
            </div>
          </div>

          <p style={{ fontSize: 11, color: 'var(--theme-elevation-500)', marginTop: '1rem', marginBottom: 0 }}>
            Auto-refresh every 30 seconds · Revenue uses PURCHASE_SUCCESS analytics events (e.g. training checkout) plus rolling windows for pulse KPIs.
          </p>
        </div>
      ) : null}
    </div>
  )
}

