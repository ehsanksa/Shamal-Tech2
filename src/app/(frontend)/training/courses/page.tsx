'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useTrainingUser } from '@/hooks/useTrainingUser'

type Summary = {
  id: string
  title: string
  description: string
  thumbnail: string
  durationLabel: string
  lessonCount: number
  certificateEnabled: boolean
}

/**
 * Course catalog (authenticated).
 */
export default function TrainingCoursesPage() {
  const router = useRouter()
  const { user, loading } = useTrainingUser()
  const [courses, setCourses] = useState<Summary[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/training/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/training/courses', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.courses) setCourses(d.courses)
        else setError('Could not load courses')
      })
      .catch(() => setError('Could not load courses'))
  }, [user])

  if (loading || !user) {
    return <p className="text-muted-foreground">Loading courses…</p>
  }
  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
          Academy courses
        </h1>
        <p className="mt-2 text-muted-foreground">
          All lessons are available. Track your progress and earn your certificate when you finish
          the full curriculum.
        </p>
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {courses.map((c) => (
          <li key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[16/10] bg-muted">
              <Image
                src={c.thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-3 p-6">
              <h2 className="font-[family-name:var(--font-rajdhani)] text-xl font-semibold text-foreground">
                {c.title}
              </h2>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <p className="text-xs text-muted-foreground">
                {c.lessonCount} lessons · {c.durationLabel}
                {c.certificateEnabled ? ' · Certificate on completion' : ''}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/training/courses/${c.id}`}
                  className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Open course
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
