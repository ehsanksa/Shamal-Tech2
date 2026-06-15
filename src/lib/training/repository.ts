/**
 * Unified training data layer: Payload MongoDB (default) with optional ClickUp override.
 */

import configPromise from '@/payload.config'
import { getPayload } from 'payload'

import type { TrainingRecord, TrainingUserFields } from './clickup'
import * as clickup from './clickup'
import { isClickupTrainingConfigured } from './env'
import type { TrainingRole } from './types'

export type TrainingUserRecord = TrainingRecord<TrainingUserFields>

function useClickup(): boolean {
  return isClickupTrainingConfigured()
}

async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

function payloadStudentToRecord(doc: {
  id: string | number
  createdAt?: string
  email: string
  name: string
  passwordHash: string
  role?: string | null
  warmLead?: boolean | null
}): TrainingUserRecord {
  return {
    id: String(doc.id),
    createdTime: doc.createdAt || new Date().toISOString(),
    fields: {
      Email: doc.email,
      Name: doc.name,
      Password_Hash: doc.passwordHash,
      Role: doc.role || 'trial',
      Warm_Lead: Boolean(doc.warmLead),
    },
  }
}

export async function findUserByEmail(email: string): Promise<TrainingUserRecord | null> {
  if (useClickup()) {
    return clickup.findUserByEmail(email)
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-students',
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = result.docs[0]
  if (!doc) return null
  return payloadStudentToRecord(doc as Parameters<typeof payloadStudentToRecord>[0])
}

export async function createUser(input: {
  email: string
  name: string
  phone?: string
  passwordHash: string
  role: TrainingRole
}): Promise<TrainingUserRecord> {
  if (useClickup()) {
    return clickup.createUser(input)
  }

  const payload = await getPayloadClient()
  const doc = await payload.create({
    collection: 'training-students',
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      phone: input.phone,
      passwordHash: input.passwordHash,
      role: input.role,
      warmLead: false,
    },
    overrideAccess: true,
  })

  return payloadStudentToRecord(doc as Parameters<typeof payloadStudentToRecord>[0])
}

export async function updateUserRole(recordId: string, role: TrainingRole): Promise<void> {
  if (useClickup()) {
    await clickup.updateUser(recordId, { Role: role })
    return
  }

  const payload = await getPayloadClient()
  await payload.update({
    collection: 'training-students',
    id: recordId,
    data: { role },
    overrideAccess: true,
  })
}

export async function setWarmLead(recordId: string, warmLead: boolean): Promise<void> {
  if (useClickup()) {
    await clickup.updateUser(recordId, { Warm_Lead: warmLead })
    return
  }

  const payload = await getPayloadClient()
  await payload.update({
    collection: 'training-students',
    id: recordId,
    data: { warmLead },
    overrideAccess: true,
  })
}

export async function listEnrollmentsForStudent(email: string): Promise<
  Array<{ courseSlug: string; accessLevel: string; status: string }>
> {
  if (useClickup()) {
    return []
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-enrollments',
    where: { studentEmail: { equals: email.toLowerCase() } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  return result.docs.map((doc) => ({
    courseSlug: String(doc.courseSlug),
    accessLevel: String(doc.accessLevel || 'trial'),
    status: String(doc.status || 'active'),
  }))
}

export async function listProgressForStudent(email: string): Promise<
  Array<{
    courseSlug: string
    progressPercent: number
    watchedIds: string[]
    completed: boolean
    lastActivity?: string
  }>
> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-progress',
    where: { studentEmail: { equals: email.toLowerCase() } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
    sort: '-lastActivity',
  })
  return result.docs.map((doc) => {
    let watchedIds: string[] = []
    if (Array.isArray(doc.watchedLessonIds)) {
      watchedIds = doc.watchedLessonIds.filter((x): x is string => typeof x === 'string')
    }
    return {
      courseSlug: String(doc.courseSlug),
      progressPercent: Number(doc.progressPercent ?? 0),
      watchedIds,
      completed: Boolean(doc.completed),
      lastActivity: doc.lastActivity || doc.updatedAt || undefined,
    }
  })
}

export async function getProgressForCourse(
  email: string,
  courseId: string,
): Promise<{ progressPercent: number; watchedIds: string[]; completed: boolean } | null> {
  const payloadProgress = await getProgressFromPayload(email, courseId)
  if (payloadProgress) return payloadProgress

  if (useClickup()) {
    const clickupProgress = await clickup.getProgressForCourse(email, courseId)
    if (clickupProgress) {
      await upsertProgressToPayload({
        email,
        courseId,
        progressPercent: clickupProgress.progressPercent,
        completed: clickupProgress.completed,
        watchedVideoIds: clickupProgress.watchedIds,
      })
      return clickupProgress
    }
  }

  return null
}

