/**
 * Shamal Technologies academy course catalog (seed + type definitions).
 */

/** Local demo videos used when no lesson video is uploaded in Payload yet. */
export const TRAINING_DEMO_VIDEOS = [
  '/media/hero-banners/hero-video.mp4',
  '/media/hero-banners/hero-about.mp4',
] as const

export function demoVideoUrlForLessonIndex(index: number): string {
  return TRAINING_DEMO_VIDEOS[index % TRAINING_DEMO_VIDEOS.length]
}

function enrichCoursesWithDemoVideos(courses: TrainingCourse[]): TrainingCourse[] {
  return courses.map((course) => {
    let idx = 0
    return {
      ...course,
      modules: course.modules.map((mod) => ({
        ...mod,
        videos: mod.videos.map((v) => ({
          ...v,
          videoUrl: v.videoUrl ?? demoVideoUrlForLessonIndex(idx++),
        })),
      })),
    }
  })
}

export type TrainingVideo = {
  id: string
  title: string
  durationMin?: number
  previewAllowed?: boolean
  videoUrl?: string
  documentUrl?: string
  content?: string
  assignment?: TrainingAssignment
}

export type TrainingModule = {
  id: string
  title: string
  description?: string
  videos: TrainingVideo[]
  assignment?: TrainingAssignment
}

export type TrainingAssignment = {
  enabled: boolean
  scope: 'course' | 'module' | 'lesson'
  scopeId: string
  title: string
  instructions: string
  referenceFileUrl?: string
  dueDate?: string
  submissionType: 'text' | 'file' | 'both'
  requiredForCertificate: boolean
  requireAdminAcceptance: boolean
}

export type TrainingInstructor = {
  name: string
  title: string
  bio: string
}

export type TrainingCourse = {
  id: string
  title: string
  description: string
  thumbnail: string
  banner?: string
  durationHours?: number
  learningObjectives: string[]
  instructor: TrainingInstructor
  certificateEnabled: boolean
  assignment?: TrainingAssignment
  modules: TrainingModule[]
}

