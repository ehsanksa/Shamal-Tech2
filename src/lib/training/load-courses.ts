/**
 * Load training courses from Payload CMS, with static fallback + auto-seed.
 */

import configPromise from '@/payload.config'
import { getPayload } from 'payload'

import {
  TRAINING_COURSES,
  applyDemoVideosToCourse,
  demoVideoUrlForLessonIndex,
  getCourseById,
  type TrainingAssignment,
  type TrainingCourse,
  type TrainingModule,
  type TrainingVideo,
} from './courses'
import { mapAssignmentGroup } from './assignments'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type MediaDoc = {
  url?: string | null
  updatedAt?: string | null
  mimeType?: string | null
  filename?: string | null
}

function mediaUrl(media: MediaDoc | string | number | null | undefined): string | undefined {
  if (!media || typeof media === 'string' || typeof media === 'number') return undefined
  if (!media.url) return undefined
  return getMediaUrl(media.url, media.updatedAt)
}

function isLegacyPlaceholderContent(content: string | null | undefined): boolean {
  if (!content) return false
  const lower = content.toLowerCase()
  return (
    lower.includes('upload a video') ||
    lower.includes('admin panel to replace') ||
    lower.includes('placeholder') ||
    lower.includes('lesson content will appear')
  )
}

function resolveLessonContent(
  courseSlug: string,
  lessonId: string,
  payloadContent: string | null | undefined,
  staticContent: string | undefined,
): string | undefined {
  if (payloadContent && !isLegacyPlaceholderContent(payloadContent)) {
    return payloadContent
  }
  const staticCourse = getCourseById(courseSlug)
  if (staticCourse) {
    for (const mod of staticCourse.modules) {
      const lesson = mod.videos.find((v) => v.id === lessonId)
      if (lesson?.content) return lesson.content
    }
  }
  return staticContent || payloadContent || undefined
}

function mergeStaticCourseDefaults(slug: string, mapped: TrainingCourse): TrainingCourse {
  const template = getCourseById(slug)
  if (!template) return mapped

  return {
    ...mapped,
    banner: mapped.banner || template.banner || mapped.thumbnail,
    durationHours: mapped.durationHours ?? template.durationHours,
    certificateEnabled: mapped.certificateEnabled ?? template.certificateEnabled,
    learningObjectives:
      mapped.learningObjectives.length > 0 ? mapped.learningObjectives : template.learningObjectives,
    instructor: {
      name: mapped.instructor.name || template.instructor.name,
      title: mapped.instructor.title || template.instructor.title,
      bio: mapped.instructor.bio || template.instructor.bio,
    },
    description:
      isLegacyPlaceholderContent(mapped.description) || mapped.description.length < 40
        ? template.description
        : mapped.description,
    modules: (() => {
      let demoIdx = 0
      return mapped.modules.map((mod) => {
        const templateMod = template.modules.find((m) => m.id === mod.id)
        return {
          ...mod,
          title: mod.title.startsWith('Module ') && templateMod ? templateMod.title : mod.title,
          description: mod.description || templateMod?.description,
          videos: mod.videos.map((lesson) => {
            const templateLesson = templateMod?.videos.find((v) => v.id === lesson.id)
            const demoUrl = demoVideoUrlForLessonIndex(demoIdx++)
            return {
              ...lesson,
              title: lesson.title.startsWith('Lesson ') && templateLesson ? templateLesson.title : lesson.title,
              durationMin: lesson.durationMin ?? templateLesson?.durationMin,
              previewAllowed: lesson.previewAllowed ?? templateLesson?.previewAllowed,
              videoUrl: lesson.videoUrl || templateLesson?.videoUrl || demoUrl,
              documentUrl: lesson.documentUrl || templateLesson?.documentUrl,
              content: resolveLessonContent(slug, lesson.id, lesson.content, templateLesson?.content),
            }
          }),
        }
      })
    })(),
  }
}

function mapPayloadAssignmentGroup(
  raw: {
    enabled?: boolean | null
    title?: string | null
    instructions?: string | null
    referenceFile?: MediaDoc | string | number | null
    dueDate?: string | null
    submissionType?: string | null
    requiredForCertificate?: boolean | null
    requireAdminAcceptance?: boolean | null
  } | null | undefined,
  scope: 'course' | 'module' | 'lesson',
  scopeId: string,
): TrainingAssignment | undefined {
  if (!raw) return undefined
  return mapAssignmentGroup(
    {
      enabled: raw.enabled,
      title: raw.title,
      instructions: raw.instructions,
      referenceFileUrl: mediaUrl(raw.referenceFile as MediaDoc),
      dueDate: raw.dueDate,
      submissionType: raw.submissionType,
      requiredForCertificate: raw.requiredForCertificate,
      requireAdminAcceptance: raw.requireAdminAcceptance,
    },
    scope,
    scopeId,
  )
}

