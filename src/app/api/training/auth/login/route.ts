import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { findUserByEmail, TRAINING_CLICKUP_FIELDS as FIELD, updateUserRole, upsertEnrollment } from '@/lib/training/repository'
import { isTrainingAuthAvailable } from '@/lib/training/env'
import { COOKIE_NAME, signTrainingToken } from '@/lib/training/jwt'
import { verifyPassword } from '@/lib/training/passwords'
import { normalizeRole } from '@/lib/training/role'

const DEFAULT_COURSE = 'drone-fundamentals'

/**
 * POST /api/training/auth/login — verify password, issue JWT.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    if (!isTrainingAuthAvailable()) {
      return NextResponse.json(
        { error: 'Training sign-in is not available: set TRAINING_JWT_SECRET in your environment.' },
        { status: 503 },
      )
    }

    const record = await findUserByEmail(email)
    if (!record) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const hash = record.fields[FIELD.passwordHash as keyof typeof record.fields] as string
    const ok = await verifyPassword(password, hash)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    let role = normalizeRole(String(record.fields[FIELD.role as keyof typeof record.fields] || 'trial'))
    const name = String(record.fields[FIELD.name as keyof typeof record.fields] || '')

    if (role === 'trial') {
      await updateUserRole(record.id, 'paid')
      await upsertEnrollment({
        studentId: record.id,
        studentEmail: email,
        courseSlug: DEFAULT_COURSE,
        accessLevel: 'free',
      })
      role = 'paid'
    }

    const token = await signTrainingToken({
      sub: record.id,
      email,
      name,
      role,
    })

    const jar = await cookies()
    jar.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ ok: true, user: { id: record.id, email, name, role } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
