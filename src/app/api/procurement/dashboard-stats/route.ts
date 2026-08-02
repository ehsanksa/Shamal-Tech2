import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'

import configPromise from '@payload-config'
import { itemCategoryLabel } from '../../../../lib/procurement/constants'
import {
  ensurePermanentInternalDomain,
  isExpiryReached,
  startOfUtcDay,
} from '../../../../lib/procurement/domains'

export const dynamic = 'force-dynamic'

function sortCountDesc(a: { count: number }, b: { count: number }) {
  return b.count - a.count
}

function mapToSortedList(map: Map<string, number>) {
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort(sortCountDesc)
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensurePermanentInternalDomain(payload)

    const [domains, requests] = await Promise.all([
      payload.find({
        collection: 'procurement-approved-domains',
        limit: 1000,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'procurement-requests',
        limit: 5000,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    const now = new Date()
    const in30 = new Date(startOfUtcDay(now).getTime() + 30 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

    let activeDomains = 0
    let expiringWithin30Days = 0
    let expiredDomains = 0

    for (const doc of domains.docs) {
      const expiredByDate = !doc.isPermanent && isExpiryReached(doc.expiryDate, now)
      const effectivelyActive = doc.status === 'active' && !expiredByDate

      if (effectivelyActive) activeDomains += 1
      if (!doc.isPermanent && (expiredByDate || doc.status === 'inactive')) {
        expiredDomains += 1
      }
      if (effectivelyActive && doc.expiryDate) {
        const expiry = new Date(doc.expiryDate)
        if (expiry.getTime() <= in30.getTime()) {
          expiringWithin30Days += 1
        }
      }
    }

    const byDomain = new Map<string, number>()
    const byProject = new Map<string, number>()
    const byPriority = new Map<string, number>()
    const byDepartment = new Map<string, number>()
    const byCategory = new Map<string, number>()

    let openRequests = 0
    let deliveredRequests = 0
    let monthlyEstimatedSpend = 0

    for (const req of requests.docs) {
      const domain = req.emailDomain?.trim() || 'unknown'
      byDomain.set(domain, (byDomain.get(domain) || 0) + 1)

      const project = req.project?.trim() || 'Unspecified'
      byProject.set(project, (byProject.get(project) || 0) + 1)

      const priority = req.priority || 'medium'
      byPriority.set(priority, (byPriority.get(priority) || 0) + 1)

      const department = req.department?.trim() || 'Unspecified'
      byDepartment.set(department, (byDepartment.get(department) || 0) + 1)

      const category =
        req.itemCategory === 'other' && req.itemCategoryOther?.trim()
          ? `Other (${req.itemCategoryOther.trim()})`
          : itemCategoryLabel(req.itemCategory) || 'Unspecified'
      byCategory.set(category, (byCategory.get(category) || 0) + 1)

      if (req.status === 'delivered') {
        deliveredRequests += 1
      } else if (req.status === 'new' || req.status === 'in_review' || req.status === 'approved') {
        openRequests += 1
      }

      const submittedAt = req.submittedAt ? new Date(req.submittedAt) : null
      if (submittedAt && submittedAt >= monthStart) {
        const cost = req.estimatedTotalCost ?? 0
        if (typeof cost === 'number' && Number.isFinite(cost)) {
          monthlyEstimatedSpend += cost
        }
      }
    }

    return NextResponse.json({
      totalApprovedDomains: domains.totalDocs,
      activeDomains,
      expiringWithin30Days,
      expiredDomains,
      totalRequests: requests.totalDocs,
      openRequests,
      deliveredRequests,
      monthlyEstimatedSpend,
      requestsByDomain: Array.from(byDomain.entries())
        .map(([domain, count]) => ({ domain, count }))
        .sort(sortCountDesc),
      requestsByProject: Array.from(byProject.entries())
        .map(([project, count]) => ({ project, count }))
        .sort(sortCountDesc),
      requestsByPriority: mapToSortedList(byPriority).map(({ key, count }) => ({
        priority: key,
        count,
      })),
      requestsByDepartment: mapToSortedList(byDepartment).map(({ key, count }) => ({
        department: key,
        count,
      })),
      requestsByCategory: mapToSortedList(byCategory).map(({ key, count }) => ({
        category: key,
        count,
      })),
    })
  } catch (error) {
    console.error('procurement dashboard-stats error', error)
    return NextResponse.json({ error: 'Failed to load dashboard stats' }, { status: 500 })
  }
}