function mapPayloadCourse(doc: {
  slug: string
  title: string
  description: string
  thumbnail?: MediaDoc | string | number | null
  banner?: MediaDoc | string | number | null
  durationHours?: number | null
  certificateEnabled?: boolean | null
  learningObjectives?: Array<{ objective?: string | null }> | null
  instructorName?: string | null
  instructorTitle?: string | null
  instructorBio?: string | null
  assignment?: {
    enabled?: boolean | null
    title?: string | null
    instructions?: string | null
    referenceFile?: MediaDoc | string | number | null
    dueDate?: string | null
    submissionType?: string | null
    requiredForCertificate?: boolean | null
    requireAdminAcceptance?: boolean | null
  } | null
  modules?: Array<{
    lessonId?: string | null
    title?: string | null
    description?: string | null
    assignment?: Parameters<typeof mapPayloadCourse>[0]['assignment']
    lessons?: Array<{
      lessonId?: string | null
      title?: string | null
      durationMin?: number | null
      previewAllowed?: boolean | null
      video?: MediaDoc | string | number | null
      document?: MediaDoc | string | number | null
      content?: string | null
      assignment?: Parameters<typeof mapPayloadCourse>[0]['assignment']
    }> | null
  }> | null
}): TrainingCourse {
  const thumb = mediaUrl(doc.thumbnail as MediaDoc) || '/media/hero-banners/hero-services.png'
  const banner = mediaUrl(doc.banner as MediaDoc) || thumb

  const modules: TrainingModule[] = (doc.modules ?? []).map((mod, mi) => {
    const moduleId = mod.lessonId || `m${mi + 1}`
    return {
      id: moduleId,
      title: mod.title || `Module ${mi + 1}`,
      description: mod.description || undefined,
      assignment: mapPayloadAssignmentGroup(mod.assignment, 'module', moduleId),
      videos: (mod.lessons ?? []).map((lesson, li) => {
        const videoUrl = mediaUrl(lesson.video as MediaDoc)
        const documentUrl = mediaUrl(lesson.document as MediaDoc)
        const lessonId = lesson.lessonId || `v${mi + 1}-${li + 1}`
        return {
          id: lessonId,
          title: lesson.title || `Lesson ${li + 1}`,
          durationMin: lesson.durationMin ?? undefined,
          previewAllowed: Boolean(lesson.previewAllowed),
          videoUrl,
          documentUrl,
          content: resolveLessonContent(doc.slug, lessonId, lesson.content, undefined),
          assignment: mapPayloadAssignmentGroup(lesson.assignment, 'lesson', lessonId),
        } satisfies TrainingVideo
      }),
    }
  })

  const courseAssignment = mapPayloadAssignmentGroup(doc.assignment, 'course', doc.slug)

  const mapped: TrainingCourse = {
    id: doc.slug,
    title: doc.title,
    description: doc.description,
    thumbnail: thumb,
    banner,
    durationHours: doc.durationHours ?? undefined,
    certificateEnabled: doc.certificateEnabled !== false,
    learningObjectives: (doc.learningObjectives ?? [])
      .map((o) => o.objective?.trim())
      .filter((o): o is string => Boolean(o)),
    instructor: {
      name: doc.instructorName?.trim() || 'Shamal Technologies Training Team',
      title: doc.instructorTitle?.trim() || 'Certified UAS & Geospatial Instructors',
      bio:
        doc.instructorBio?.trim() ||
        'Shamal instructors are certified drone pilots and geospatial specialists with extensive field experience across Saudi Arabia.',
    },
    assignment: courseAssignment,
    modules,
  }

  return applyDemoVideosToCourse(mergeStaticCourseDefaults(doc.slug, mapped))
}

export async function ensureDefaultCoursesSeeded(): Promise<void> {
  const payload = await getPayload({ config: configPromise })

  for (const course of TRAINING_COURSES) {
    const existing = await payload.find({
      collection: 'training-courses',
      where: { slug: { equals: course.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'training-courses',
      data: {
        title: course.title,
        slug: course.id,
        description: course.description,
        published: true,
        durationHours: course.durationHours,
        certificateEnabled: course.certificateEnabled,
        instructorName: course.instructor.name,
        instructorTitle: course.instructor.title,
        instructorBio: course.instructor.bio,
        learningObjectives: course.learningObjectives.map((objective) => ({ objective })),
        modules: course.modules.map((mod) => ({
          lessonId: mod.id,
          title: mod.title,
          description: mod.description,
          lessons: mod.videos.map((v) => ({
            lessonId: v.id,
            title: v.title,
            durationMin: v.durationMin,
            previewAllowed: Boolean(v.previewAllowed),
            content: v.content,
          })),
        })),
      },
      overrideAccess: true,
    })
  }
}

export async function loadAllCourses(): Promise<TrainingCourse[]> {
  try {
    await ensureDefaultCoursesSeeded()
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'training-courses',
      where: { published: { equals: true } },
      limit: 50,
      depth: 2,
      overrideAccess: true,
    })

    if (result.docs.length === 0) {
      return TRAINING_COURSES
    }

    return result.docs.map((doc) => mapPayloadCourse(doc as Parameters<typeof mapPayloadCourse>[0]))
  } catch (error) {
    console.error('loadAllCourses fallback to static:', error)
    return TRAINING_COURSES
  }
}

export async function getCourseBySlug(slug: string): Promise<TrainingCourse | undefined> {
  const courses = await loadAllCourses()
  return courses.find((c) => c.id === slug)
}

export { courseCompletionPercent } from './courses'
