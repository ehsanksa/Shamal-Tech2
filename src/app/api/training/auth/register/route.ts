import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createUser, findUserByEmail, upsertEnrollment } from '@/lib/training/repository'
import { getAdminEmails, isTrainingAuthAvailable } from '@/lib/training/env'
import { COOKIE_NAME, signTrainingToken } from '@/lib/training/jwt'
import { notifyNewUser } from '@/lib/training/n8n'
import { hashPassword } from '@/lib/training/passwords'
import type { TrainingRole } from '@/lib/training/types'

const DEFAULT_COURSE = 'drone-fundamentals'

/**
 * POST /api/training/auth/register — create student + JWT + trial enrollment.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string
      password?: string
      name?: string
      phone?: string
    }
    const email = body.email?.trim().toLowerCase()
    const password = body.password
    const name = body.name?.trim()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing email, password, or name' }, { status: 400 })
    }

    if (!isTrainingAuthAvailable()) {
      return NextResponse.json(
        { error: 'Training signup is not available: set TRAINING_JWT_SECRET in your environment.' },
        { status: 503 },
      )
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const admins = getAdminEmails()
    const role: TrainingRole = admins.has(email) ? 'admin' : 'paid'
    const passwordHash = await hashPassword(password)

    const record = await createUser({
      email,
      name,
      phone: body.phone?.trim(),
      passwordHash,
      role,
    })

    await upsertEnrollment({
      studentId: record.id,
      studentEmail: email,
      courseSlug: DEFAULT_COURSE,
      accessLevel: 'free',
    })

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

    await notifyNewUser({
      user_id: record.id,
      email,
      name,
      phone: body.phone?.trim(),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, user: { id: record.id, email, name, role } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
