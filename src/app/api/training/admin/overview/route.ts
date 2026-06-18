import { NextResponse } from 'next/server'

import configPromise from '@/payload.config'
import { getPayload } from 'payload'

import { loadAllCourses } from '@/lib/training/load-courses'
import { getCurrentTrainingProfile } from '@/lib/training/profile'

export async function GET(req: Request) {
  const profile = await getCurrentTrainingProfile()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const courseFilter = new URL(req.url).searchParams.get('course')?.trim() || ''
  const payload = await getPayload({ config: configPromise })
  const courses = await loadAllCourses()
  const titleBySlug = new Map(courses.map((course) => [course.id, course.title]))

  const [students, enrollments, progressRows, submissions, certificates] = await Promise.all([
    payload.find({ collection: 'training-students', limit: 1000, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'training-enrollments', limit: 2000, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'training-progress', limit: 2000, depth: 0, overrideAccess: true }),
    payload.find({
      collection: 'training-assignment-submissions',
      limit: 4000,
      depth: 0,
      overrideAccess: true,
      sort: '-submittedAt',
    }),
    payload.find({ collection: 'training-certificates', limit: 2000, depth: 0, overrideAccess: true }),
  ])

  const studentByEmail = new Map(
    students.docs.map((student) => [String(student.email).toLowerCase(), String(student.name || '')]),
  )

  const progressByKey = new Map(
    progressRows.docs.map((progress) => [
      `${String(progress.studentEmail).toLowerCase()}::${String(progress.courseSlug)}`,
      {
        progressPercent: Number(progress.progressPercent || 0),
        completed: Boolean(progress.completed),
        lastActivity: progress.lastActivity || progress.updatedAt || null,
      },
    ]),
  )

  const certificateByKey = new Map(
    certificates.docs.map((certificate) => [
      `${String(certificate.studentEmail).toLowerCase()}::${String(certificate.courseSlug)}`,
      {
        certificateId: String(certificate.certificateId || ''),
        issuedAt: certificate.issuedAt || null,
      },
    ]),
  )

  const assignmentByKey = new Map<string, { status: string; remarks?: string }>()
  for (const submission of submissions.docs) {
    const key = `${String(submission.studentEmail).toLowerCase()}::${String(submission.courseSlug)}`
    if (assignmentByKey.has(key)) continue
    assignmentByKey.set(key, {
      status: String(submission.status || 'submitted'),
      remarks: submission.adminRemarks || undefined,
    })
  }

  const rows = enrollments.docs
    .filter((enrollment) => (courseFilter ? String(enrollment.courseSlug) === courseFilter : true))
    .map((enrollment) => {
      const email = String(enrollment.studentEmail || '').toLowerCase()
      const courseSlug = String(enrollment.courseSlug || '')
      const key = `${email}::${courseSlug}`
      const progress = progressByKey.get(key)
      const assignment = assignmentByKey.get(key)
      const certificate = certificateByKey.get(key)
      return {
        studentName: studentByEmail.get(email) || 'Unknown',
        studentEmail: email,
        courseSlug,
        courseTitle: titleBySlug.get(courseSlug) || courseSlug,
        enrollmentStatus: String(enrollment.status || 'active'),
        progressPercent: progress?.progressPercent || 0,
        assignmentStatus: assignment?.status || 'pending',
        assignmentRemarks: assignment?.remarks,
        certificateStatus: certificate?.certificateId ? 'issued' : 'not-issued',
        completionDate: certificate?.issuedAt || (progress?.completed ? progress?.lastActivity : null),
      }
    })

  return NextResponse.json({
    rows,
    totalRows: rows.length,
  })
}