const RAW_TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'drone-fundamentals',
    title: 'Drone Operations Fundamentals',
    description:
      'Build the operational foundation for commercial UAS work in Saudi Arabia — safety culture, GACA-aligned procedures, mission planning, and quality-assured data capture for survey, inspection, and geospatial delivery.',
    thumbnail: '/media/hero-banners/hero-services.png',
    banner: '/media/hero-banners/hero-services.png',
    durationHours: 6,
    certificateEnabled: true,
    learningObjectives: [
      'Apply Shamal pre-flight and site safety protocols for commercial drone operations.',
      'Interpret KSA regulatory requirements relevant to aerial survey and inspection missions.',
      'Plan flight missions with appropriate altitudes, patterns, and client deliverables in mind.',
      'Execute data capture workflows with ground control and QA checkpoints before processing.',
    ],
    instructor: {
      name: 'Shamal Technologies Training Team',
      title: 'Certified UAS & Geospatial Instructors',
      bio: 'Shamal instructors are certified drone pilots and geospatial specialists with extensive field experience across construction, infrastructure, mining, and environmental projects in the Kingdom.',
    },
    modules: [
      {
        id: 'm1',
        title: 'Safety, Compliance & Operations Framework',
        description:
          'Establish the safety mindset and regulatory awareness required for every Shamal field deployment.',
        videos: [
          {
            id: 'v1',
            title: 'Introduction to Shamal UAS operations',
            previewAllowed: true,
            durationMin: 15,
            content:
              'Welcome to Shamal Technologies Academy. This lesson outlines how commercial drone operations support our geospatial services, the standards we expect in the field, and how this course prepares you for real project workflows across Saudi Arabia.',
          },
          {
            id: 'v2',
            title: 'Regulatory landscape & GACA considerations',
            previewAllowed: true,
            durationMin: 22,
            content:
              'Understand the regulatory framework for commercial UAS operations in the Kingdom, including operator responsibilities, airspace awareness, and documentation practices. Always confirm the latest GACA guidance before flight.',
          },
          {
            id: 'v3',
            title: 'Pre-flight checks & risk assessment',
            durationMin: 18,
            content:
              'Learn Shamal’s structured pre-flight checklist: equipment inspection, crew briefing, NOTAM review, weather limits, and site-specific hazards for industrial and urban environments.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Mission Planning & Flight Execution',
        description: 'Translate client scope into safe, efficient flight plans and repeatable capture patterns.',
        videos: [
          {
            id: 'v4',
            title: 'Mission planning for survey & inspection',
            durationMin: 28,
            content:
              'From client brief to flight plan: defining GSD, overlap, flight lines, battery logistics, and contingency procedures for construction, infrastructure, and asset inspection projects.',
          },
          {
            id: 'v5',
            title: 'In-field execution & communication',
            durationMin: 24,
            content:
              'Best practices for crew coordination, client liaison on site, adapting to changing conditions, and maintaining chain-of-custody for captured data.',
          },
        ],
      },
      {
        id: 'm3',
        title: 'Data Quality & Delivery Readiness',
        description: 'Ensure captured data meets Shamal quality standards before processing and client handover.',
        videos: [
          {
            id: 'v6',
            title: 'Ground control & georeferencing essentials',
            durationMin: 26,
            content:
              'Ground control placement, RTK/PPK considerations, and checkpoint strategy for survey-grade deliverables in KSA project conditions.',
          },
          {
            id: 'v7',
            title: 'QA workflow & client delivery',
            durationMin: 20,
            content:
              'Shamal QA gates: completeness checks, overlap analysis, metadata standards, and packaging outputs for photogrammetry, inspection, or GIS teams.',
          },
        ],
      },
    ],
  },
  {
    id: 'aerial-survey-applications',
    title: 'Aerial Survey Applications for Enterprise',
    description:
      'Advanced applications of drone-based aerial survey for construction progress, volumetrics, corridor mapping, and asset inspection — aligned with Shamal service delivery models.',
    thumbnail: '/media/hero-banners/hero-services.png',
    banner: '/media/hero-banners/hero-services.png',
    durationHours: 4,
    certificateEnabled: true,
    learningObjectives: [
      'Select appropriate acquisition patterns for construction monitoring and volumetric analysis.',
      'Align flight parameters with downstream photogrammetry and BIM workflows.',
      'Identify quality indicators for inspection and progress reporting deliverables.',
    ],
    instructor: {
      name: 'Shamal Technologies Training Team',
      title: 'Senior Geospatial Consultants',
      bio: 'Delivered from Shamal’s project portfolio across transportation, mining, and construction sectors in Saudi Arabia and the Gulf region.',
    },
    modules: [
      {
        id: 'm1',
        title: 'Construction & Infrastructure Monitoring',
        description: 'Drone survey workflows for progress tracking and as-built verification.',
        videos: [
          {
            id: 'v1',
            title: 'Progress monitoring methodology',
            previewAllowed: true,
            durationMin: 20,
            content:
              'Establish repeatable capture schedules, baseline comparisons, and reporting formats for construction and infrastructure clients.',
          },
          {
            id: 'v2',
            title: 'Volumetric & cut-fill applications',
            durationMin: 25,
            content:
              'Flight design and QA considerations for stockpile, earthworks, and volumetric reporting with survey-grade outputs.',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Corridor & Asset Inspection',
        description: 'Linear assets, utilities, and structural inspection from the air.',
        videos: [
          {
            id: 'v3',
            title: 'Corridor mapping fundamentals',
            durationMin: 22,
            content:
              'Planning corridor missions for roads, pipelines, and utilities with appropriate overlap and safety buffers.',
          },
          {
            id: 'v4',
            title: 'Visual inspection data standards',
            durationMin: 18,
            content:
              'Image resolution, oblique capture, and annotation standards for asset inspection deliverables.',
          },
        ],
      },
    ],
  },
]

export const TRAINING_COURSES = enrichCoursesWithDemoVideos(RAW_TRAINING_COURSES)

export function applyDemoVideosToCourse(course: TrainingCourse): TrainingCourse {
  let idx = 0
  return {
    ...course,
    modules: course.modules.map((mod) => ({
      ...mod,
      videos: mod.videos.map((v) => ({
        ...v,
        videoUrl: v.videoUrl ?? demoVideoUrlForLessonIndex(idx++),
      })),
    })),
  }
}

export function getCourseById(id: string): TrainingCourse | undefined {
  return TRAINING_COURSES.find((c) => c.id === id)
}

export function courseCompletionPercent(course: TrainingCourse, watchedLessonIds: Set<string>): number {
  const all = course.modules.flatMap((m) => m.videos)
  if (all.length === 0) return 0
  let count = 0
  for (const v of all) {
    if (watchedLessonIds.has(v.id)) count++
  }
  return Math.round((count / all.length) * 100)
}

export function watchedDurationMinutes(course: TrainingCourse, watchedLessonIds: Set<string>): number {
  let total = 0
  for (const mod of course.modules) {
    for (const lesson of mod.videos) {
      if (watchedLessonIds.has(lesson.id)) {
        total += lesson.durationMin ?? 0
      }
    }
  }
  return total
}
