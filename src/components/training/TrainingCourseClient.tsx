'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TrainingAssignmentCard } from '@/components/training/TrainingAssignmentCard'
import { TrainingCertificateCard } from '@/components/training/TrainingCertificateCard'
import type { CourseClientPayload } from '@/lib/training/course-access'
import { cn } from '@/utilities/ui'

function formatDurationMin(min?: number): string {
  if (!min) return ''
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} hr ${min % 60 ? `${min % 60} min` : ''}`.trim()
}

function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/i.test(url)
}

function vimeoEmbedSrc(url: string): string {
  if (url.includes('player.vimeo.com')) return url
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  return match ? `https://player.vimeo.com/video/${match[1]}` : url
}

function selectLesson(
  lessonId: string,
  courseId: string,
  buildQuery: (lessonId?: string | null) => string,
  router: ReturnType<typeof useRouter>,
  setActiveLessonId: (id: string) => void,
) {
  setActiveLessonId(lessonId)
  router.replace(`/training/courses/${courseId}${buildQuery(lessonId)}`, { scroll: false })
}

export function TrainingCourseClient() {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = String(params?.id || '')
  const simState = searchParams.get('simState')
  const router = useRouter()
  const [data, setData] = useState<CourseClientPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [watched, setWatched] = useState<Set<string>>(new Set())
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [lessonCompleteUi, setLessonCompleteUi] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const buildQuery = useCallback(
    (lessonId?: string | null) => {
      const parts: string[] = []
      if (lessonId) parts.push(`lesson=${encodeURIComponent(lessonId)}`)
      if (simState) parts.push(`simState=${encodeURIComponent(simState)}`)
      return parts.length ? `?${parts.join('&')}` : ''
    },
    [simState],
  )

  const fetchCourse = useCallback(
    (lessonId?: string | null) => {
      if (!courseId) return Promise.resolve()
      return fetch(`/api/training/courses/${courseId}${buildQuery(lessonId)}`, {
        credentials: 'include',
      })
        .then(async (res) => {
          if (res.status === 401) {
            router.push('/training/login')
            return
          }
          if (!res.ok) {
            setError('Could not load course')
            return
          }
          const json = (await res.json()) as CourseClientPayload
          setData(json)
          setWatched(new Set(json.watchedVideoIds || []))
        })
        .catch(() => setError('Network error'))
    },
    [courseId, router, buildQuery],
  )

  useEffect(() => {
    void fetchCourse(searchParams.get('lesson'))
  }, [fetchCourse, searchParams])

  const flatLessons = useMemo(() => {
    if (!data) return []
    return data.modules.flatMap((mod) =>
      mod.videos.map((lesson) => ({ ...lesson, moduleId: mod.id, moduleTitle: mod.title })),
    )
  }, [data])

  useEffect(() => {
    if (!data || flatLessons.length === 0) return
    const fromUrl = searchParams.get('lesson')
    if (fromUrl && flatLessons.some((l) => l.id === fromUrl)) {
      setActiveLessonId(fromUrl)
      return
    }
    if (!fromUrl) {
      const preferred =
        flatLessons.find((l) => !watched.has(l.id))?.id || flatLessons[0]?.id
      setActiveLessonId(preferred || null)
    }
  }, [data, flatLessons, searchParams, watched])

  const activeLesson = flatLessons.find((l) => l.id === activeLessonId) || null

  const progressPercent = useMemo(() => {
    if (!data?.course.lessonCount) return 0
    const done = flatLessons.filter((l) => watched.has(l.id)).length
    return Math.round((done / data.course.lessonCount) * 100)
  }, [watched, flatLessons, data?.course.lessonCount])

  const nextLesson = useMemo(() => {
    if (!activeLessonId) return null
    const idx = flatLessons.findIndex((l) => l.id === activeLessonId)
    if (idx < 0 || idx >= flatLessons.length - 1) return null
    return flatLessons[idx + 1] || null
  }, [activeLessonId, flatLessons])

  useEffect(() => {
    setLessonCompleteUi(false)
  }, [activeLessonId])

  const syncProgress = useCallback(
    async (lessonId: string) => {
      if (!courseId) return
      setSaving(true)
      try {
        const res = await fetch('/api/training/progress', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId, lessonId }),
        })
        const json = (await res.json()) as {
          ok?: boolean
          progressPercent?: number
          completed?: boolean
          watchedVideoIds?: string[]
          error?: string
        }
        if (!res.ok) {
          setError(json.error || 'Could not save progress')
          return
        }
        const ids = json.watchedVideoIds ?? []
        setWatched(new Set(ids))
        setData((prev) =>
          prev
            ? {
                ...prev,
                progressPercent: json.progressPercent ?? prev.progressPercent,
                completed: json.completed ?? prev.completed,
                watchedVideoIds: ids,
              }
            : prev,
        )
      } catch {
        setError('Could not save progress')
      } finally {
        setSaving(false)
      }
    },
    [courseId],
  )

  const completeLesson = useCallback(
    (lessonId: string) => {
      if (watched.has(lessonId)) {
        setLessonCompleteUi(true)
        return
      }
      const next = new Set(watched)
      next.add(lessonId)
      setWatched(next)
      setLessonCompleteUi(true)
      void syncProgress(lessonId)
    },
    [watched, syncProgress],
  )

  const goToNextLesson = () => {
    if (!nextLesson) return
    selectLesson(nextLesson.id, courseId, buildQuery, router, setActiveLessonId)
    setLessonCompleteUi(false)
  }

  const showContinueLesson =
    lessonCompleteUi || (activeLesson ? watched.has(activeLesson.id) : false)

  if (error) {
    return <p className="text-destructive">{error}</p>
  }
  if (!data) {
    return <p className="text-muted-foreground">Loading course…</p>
  }

  return (
    <div className="space-y-8">
      {data.simState ? (
        <div className="rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-foreground">
          Development preview: <span className="font-medium">{data.simState}</span> — add{' '}
          <code className="rounded bg-muted px-1">?simState=zero|partial|complete|cert-ready|assignment-required|assignment-submitted</code>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[21/9] max-h-72 w-full bg-muted">
          <Image
            src={data.course.banner || data.course.thumbnail}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-white/80">
              Shamal Training Academy
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-white md:text-4xl">
              {data.course.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-white/90 md:text-base">{data.course.description}</p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-border p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Duration', value: data.course.durationLabel },
            { label: 'Lessons', value: String(data.course.lessonCount) },
            {
              label: 'Certificate',
              value: data.certificateAvailable
                ? 'Ready to download'
                : data.course.certificateEnabled
                  ? 'On completion'
                  : 'Not issued',
            },
            {
              label: 'Your progress',
              value: data.completed ? 'Complete' : `${progressPercent}%`,
            },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {data.completed ? (
        <TrainingCertificateCard courseId={courseId} data={data} />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-lg font-semibold text-foreground">
              Curriculum
            </h2>
            <div className="mt-4 space-y-5">
              {data.modules.map((mod) => (
                <div key={mod.id}>
                  <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                  {mod.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{mod.description}</p>
                  ) : null}
                  <ul className="mt-2 space-y-1">
                    {mod.videos.map((lesson) => {
                      const isActive = lesson.id === activeLessonId
                      const done = watched.has(lesson.id)
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => selectLesson(lesson.id, courseId, buildQuery, router, setActiveLessonId)}
                            className={cn(
                              'w-full rounded-lg px-3 py-2 text-left text-sm transition',
                              isActive
                                ? 'bg-secondary/15 font-medium text-foreground ring-1 ring-secondary/40'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                              done && !isActive && 'text-foreground/80',
                            )}
                          >
                            <span className="flex items-start justify-between gap-2">
                              <span>
                                {done ? '✓ ' : ''}
                                {lesson.title}
                              </span>
                              {lesson.durationMin ? (
                                <span className="shrink-0 text-xs">{lesson.durationMin}m</span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {done ? 'Completed · click to review' : 'Available'}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {data.course.learningObjectives.length > 0 ? (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-[family-name:var(--font-rajdhani)] text-lg font-semibold text-foreground">
                Learning objectives
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {data.course.learningObjectives.map((obj) => (
                  <li key={obj}>{obj}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-lg font-semibold text-foreground">
              Instructor
            </h2>
            <p className="mt-3 font-medium text-foreground">{data.course.instructor.name}</p>
            <p className="text-sm text-secondary">{data.course.instructor.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {data.course.instructor.bio}
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          <main className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {!activeLesson ? (
              <p className="text-muted-foreground">Select a lesson to begin.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {activeLesson.moduleTitle}
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-rajdhani)] text-2xl font-semibold text-foreground">
                      {activeLesson.title}
                    </h2>
                    {activeLesson.durationMin ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDurationMin(activeLesson.durationMin)}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-xl border border-border bg-background px-4 py-2 text-sm">
                    <span className="text-muted-foreground">Progress </span>
                    <span className="font-semibold text-foreground">
                      {data.completed ? 'Complete' : `${progressPercent}%`}
                    </span>
                    {saving ? <span className="text-muted-foreground"> · saving…</span> : null}
                  </div>
                </div>

                {watched.has(activeLesson.id) ? (
                  <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    Completed · click to review — re-watch the lesson content below at any time.
                  </p>
                ) : null}

                {activeLesson.videoUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                    {isVimeoUrl(activeLesson.videoUrl) ? (
                      <iframe
                        key={activeLesson.id}
                        title={activeLesson.title}
                        src={vimeoEmbedSrc(activeLesson.videoUrl)}
                        className="h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        key={activeLesson.id}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-full w-full"
                        src={activeLesson.videoUrl}
                        onEnded={() => completeLesson(activeLesson.id)}
                      >
                        Your browser does not support video playback.
                      </video>
                    )}
                  </div>
                ) : null}

                {activeLesson.documentUrl ? (
                  <p className="text-sm">
                    <a
                      href={activeLesson.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-secondary hover:underline"
                    >
                      Download lesson materials (PDF)
                    </a>
                  </p>
                ) : null}

                {activeLesson.content ? (
                  <div className="rounded-xl bg-muted/40 p-5 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {activeLesson.content}
                  </div>
                ) : null}

                {!activeLesson.videoUrl && !activeLesson.documentUrl && !activeLesson.content ? (
                  <p className="text-sm text-muted-foreground">
                    Lesson materials are being prepared by the Shamal training team.
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  {watched.has(activeLesson.id) ? (
                    <span className="text-sm font-medium text-muted-foreground">Lesson completed</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => completeLesson(activeLesson.id)}
                      className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:opacity-95"
                    >
                      Mark lesson complete
                    </button>
                  )}
                </div>

                {showContinueLesson && nextLesson ? (
                  <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-5">
                    <p className="font-medium text-foreground">Lesson complete</p>
                    <p className="mt-1 text-sm text-muted-foreground">Up next: {nextLesson.title}</p>
                    <button
                      type="button"
                      onClick={goToNextLesson}
                      className="mt-4 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground"
                    >
                      Continue lesson
                    </button>
                  </div>
                ) : null}

                {showContinueLesson && !nextLesson && data.completed ? (
                  <div className="rounded-xl border border-success/30 bg-success/5 p-5">
                    <p className="font-medium text-foreground">Course completed</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You have completed all lessons in this course.
                    </p>
                    {data.certificateAvailable ? (
                      <a
                        href={`/api/training/certificate/${courseId}`}
                        className="mt-4 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                      >
                        Download certificate
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </main>

          {data.effectiveAssignment ? (
            <TrainingAssignmentCard
              courseId={courseId}
              assignment={data.effectiveAssignment}
              onSubmitted={() => void fetchCourse(activeLessonId)}
            />
          ) : null}

          <TrainingCertificateCard courseId={courseId} data={data} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/training/dashboard" className="text-sm text-secondary hover:underline">
          ← Back to dashboard
        </Link>
        <Link href="/training/courses" className="text-sm text-muted-foreground hover:underline">
          All courses
        </Link>
      </div>
    </div>
  )
}
