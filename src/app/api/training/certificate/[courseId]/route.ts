import { NextResponse } from 'next/server'

import { evaluateCertificateEligibility } from '@/lib/training/certificate-eligibility'
import { getCourseBySlug } from '@/lib/training/load-courses'
import {
  findCertificateForStudentCourse,
  getProgressForCourse,
  hasActiveEnrollment,
  listAssignmentSubmissionsForCourse,
  saveCertificate,
} from '@/lib/training/repository'
import {
  buildCertificatePdf,
  generateCertificateId,
  generateVerificationCode,
} from '@/lib/training/certificate-pdf'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/**
 * GET /api/training/certificate/[courseId] — download completion certificate PDF.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ courseId: string }> }) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId } = await ctx.params
  const course = await getCourseBySlug(courseId)
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }
  if (profile.role !== 'admin') {
    const enrolled = await hasActiveEnrollment(profile.email, courseId)
    if (!enrolled) {
      return NextResponse.json(
        { error: 'Access not assigned. Please contact Shamal training admin.' },
        { status: 403 },
      )
    }
  }

  const progress = await getProgressForCourse(profile.email, courseId)
  const progressPercent = progress?.progressPercent ?? 0
  const completed = progress?.completed || progressPercent >= 100
  const storedSubmissions = await listAssignmentSubmissionsForCourse(profile.email, courseId)
  const submissions = storedSubmissions.map((s) => ({
    scope: s.scope,
    scopeId: s.scopeId,
    status: s.status,
  }))

  const eligibility = evaluateCertificateEligibility({
    course,
    progressPercent,
    completed,
    submissions,
  })

  if (!eligibility.eligible) {
    return NextResponse.json(
      { error: eligibility.blockMessage || 'Certificate not available yet.' },
      { status: 403 },
    )
  }

  let existing = await findCertificateForStudentCourse(profile.email, courseId)
  if (!existing) {
    const certificateId = generateCertificateId()
    const verificationCode = generateVerificationCode()
    const issuedAt = new Date().toISOString()
    await saveCertificate({
      certificateId,
      verificationCode,
      studentEmail: profile.email,
      studentName: profile.name,
      courseSlug: courseId,
      courseTitle: course.title,
      issuedAt,
    })
    existing = { certificateId, verificationCode, issuedAt }
  }

  const pdf = await buildCertificatePdf({
    studentName: profile.name,
    courseTitle: course.title,
    issuedAt: new Date(existing.issuedAt),
    certificateId: existing.certificateId,
    verificationCode: existing.verificationCode,
    verificationUrl: `${new URL(_req.url).origin}/api/training/certificate/verify?code=${encodeURIComponent(existing.verificationCode)}`,
  })

  const filename = `shamal-certificate-${courseId}.pdf`
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
