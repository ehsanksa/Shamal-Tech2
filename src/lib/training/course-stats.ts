import type { TrainingCourse } from './courses'

export function countLessons(course: TrainingCourse): number {
  return course.modules.reduce((n, m) => n + m.videos.length, 0)
}

export function totalDurationMinutes(course: TrainingCourse): number {
  return course.modules.reduce(
    (n, m) => n + m.videos.reduce((s, v) => s + (v.durationMin ?? 0), 0),
    0,
  )
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`
}

export function formatHoursFromMinutes(totalMinutes: number): string {
  const hours = Math.round((totalMinutes / 60) * 10) / 10
  return hours % 1 === 0 ? String(hours) : hours.toFixed(1)
}

export function findFirstIncompleteLesson(
  course: TrainingCourse,
  watched: Set<string>,
): { moduleId: string; lessonId: string; title: string } | null {
  for (const mod of course.modules) {
    for (const lesson of mod.videos) {
      if (!watched.has(lesson.id)) {
        return { moduleId: mod.id, lessonId: lesson.id, title: lesson.title }
      }
    }
  }
  return null
}