async function getProgressFromPayload(
  email: string,
  courseId: string,
): Promise<{ progressPercent: number; watchedIds: string[]; completed: boolean } | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-progress',
    where: {
      and: [
        { studentEmail: { equals: email.toLowerCase() } },
        { courseSlug: { equals: courseId.trim() } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = result.docs[0] as {
    progressPercent?: number | null
    watchedLessonIds?: unknown
    completed?: boolean | null
  } | undefined
  if (!doc) return null

  let watchedIds: string[] = []
  if (Array.isArray(doc.watchedLessonIds)) {
    watchedIds = doc.watchedLessonIds.filter((x): x is string => typeof x === 'string')
  }

  return {
    progressPercent: Number(doc.progressPercent ?? 0),
    watchedIds,
    completed: Boolean(doc.completed),
  }
}

async function upsertProgressToPayload(input: {
  email: string
  courseId: string
  progressPercent: number
  completed: boolean
  watchedVideoIds?: string[]
}): Promise<void> {
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'training-progress',
    where: {
      and: [
        { studentEmail: { equals: input.email.toLowerCase() } },
        { courseSlug: { equals: input.courseId.trim() } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const data = {
    studentEmail: input.email.toLowerCase(),
    courseSlug: input.courseId.trim(),
    progressPercent: input.progressPercent,
    completed: input.completed,
    watchedLessonIds: input.watchedVideoIds ?? [],
    lastActivity: new Date().toISOString(),
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'training-progress',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'training-progress',
      data,
      overrideAccess: true,
    })
  }
}

export async function upsertProgress(input: {
  email: string
  courseId: string
  progressPercent: number
  completed: boolean
  watchedVideoIds?: string[]
}): Promise<void> {
  await upsertProgressToPayload(input)

  if (useClickup()) {
    try {
      await clickup.upsertProgress(input)
    } catch (error) {
      console.error('ClickUp progress sync failed (Payload saved):', error)
    }
  }
}

export async function upsertEnrollment(input: {
  studentId: string
  studentEmail: string
  courseSlug: string
  accessLevel: 'trial' | 'paid' | 'free' | 'manual'
  notes?: string
}): Promise<void> {
  if (useClickup()) {
    if (input.accessLevel === 'paid' || input.accessLevel === 'free' || input.accessLevel === 'manual') {
      await updateUserRole(input.studentId, 'paid')
    }
    return
  }

  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'training-enrollments',
    where: {
      and: [
        { studentEmail: { equals: input.studentEmail.toLowerCase() } },
        { courseSlug: { equals: input.courseSlug.trim() } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const data = {
    student: input.studentId,
    studentEmail: input.studentEmail.toLowerCase(),
    courseSlug: input.courseSlug.trim(),
    accessLevel: input.accessLevel,
    status: 'active' as const,
    notes: input.notes,
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'training-enrollments',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'training-enrollments',
      data,
      overrideAccess: true,
    })
  }

  if (input.accessLevel === 'paid' || input.accessLevel === 'free' || input.accessLevel === 'manual') {
    await updateUserRole(input.studentId, 'paid')
  }
}

export async function createPaymentRecord(input: {
  email: string
  amount: number
  currency: string
  stripeSessionId: string
}): Promise<void> {
  if (useClickup()) {
    await clickup.createPaymentRecord(input)
  }
}

export async function listUsers(maxRecords = 200): Promise<TrainingUserRecord[]> {
  if (useClickup()) {
    return clickup.listUsers(maxRecords)
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-students',
    limit: maxRecords,
    depth: 0,
    overrideAccess: true,
    sort: '-createdAt',
  })
  return result.docs.map((doc) =>
    payloadStudentToRecord(doc as Parameters<typeof payloadStudentToRecord>[0]),
  )
}

export async function listProgressRecords(maxRecords = 200): Promise<
  Array<{ id: string; createdTime: string; fields: Record<string, unknown> }>
> {
  if (useClickup()) {
    return clickup.listProgress(maxRecords)
  }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-progress',
    limit: maxRecords,
    depth: 0,
    overrideAccess: true,
    sort: '-updatedAt',
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    createdTime: doc.updatedAt || doc.createdAt || new Date().toISOString(),
    fields: {
      user_email: doc.studentEmail,
      course_id: doc.courseSlug,
      progress_percent: doc.progressPercent,
      completed: doc.completed,
      watched_videos: JSON.stringify(doc.watchedLessonIds ?? []),
    },
  }))
}

export async function listPaymentRecords(maxRecords = 200): Promise<
  Array<{ id: string; createdTime: string; fields: Record<string, unknown> }>
> {
  if (useClickup()) {
    return clickup.listPayments(maxRecords)
  }
  return []
}

