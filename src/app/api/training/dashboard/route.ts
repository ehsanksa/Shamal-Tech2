import { NextResponse } from 'next/server'

import { buildDashboardData } from '@/lib/training/dashboard'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/** GET /api/training/dashboard — learning dashboard aggregates */
export async function GET() {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dashboard = await buildDashboardData(profile.email, profile.role)
  return NextResponse.json(dashboard)
}
