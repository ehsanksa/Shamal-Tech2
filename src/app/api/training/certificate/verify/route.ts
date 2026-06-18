import { NextResponse } from 'next/server'

import configPromise from '@/payload.config'
import { getPayload } from 'payload'

/** GET /api/training/certificate/verify?code=... */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.trim()
  if (!code) {
    return NextResponse.json({ error: 'Verification code is required.' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'training-certificates',
    where: { verificationCode: { equals: code } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const cert = result.docs[0]
  if (!cert) {
    return NextResponse.json({ valid: false }, { status: 404 })
  }

  return NextResponse.json({
    valid: true,
    certificateId: cert.certificateId,
    verificationCode: cert.verificationCode,
    studentName: cert.studentName,
    courseTitle: cert.courseTitle,
    issuedAt: cert.issuedAt,
  })
}
