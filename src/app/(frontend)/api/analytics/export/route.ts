import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import * as XLSX from 'xlsx'

import configPromise from '@/payload.config'
import { canAccessBusinessAnalytics } from '@/access/analyticsSuperAdmin'
import { computeDashboard } from '@/lib/analytics/computeDashboard'
import { loadAnalyticsEventsInRange, loadPurchaseEventsBetween } from '@/lib/analytics/loadEvents'
import { parseRange, rollingFrom, utcDayBounds } from '@/lib/analytics/dateRange'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })
  if (!(await canAccessBusinessAnalytics(payload, user))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(req.url)
  const format = url.searchParams.get('format') || 'xlsx'
  const { from, to, preset } = parseRange(url.searchParams)

  const todayB = utcDayBounds(new Date())
  const weekB = rollingFrom(7)
  const monthB = rollingFrom(30)

  const [events, leadsLostResult, todayPurchases, weekPurchases, monthPurchases] = await Promise.all([
    loadAnalyticsEventsInRange(payload, from, to),
    payload.count({
      collection: 'leads',
      where: {
        and: [
          { status: { equals: 'lost' } },
          { createdAt: { greater_than_equal: from } },
          { createdAt: { less_than_equal: to } },
        ],
      },
      overrideAccess: true,
    }),
    loadPurchaseEventsBetween(payload, todayB.from, todayB.to),
    loadPurchaseEventsBetween(payload, weekB.from, weekB.to),
    loadPurchaseEventsBetween(payload, monthB.from, monthB.to),
  ])

  const report = await computeDashboard(payload, events, {
    from,
    to,
    leadsLostInRange: leadsLostResult.totalDocs,
    purchaseEventsForRevenueWindows: {
      today: todayPurchases,
      week: weekPurchases,
      month: monthPurchases,
    },
  })

  if (format === 'html') {
    const title = `Business report ${from.slice(0, 10)} — ${to.slice(0, 10)}`
    const rows = [
      ['Metric', 'Value'],
      ['Preset', preset],
      ['Unique visitors', String(report.impressions.uniqueVisitors)],
      ['Page views', String(report.impressions.pageViews)],
      ['Bounce rate %', String(report.impressions.bounceRatePct)],
      ['Avg session (s)', String(report.impressions.avgSessionDurationSec)],
      ['Funnel visitors', String(report.funnel.visitors)],
      ['Funnel product sessions', String(report.funnel.productViews)],
      ['Funnel add-to-cart sessions', String(report.funnel.addToCart)],
      ['Funnel checkout', String(report.funnel.checkoutStarted)],
      ['Paid orders (events)', String(report.funnel.ordersPaid)],
      ['Page sessions — Main', String(report.pageSessions.find((p) => p.key === 'main')?.sessions ?? 0)],
      ['Page sessions — Products', String(report.pageSessions.find((p) => p.key === 'products')?.sessions ?? 0)],
      ['Page sessions — Services', String(report.pageSessions.find((p) => p.key === 'services')?.sessions ?? 0)],
      ['Page sessions — Careers', String(report.pageSessions.find((p) => p.key === 'careers')?.sessions ?? 0)],
      ['Page sessions — Training', String(report.pageSessions.find((p) => p.key === 'training')?.sessions ?? 0)],
      ['Page sessions — Blogs', String(report.pageSessions.find((p) => p.key === 'blogs')?.sessions ?? 0)],
      ['Revenue (range)', String(report.revenue.rangeTotal)],
      ['Revenue today (UTC)', String(report.revenue.today)],
      ['Revenue 7d', String(report.revenue.week)],
      ['Revenue 30d', String(report.revenue.month)],
      ['Lost leads (CRM)', String(report.revenue.cancelledOrLost)],
    ]
    const table = rows
      .map(
        ([a, b]) =>
          `<tr><td style="padding:6px;border:1px solid #ccc">${escapeHtml(a)}</td><td style="padding:6px;border:1px solid #ccc">${escapeHtml(b)}</td></tr>`,
      )
      .join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
    <style>body{font-family:system-ui,sans-serif;padding:24px} h1{font-size:20px} @media print{body{padding:0}}</style></head>
    <body><h1>${escapeHtml(title)}</h1><p>Use your browser <strong>Print → Save as PDF</strong> for a PDF copy.</p>
    <table style="border-collapse:collapse;width:100%;max-width:720px">${table}</table>
    <h2 style="margin-top:32px;font-size:16px">Top products</h2>
    <table style="border-collapse:collapse;width:100%;max-width:900px">
    <tr><th style="text-align:left;border:1px solid #ccc;padding:6px">Product</th><th style="border:1px solid #ccc;padding:6px">Views</th><th style="border:1px solid #ccc;padding:6px">Cart</th><th style="border:1px solid #ccc;padding:6px">Purchases</th></tr>
    ${report.topProducts.map((p) => `<tr><td style="border:1px solid #ccc;padding:6px">${escapeHtml(p.name)}</td><td style="border:1px solid #ccc;padding:6px">${p.views}</td><td style="border:1px solid #ccc;padding:6px">${p.addToCart}</td><td style="border:1px solid #ccc;padding:6px">${p.purchases}</td></tr>`).join('')}
    </table>
    <script>window.onload=function(){window.focus()}</script>
    </body></html>`
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="business-report-${preset}.html"`,
      },
    })
  }

  const wb = XLSX.utils.book_new()
  const summary = [
    { metric: 'preset', value: preset },
    { metric: 'from', value: from },
    { metric: 'to', value: to },
    { metric: 'uniqueVisitors', value: report.impressions.uniqueVisitors },
    { metric: 'pageViews', value: report.impressions.pageViews },
    { metric: 'bounceRatePct', value: report.impressions.bounceRatePct },
    { metric: 'avgSessionDurationSec', value: report.impressions.avgSessionDurationSec },
    { metric: 'funnelVisitors', value: report.funnel.visitors },
    { metric: 'funnelProductViews', value: report.funnel.productViews },
    { metric: 'funnelAddToCart', value: report.funnel.addToCart },
    { metric: 'funnelCheckout', value: report.funnel.checkoutStarted },
    { metric: 'funnelPaid', value: report.funnel.ordersPaid },
    { metric: 'pageSessionsMain', value: report.pageSessions.find((p) => p.key === 'main')?.sessions ?? 0 },
    { metric: 'pageSessionsProducts', value: report.pageSessions.find((p) => p.key === 'products')?.sessions ?? 0 },
    { metric: 'pageSessionsServices', value: report.pageSessions.find((p) => p.key === 'services')?.sessions ?? 0 },
    { metric: 'pageSessionsCareers', value: report.pageSessions.find((p) => p.key === 'careers')?.sessions ?? 0 },
    { metric: 'pageSessionsTraining', value: report.pageSessions.find((p) => p.key === 'training')?.sessions ?? 0 },
    { metric: 'pageSessionsBlogs', value: report.pageSessions.find((p) => p.key === 'blogs')?.sessions ?? 0 },
    { metric: 'revenueRange', value: report.revenue.rangeTotal },
    { metric: 'revenueTodayUtc', value: report.revenue.today },
    { metric: 'revenue7d', value: report.revenue.week },
    { metric: 'revenue30d', value: report.revenue.month },
    { metric: 'avgOrderValue', value: report.revenue.avgOrderValue },
    { metric: 'lostLeadsCrm', value: report.revenue.cancelledOrLost },
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.pageSessions), 'PageSessions')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.topProducts), 'TopProducts')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.traffic), 'Traffic')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.searchKeywords), 'Search')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.geo.topCountries), 'Countries')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(report.geo.topCities), 'Cities')

  const rawSample = events.slice(0, 2000).map((e) => ({
    id: e.id,
    createdAt: e.createdAt,
    sessionId: e.sessionId,
    eventType: e.eventType,
    pageUrl: e.pageUrl,
    source: e.source,
    deviceType: e.deviceType,
    country: e.country,
    searchKeyword: e.searchKeyword,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rawSample), 'EventsSample')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const filename = `business-report-${preset}-${from.slice(0, 10)}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
