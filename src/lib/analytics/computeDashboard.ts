import type { Payload } from 'payload'

import type { AnalyticsEventRow } from './types'
import { trafficBucketLabel, type TrafficBucket } from './trafficSource'

function relId(v: number | { id: number } | null | undefined): number | null {
  if (v == null) return null
  return typeof v === 'object' ? v.id : v
}

function sessionsFor(events: AnalyticsEventRow[], type: string): Set<string> {
  const s = new Set<string>()
  for (const e of events) {
    if (e.eventType === type) s.add(e.sessionId)
  }
  return s
}

function countEvents(events: AnalyticsEventRow[], type: string): number {
  let n = 0
  for (const e of events) {
    if (e.eventType === type) n += 1
  }
  return n
}

export type PageSessionKey = 'main' | 'products' | 'careers' | 'training' | 'blogs'

const PAGE_SESSION_DEFS: Array<{ key: PageSessionKey; label: string }> = [
  { key: 'main', label: 'Main page' },
  { key: 'products', label: 'Products page' },
  { key: 'careers', label: 'Careers page' },
  { key: 'training', label: 'Training platform' },
  { key: 'blogs', label: 'Blogs page' },
]

/** Strip query/hash and trailing slash; keep `/` for homepage. */
function normalizePathname(pageUrl: string): string {
  const raw = (pageUrl || '').trim()
  if (!raw) return '/'
  try {
    const pathOnly = raw.startsWith('http://') || raw.startsWith('https://') ? new URL(raw).pathname : raw.split(/[?#]/)[0] || '/'
    const cleaned = pathOnly.replace(/\/+$/, '') || '/'
    return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
  } catch {
    const cleaned = (raw.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/'
    return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
  }
}

function matchPageSessionKey(pathname: string): PageSessionKey | null {
  if (pathname === '/') return 'main'
  if (pathname === '/products' || pathname.startsWith('/products/')) return 'products'
  if (pathname === '/careers' || pathname.startsWith('/careers/')) return 'careers'
  if (pathname === '/training' || pathname.startsWith('/training/') || pathname === '/course') return 'training'
  if (pathname === '/posts' || pathname.startsWith('/posts/')) return 'blogs'
  return null
}

function pageSessionsFromViews(pageViews: AnalyticsEventRow[]): DashboardReport['pageSessions'] {
  const sessionsByKey: Record<PageSessionKey, Set<string>> = {
    main: new Set(),
    products: new Set(),
    careers: new Set(),
    training: new Set(),
    blogs: new Set(),
  }
  const viewsByKey: Record<PageSessionKey, number> = {
    main: 0,
    products: 0,
    careers: 0,
    training: 0,
    blogs: 0,
  }
  for (const e of pageViews) {
    const key = matchPageSessionKey(normalizePathname(e.pageUrl))
    if (!key) continue
    sessionsByKey[key].add(e.sessionId)
    viewsByKey[key] += 1
  }
  return PAGE_SESSION_DEFS.map(({ key, label }) => ({
    key,
    label,
    sessions: sessionsByKey[key].size,
    pageViews: viewsByKey[key],
  }))
}

export type DashboardReport = {
  range: { from: string; to: string }
  impressions: {
    uniqueVisitors: number
    pageViews: number
    uniqueSessions: number
    bounceRatePct: number
    avgSessionDurationSec: number
  }
  funnel: {
    visitors: number
    productViews: number
    addToCart: number
    checkoutStarted: number
    ordersPaid: number
    pctProductFromVisitors: number
    pctCartFromProduct: number
    pctCheckoutFromCart: number
    pctPaidFromCheckout: number
  }
  /** Unique sessions (and view counts) for key public routes. */
  pageSessions: Array<{
    key: PageSessionKey
    label: string
    sessions: number
    pageViews: number
  }>
  topProducts: Array<{
    productId: number
    name: string
    imageUrl: string | null
    views: number
    addToCart: number
    purchases: number
    conversionPct: number
  }>
  traffic: Array<{ bucket: TrafficBucket; label: string; count: number }>
  customerGrowth: {
    newRegistrations: number
    newsletterJoins: number
    contactInquiries: number
    guestSessions: number
    sessionsWithUserHint: number
  }
  searchKeywords: Array<{ keyword: string; count: number }>
  devices: { mobilePct: number; desktopPct: number; tabletPct: number; unknownPct: number }
  geo: { topCountries: Array<{ name: string; count: number }>; topCities: Array<{ name: string; count: number }> }
  revenue: {
    today: number
    week: number
    month: number
    rangeTotal: number
    avgOrderValue: number
    paidOrders: number
    cancelledOrLost: number
  }
}

function bounceAndDuration(events: AnalyticsEventRow[]): { bounceRatePct: number; avgSessionDurationSec: number } {
  const bySession = new Map<string, AnalyticsEventRow[]>()
  for (const e of events) {
    if (e.eventType !== 'PAGE_VIEW') continue
    const arr = bySession.get(e.sessionId) ?? []
    arr.push(e)
    bySession.set(e.sessionId, arr)
  }
  let bounced = 0
  let totalDur = 0
  let counted = 0
  for (const [, list] of bySession) {
    if (list.length <= 1) {
      bounced += 1
      totalDur += 0
      counted += 1
      continue
    }
    const times = list.map((x) => new Date(x.createdAt).getTime()).sort((a, b) => a - b)
    const dur = (times[times.length - 1]! - times[0]!) / 1000
    totalDur += dur
    counted += 1
  }
  const bounceRatePct = counted ? Math.round((bounced / counted) * 1000) / 10 : 0
  const avgSessionDurationSec = counted ? Math.round((totalDur / counted) * 10) / 10 : 0
  return { bounceRatePct, avgSessionDurationSec }
}

export async function computeDashboard(
  payload: Payload,
  events: AnalyticsEventRow[],
  opts: {
    from: string
    to: string
    leadsLostInRange: number
    purchaseEventsForRevenueWindows: {
      today: AnalyticsEventRow[]
      week: AnalyticsEventRow[]
      month: AnalyticsEventRow[]
    }
  },
): Promise<DashboardReport> {
  const pageViews = events.filter((e) => e.eventType === 'PAGE_VIEW')
  const sessionsPage = new Set(pageViews.map((e) => e.sessionId))
  const { bounceRatePct, avgSessionDurationSec } = bounceAndDuration(events)

  const sVisitors = sessionsFor(events, 'PAGE_VIEW')
  const sProduct = sessionsFor(events, 'PRODUCT_VIEW')
  const sCart = sessionsFor(events, 'ADD_TO_CART')
  const sCheckout = sessionsFor(events, 'CHECKOUT_INITIATED')
  const paidCount = countEvents(events, 'PURCHASE_SUCCESS')

  const visitors = sVisitors.size
  const funnel = {
    visitors,
    productViews: sProduct.size,
    addToCart: sCart.size,
    checkoutStarted: sCheckout.size,
    ordersPaid: paidCount,
    pctProductFromVisitors: visitors ? Math.round((sProduct.size / visitors) * 1000) / 10 : 0,
    pctCartFromProduct: sProduct.size ? Math.round((sCart.size / sProduct.size) * 1000) / 10 : 0,
    pctCheckoutFromCart: sCart.size ? Math.round((sCheckout.size / sCart.size) * 1000) / 10 : 0,
    pctPaidFromCheckout: sCheckout.size ? Math.round((paidCount / sCheckout.size) * 1000) / 10 : 0,
  }
  const pageSessions = pageSessionsFromViews(pageViews)

  const productViewsById = new Map<number, number>()
  const cartById = new Map<number, number>()
  const purchaseById = new Map<number, number>()
  for (const e of events) {
    const pid = relId(e.productId as never)
    if (pid == null) continue
    if (e.eventType === 'PRODUCT_VIEW') productViewsById.set(pid, (productViewsById.get(pid) ?? 0) + 1)
    if (e.eventType === 'ADD_TO_CART') cartById.set(pid, (cartById.get(pid) ?? 0) + 1)
    if (e.eventType === 'PURCHASE_SUCCESS') purchaseById.set(pid, (purchaseById.get(pid) ?? 0) + 1)
  }
  const topIds = [...productViewsById.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id]) => id)

  const productDocs =
    topIds.length > 0
      ? await payload.find({
          collection: 'products',
          where: { id: { in: topIds } },
          depth: 1,
          limit: topIds.length,
          pagination: false,
        })
      : { docs: [] as Record<string, unknown>[] }

  const idToDoc = new Map<number, Record<string, unknown>>()
  for (const d of productDocs.docs as { id: number; name?: string; images?: unknown[] }[]) {
    idToDoc.set(d.id, d as Record<string, unknown>)
  }

  const topProducts = topIds.map((productId) => {
    const doc = idToDoc.get(productId)
    const name = (doc?.name as string) || `Product #${productId}`
    const images = doc?.images as Array<{ url?: string } | string> | undefined
    let imageUrl: string | null = null
    if (images?.[0] && typeof images[0] === 'object' && 'url' in images[0]) imageUrl = images[0].url ?? null
    const views = productViewsById.get(productId) ?? 0
    const addToCart = cartById.get(productId) ?? 0
    const purchases = purchaseById.get(productId) ?? 0
    const conversionPct = views ? Math.round((purchases / views) * 10000) / 100 : 0
    return { productId, name, imageUrl, views, addToCart, purchases, conversionPct }
  })

  const trafficMap = new Map<TrafficBucket, number>()
  const buckets: TrafficBucket[] = [
    'google_organic',
    'direct',
    'social',
    'whatsapp',
    'facebook_ads',
    'instagram',
    'referral',
    'unknown',
  ]
  for (const b of buckets) trafficMap.set(b, 0)
  for (const e of pageViews) {
    const raw = (e.source || 'unknown') as TrafficBucket
    const b = trafficMap.has(raw) ? raw : 'unknown'
    trafficMap.set(b, (trafficMap.get(b) ?? 0) + 1)
  }
  const traffic = buckets.map((bucket) => ({
    bucket,
    label: trafficBucketLabel(bucket),
    count: trafficMap.get(bucket) ?? 0,
  }))

  const keywordMap = new Map<string, number>()
  for (const e of events) {
    if (e.eventType !== 'SEARCH_USED') continue
    const k = (e.searchKeyword || '').trim().toLowerCase()
    if (!k) continue
    keywordMap.set(k, (keywordMap.get(k) ?? 0) + 1)
  }
  const searchKeywords = [...keywordMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, count]) => ({ keyword, count }))

  const deviceCounts = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 }
  for (const e of pageViews) {
    const d = (e.deviceType || 'unknown') as keyof typeof deviceCounts
    if (d in deviceCounts) deviceCounts[d] += 1
    else deviceCounts.unknown += 1
  }
  const dTotal = pageViews.length || 1
  const devices = {
    mobilePct: Math.round((deviceCounts.mobile / dTotal) * 1000) / 10,
    desktopPct: Math.round((deviceCounts.desktop / dTotal) * 1000) / 10,
    tabletPct: Math.round((deviceCounts.tablet / dTotal) * 1000) / 10,
    unknownPct: Math.round((deviceCounts.unknown / dTotal) * 1000) / 10,
  }

  const countryMap = new Map<string, number>()
  const cityMap = new Map<string, number>()
  for (const e of pageViews) {
    const c = (e.country || '').trim()
    if (c) countryMap.set(c, (countryMap.get(c) ?? 0) + 1)
    const city = (e.city || '').trim()
    if (city) cityMap.set(city, (cityMap.get(city) ?? 0) + 1)
  }
  const topCountries = [...countryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))
  const topCities = [...cityMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  const sumAmount = (list: AnalyticsEventRow[]) => {
    let t = 0
    for (const e of list) {
      const m = e.metaData as { amount?: number } | null | undefined
      if (typeof m?.amount === 'number' && !Number.isNaN(m.amount)) t += m.amount
    }
    return Math.round(t * 100) / 100
  }

  const rangePurchases = events.filter((e) => e.eventType === 'PURCHASE_SUCCESS')
  const rangeTotal = sumAmount(rangePurchases)
  const paidOrders = rangePurchases.length
  const avgOrderValue = paidOrders ? Math.round((rangeTotal / paidOrders) * 100) / 100 : 0

  const sessionsWithUser = new Set<string>()
  for (const e of events) {
    if (relId(e.userId as never) != null) sessionsWithUser.add(e.sessionId)
  }
  const allSessions = new Set(events.map((e) => e.sessionId))
  const guestSessions = [...allSessions].filter((sid) => !sessionsWithUser.has(sid)).length

  return {
    range: { from: opts.from, to: opts.to },
    impressions: {
      uniqueVisitors: sessionsPage.size,
      pageViews: pageViews.length,
      uniqueSessions: sessionsPage.size,
      bounceRatePct,
      avgSessionDurationSec,
    },
    funnel,
    pageSessions,
    topProducts,
    traffic,
    customerGrowth: {
      newRegistrations: countEvents(events, 'NEW_CUSTOMER_REGISTERED'),
      newsletterJoins: countEvents(events, 'NEWSLETTER_JOINED'),
      contactInquiries: countEvents(events, 'CONTACT_SUBMITTED'),
      guestSessions,
      sessionsWithUserHint: sessionsWithUser.size,
    },
    searchKeywords,
    devices,
    geo: { topCountries, topCities },
    revenue: {
      today: sumAmount(opts.purchaseEventsForRevenueWindows.today),
      week: sumAmount(opts.purchaseEventsForRevenueWindows.week),
      month: sumAmount(opts.purchaseEventsForRevenueWindows.month),
      rangeTotal,
      avgOrderValue,
      paidOrders,
      cancelledOrLost: opts.leadsLostInRange,
    },
  }
}
