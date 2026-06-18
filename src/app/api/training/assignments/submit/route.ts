import { NextResponse } from 'next/server'

import configPromise from '@/payload.config'
import { getPayload } from 'payload'

import { getCourseBySlug } from '@/lib/training/load-courses'
import { hasActiveEnrollment, upsertAssignmentSubmission } from '@/lib/training/repository'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

/**
 * POST /api/training/assignments/submit — student assignment submission (multipart).
 */
export async function POST(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const courseId = String(formData.get('courseId') || '').trim()
  const scope = String(formData.get('scope') || '').trim() as 'course' | 'module' | 'lesson'
  const scopeId = String(formData.get('scopeId') || '').trim()
  const textAnswer = String(formData.get('textAnswer') || '').trim()
  const file = formData.get('file') as File | null

  if (!courseId || !scope || !scopeId) {
    return NextResponse.json({ error: 'courseId, scope, and scopeId are required' }, { status: 400 })
  }
  if (!['course', 'module', 'lesson'].includes(scope)) {
    return NextResponse.json({ error: 'Invalid assignment scope' }, { status: 400 })
  }

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

  let assignment
  if (scope === 'course') {
    assignment = course.assignment?.scopeId === scopeId ? course.assignment : undefined
  } else if (scope === 'module') {
    assignment = course.modules.find((m) => m.id === scopeId)?.assignment
  } else {
    assignment = undefined
    for (const mod of course.modules) {
      const lesson = mod.videos.find((v) => v.id === scopeId)
      if (lesson?.assignment) {
        assignment = lesson.assignment
        break
      }
    }
  }

  if (!assignment?.enabled) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  const needsText = assignment.submissionType === 'text' || assignment.submissionType === 'both'
  const needsFile = assignment.submissionType === 'file' || assignment.submissionType === 'both'

  if (needsText && !textAnswer) {
    return NextResponse.json({ error: 'Text response is required for this assignment' }, { status: 400 })
  }
  if (needsFile && (!file || file.size === 0)) {
    return NextResponse.json({ error: 'File upload is required for this assignment' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  let submittedFileId: string | undefined

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const uploaded = await payload.create({
      collection: 'media',
      data: { alt: `${assignment.title} — ${profile.email}` },
      file: {
        data: buffer,
        mimetype: file.type || 'application/octet-stream',
        name: file.name || 'assignment-upload',
        size: file.size,
      },
      overrideAccess: true,
    })
    submittedFileId = typeof uploaded.id === 'string' ? uploaded.id : String(uploaded.id)
  }

  const saved = await upsertAssignmentSubmission({
    studentId: profile.id,
    studentEmail: profile.email,
    courseSlug: courseId,
    scope,
    scopeId,
    assignmentTitle: assignment.title,
    textAnswer: textAnswer || undefined,
    submittedFileId,
  })

  return NextResponse.json({
    ok: true,
    submission: saved,
  })
}
