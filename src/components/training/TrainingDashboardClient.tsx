'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { DashboardData } from '@/lib/training/dashboard'
import { useTrainingUser } from '@/hooks/useTrainingUser'
import { cn } from '@/utilities/ui'

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function TrainingDashboardClient() {
  const router = useRouter()
  const { user, loading: userLoading } = useTrainingUser()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/training/login')
    }
  }, [userLoading, user, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/training/dashboard', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          setError('Could not load dashboard')
          return
        }
        setData((await res.json()) as DashboardData)
      })
      .catch(() => setError('Could not load dashboard'))
  }, [user])

  async function logout() {
    await fetch('/api/training/auth/logout', { method: 'POST', credentials: 'include' })
    router.replace('/training/login')
  }

  if (userLoading || !user) {
    return <p className="text-muted-foreground">Loading your dashboard…</p>
  }
  if (error) {
    return <p className="text-destructive">{error}</p>
  }
  if (!data) {
    return <p className="text-muted-foreground">Loading your dashboard…</p>
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-secondary">
            Shamal Training Academy
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground md:text-4xl">
            Welcome back{user.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {user.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/training/courses"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            My courses
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Enrolled courses"
          value={data.progressOverview.enrolledCount}
        />
        <StatCard
          label="Training hours"
          value={data.trainingHours}
          hint="Completed lesson time"
        />
        <StatCard
          label="Certificates earned"
          value={data.certificates.length}
        />
        <StatCard
          label="Average progress"
          value={`${data.progressOverview.averageProgress}%`}
        />
      </section>

      {data.continueLearning ? (
        <section className="rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-card p-6 shadow-sm">
          <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
            Continue learning
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.continueLearning.courseTitle} · {data.continueLearning.progressPercent}% complete
          </p>
          <p className="mt-3 font-medium text-foreground">{data.continueLearning.lessonTitle}</p>
          <Link
            href={`/training/courses/${data.continueLearning.courseId}?lesson=${data.continueLearning.lessonId}`}
            className="mt-4 inline-flex rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground"
          >
            Continue Learning
          </Link>
        </section>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
            Enrolled courses
          </h2>
          {data.enrolledCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses enrolled yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.enrolledCourses.map((course) => (
                <li
                  key={course.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-32">
                    <Image
                      src={course.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {course.lessonCount} lessons · {course.durationLabel}
                      {course.certificateEnabled ? ' · Certificate available' : ''}
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-secondary transition-all"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{course.progressPercent}% complete</p>
                  </div>
                  <Link
                    href={`/training/courses/${course.id}`}
                    className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-secondary"
                  >
                    {course.completed ? 'Review' : 'Continue Learning'}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
              Progress overview
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">In progress</dt>
                <dd className="font-medium text-foreground">{data.progressOverview.inProgressCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Completed</dt>
                <dd className="font-medium text-foreground">{data.progressOverview.completedCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total enrolled</dt>
                <dd className="font-medium text-foreground">{data.progressOverview.enrolledCount}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
              Completed courses
            </h2>
            {data.enrolledCourses.filter((course) => course.completed).length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No completed courses yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.enrolledCourses
                  .filter((course) => course.completed)
                  .map((course) => (
                    <li key={`completed-${course.id}`} className="text-sm text-foreground">
                      {course.title}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
              Pending assignments
            </h2>
            {data.pendingAssignments.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No pending assignments.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.pendingAssignments.map((item) => (
                  <li key={`${item.courseId}-${item.assignmentTitle}`} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-sm font-medium text-foreground">{item.assignmentTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.courseTitle} · {item.status}</p>
                    {item.adminRemarks ? (
                      <p className="mt-1 text-xs text-foreground">Remarks: {item.adminRemarks}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
              Certificates earned
            </h2>
            {data.certificates.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Complete a course to earn your Shamal Technologies certificate.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.certificates.map((cert) => (
                  <li key={cert.courseId} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-sm font-medium text-foreground">{cert.courseTitle}</p>
                    {cert.issuedAt ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Issued {new Date(cert.issuedAt).toLocaleDateString()}
                      </p>
                    ) : null}
                    <a
                      href={`/api/training/certificate/${cert.courseId}`}
                      className={cn(
                        'mt-2 inline-block text-sm font-medium text-secondary hover:underline',
                      )}
                    >
                      Download certificate (PDF)
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {user.role === 'admin' ? (
            <Link
              href="/training/admin"
              className="block rounded-2xl border border-border bg-card p-5 text-sm shadow-sm hover:border-secondary"
            >
              <span className="font-semibold text-foreground">Academy administration</span>
              <p className="mt-1 text-muted-foreground">Manage students and content in Payload admin.</p>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  )
}
