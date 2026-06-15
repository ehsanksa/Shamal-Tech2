import { NextResponse } from 'next/server'

import {
  listPaymentRecords,
  listProgressRecords,
  listUsers,
  TRAINING_CLICKUP_FIELDS as FIELD,
} from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'
import { normalizeRole } from '@/lib/training/role'

/**
 * GET /api/training/admin/overview?filter=all|trial|paid|leads
 */
export async function GET(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const filter = new URL(req.url).searchParams.get('filter') || 'all'

  const [users, payments, progressRows] = await Promise.all([
    listUsers(300),
    listPaymentRecords(300),
    listProgressRecords(500),
  ])

  const mappedUsers = users.map((r) => {
    const role = normalizeRole(String(r.fields[FIELD.role as keyof typeof r.fields]))
    const warm = Boolean(r.fields[FIELD.warmLead as keyof typeof r.fields])
    return {
      id: r.id,
      email: String(r.fields[FIELD.email as keyof typeof r.fields] || ''),
      name: String(r.fields[FIELD.name as keyof typeof r.fields] || ''),
      role,
      warmLead: warm,
      createdTime: r.createdTime,
    }
  })

  let filteredUsers = mappedUsers
  if (filter === 'trial') {
    filteredUsers = mappedUsers.filter((u) => u.role === 'trial')
  } else if (filter === 'paid') {
    filteredUsers = mappedUsers.filter((u) => u.role === 'paid')
  } else if (filter === 'leads') {
    filteredUsers = mappedUsers.filter((u) => u.warmLead)
  }

  return NextResponse.json({
    users: filteredUsers,
    allUserCount: mappedUsers.length,
    payments: payments.map((p) => ({
      id: p.id,
      fields: p.fields,
      createdTime: p.createdTime,
    })),
    progress: progressRows.map((p) => ({
      id: p.id,
      fields: p.fields,
      createdTime: p.createdTime,
    })),
    filter,
  })
}
