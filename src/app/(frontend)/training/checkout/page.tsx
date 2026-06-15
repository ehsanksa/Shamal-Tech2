'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef, useState } from 'react'

import { useTrainingUser } from '@/hooks/useTrainingUser'
import { trackPublicEvent } from '@/lib/analytics/client'

const DEFAULT_COURSE_ID = 'drone-fundamentals'

function CheckoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled') === '1'
  const courseIdParam = searchParams.get('course') || DEFAULT_COURSE_ID
  const { user, loading } = useTrainingUser()
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [courseId, setCourseId] = useState(courseIdParam)
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [stripeAvailable, setStripeAvailable] = useState(false)
  const abandonedSent = useRef(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/training/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    fetch(`/api/training/checkout?course=${encodeURIComponent(courseIdParam)}`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.courseId) setCourseId(d.courseId)
        if (d.courseTitle) setCourseTitle(d.courseTitle)
        if (d.courseDescription) setCourseDescription(d.courseDescription)
        setStripeAvailable(Boolean(d.stripeAvailable))
      })
      .catch(() => undefined)
  }, [user, courseIdParam])

  useEffect(() => {
    if (!cancelled || !user || abandonedSent.current) return
    abandonedSent.current = true
    const payload = JSON.stringify({ courseId })
    navigator.sendBeacon('/api/training/abandoned-checkout', new Blob([payload], { type: 'application/json' }))
  }, [cancelled, courseId, user])

  async function completeEnrollment() {
    if (!user) return
    setErr(null)
    setMsg(null)
    setStarting(true)
    try {
      const res = await fetch('/api/training/enroll', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, mode: 'free' }),
      })
      const data = (await res.json().catch(() => null)) as { error?: string; message?: string } | null
      if (!res.ok) {
        setErr(data?.error || 'Enrollment failed')
        return
      }
      setMsg(data?.message || 'Enrollment complete.')
      router.push('/training/dashboard')
      router.refresh()
    } catch {
      setErr('Could not complete enrollment. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  async function startCheckout() {
    if (!user) return
    setErr(null)
    setMsg(null)
    setStarting(true)
    trackPublicEvent({
      eventType: 'CHECKOUT_INITIATED',
      pageUrl: '/training/checkout',
      metaData: { courseId },
    })
    try {
      const res = await fetch('/api/training/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = (await res.json().catch(() => null)) as { error?: string; url?: string } | null
      if (!res.ok) {
        setErr(data?.error || 'Checkout unavailable')
        return
      }
      if (data?.url) {
        window.location.href = data.url
      } else {
        setErr('Checkout unavailable')
      }
    } catch {
      setErr('Could not start checkout.')
    } finally {
      setStarting(false)
    }
  }

  if (loading || !user) {
    return <p className="text-muted-foreground">Loading…</p>
  }

  if (user.role === 'paid' || user.role === 'admin') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-foreground">You already have full academy access.</p>
        <button
          type="button"
          onClick={() => router.push('/training/dashboard')}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          Go to dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
          Course enrollment
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unlock all modules, track your progress, and earn your Shamal Technologies completion
          certificate.
        </p>
      </div>
      {cancelled ? (
        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          Payment was cancelled. You can complete enrollment below or try again.
        </p>
      ) : null}
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      {msg ? <p className="text-sm text-success">{msg}</p> : null}

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Course</p>
          <p className="mt-1 font-semibold text-foreground">{courseTitle || courseId}</p>
          {courseDescription ? (
            <p className="mt-2 text-sm text-muted-foreground">{courseDescription}</p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={starting}
          onClick={() => void completeEnrollment()}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {starting ? 'Please wait…' : 'Complete enrollment'}
        </button>

        {stripeAvailable ? (
          <button
            type="button"
            disabled={starting}
            onClick={() => void startCheckout()}
            className="w-full rounded-xl border border-border bg-background py-3 text-sm font-semibold text-foreground disabled:opacity-60"
          >
            Pay online
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default function TrainingCheckoutPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <CheckoutInner />
    </Suspense>
  )
}