export async function findCertificateForStudentCourse(
  email: string,
  courseSlug: string,
): Promise<{ certificateId: string; verificationCode: string; issuedAt: string } | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-certificates',
    where: {
      and: [
        { studentEmail: { equals: email.toLowerCase() } },
        { courseSlug: { equals: courseSlug.trim() } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = result.docs[0] as {
    certificateId?: string
    verificationCode?: string
    issuedAt?: string
  } | undefined
  if (!doc?.certificateId) return null
  return {
    certificateId: doc.certificateId,
    verificationCode: doc.verificationCode || '',
    issuedAt: doc.issuedAt || new Date().toISOString(),
  }
}

export async function saveCertificate(input: {
  certificateId: string
  verificationCode: string
  studentEmail: string
  studentName: string
  courseSlug: string
  courseTitle: string
  issuedAt: string
}): Promise<void> {
  const payload = await getPayloadClient()
  await payload.create({
    collection: 'training-certificates',
    data: {
      certificateId: input.certificateId,
      verificationCode: input.verificationCode,
      studentEmail: input.studentEmail.toLowerCase(),
      studentName: input.studentName,
      courseSlug: input.courseSlug,
      courseTitle: input.courseTitle,
      issuedAt: input.issuedAt,
    },
    overrideAccess: true,
  })
}

export type StoredAssignmentSubmission = {
  id: string
  scope: 'course' | 'module' | 'lesson'
  scopeId: string
  assignmentTitle: string
  textAnswer?: string
  submittedFileUrl?: string
  submittedAt: string
  status: 'submitted' | 'reviewed' | 'accepted' | 'rejected'
  adminRemarks?: string
}

function mapSubmissionDoc(
  doc: {
    id: string | number
    scope?: string | null
    scopeId?: string | null
    assignmentTitle?: string | null
    textAnswer?: string | null
    submittedFile?: { url?: string | null; updatedAt?: string | null } | string | number | null
    submittedAt?: string | null
    status?: string | null
    adminRemarks?: string | null
  },
  getUrl: (media: { url?: string | null; updatedAt?: string | null }) => string | undefined,
): StoredAssignmentSubmission {
  let submittedFileUrl: string | undefined
  const file = doc.submittedFile
  if (file && typeof file === 'object' && 'url' in file && file.url) {
    submittedFileUrl = getUrl(file)
  }
  return {
    id: String(doc.id),
    scope: (doc.scope as StoredAssignmentSubmission['scope']) || 'course',
    scopeId: String(doc.scopeId || ''),
    assignmentTitle: String(doc.assignmentTitle || ''),
    textAnswer: doc.textAnswer || undefined,
    submittedFileUrl,
    submittedAt: doc.submittedAt || new Date().toISOString(),
    status: (doc.status as StoredAssignmentSubmission['status']) || 'submitted',
    adminRemarks: doc.adminRemarks || undefined,
  }
}

export async function listAssignmentSubmissionsForCourse(
  email: string,
  courseSlug: string,
): Promise<StoredAssignmentSubmission[]> {
  if (useClickup()) return []

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'training-assignment-submissions',
    where: {
      and: [
        { studentEmail: { equals: email.toLowerCase() } },
        { courseSlug: { equals: courseSlug.trim() } },
      ],
    },
    limit: 100,
    depth: 1,
    overrideAccess: true,
    sort: '-submittedAt',
  })

  const { getMediaUrl } = await import('@/utilities/getMediaUrl')
  return result.docs.map((doc) =>
    mapSubmissionDoc(doc as Parameters<typeof mapSubmissionDoc>[0], (media) =>
      media.url ? getMediaUrl(media.url, media.updatedAt) : undefined,
    ),
  )
}

export async function upsertAssignmentSubmission(input: {
  studentId: string
  studentEmail: string
  courseSlug: string
  scope: 'course' | 'module' | 'lesson'
  scopeId: string
  assignmentTitle: string
  textAnswer?: string
  submittedFileId?: string
}): Promise<StoredAssignmentSubmission> {
  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'training-assignment-submissions',
    where: {
      and: [
        { studentEmail: { equals: input.studentEmail.toLowerCase() } },
        { courseSlug: { equals: input.courseSlug.trim() } },
        { scope: { equals: input.scope } },
        { scopeId: { equals: input.scopeId.trim() } },
      ],
    },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const submittedAt = new Date().toISOString()
  const data = {
    student: input.studentId,
    studentEmail: input.studentEmail.toLowerCase(),
    courseSlug: input.courseSlug.trim(),
    scope: input.scope,
    scopeId: input.scopeId.trim(),
    assignmentTitle: input.assignmentTitle,
    textAnswer: input.textAnswer,
    submittedFile: input.submittedFileId,
    submittedAt,
    status: 'submitted' as const,
    adminRemarks: undefined as string | undefined,
  }

  let doc
  if (existing.docs[0]) {
    doc = await payload.update({
      collection: 'training-assignment-submissions',
      id: existing.docs[0].id,
      data,
      depth: 1,
      overrideAccess: true,
    })
  } else {
    doc = await payload.create({
      collection: 'training-assignment-submissions',
      data,
      depth: 1,
      overrideAccess: true,
    })
  }

  const { getMediaUrl } = await import('@/utilities/getMediaUrl')
  return mapSubmissionDoc(doc as Parameters<typeof mapSubmissionDoc>[0], (media) =>
    media.url ? getMediaUrl(media.url, media.updatedAt) : undefined,
  )
}

export { TRAINING_CLICKUP_FIELDS } from './clickup'
