'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef, useState } from 'react'

import { useTrainingUser } from '@/hooks/useTrainingUser'
import { trackPublicEvent } from '@/lib/analytics/client'

const DEFAULT_COURSE_ID = 'drone-fundamentals'

/**
 * Checkout — Stripe Checkout redirect; optional abandoned-cart beacon.
 */
function CheckoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled') === '1'
  const courseId = searchParams.get('course') || DEFAULT_COURSE_ID
  const { user, loading } = useTrainingUser()
  const [err, setErr] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const abandonedSent = useRef(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/training/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!cancelled || !user || abandonedSent.current) return
    abandonedSent.current = true
    const payload = JSON.stringify({ courseId })
    navigator.sendBeacon('/api/training/abandoned-checkout', new Blob([payload], { type: 'application/json' }))
  }, [cancelled, courseId, user])

  async function startCheckout() {
    if (!user) return
    setErr(null)
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
      setErr('Could not start checkout. Please try again.')
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
        <p className="text-foreground">You already have full access.</p>
        <button
          type="button"
          onClick={() => router.push('/training/courses')}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          Go to courses
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Secure payment via Stripe. You’ll be redirected to complete purchase in SAR/USD depending on your Stripe
          price configuration.
        </p>
      </div>
      {cancelled ? (
        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          Checkout was cancelled. You can try again when you’re ready.
        </p>
      ) : null}
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Course</p>
        <p className="mt-1 font-medium text-foreground">{courseId}</p>
        <button
          type="button"
          disabled={starting}
          onClick={() => void startCheckout()}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {starting ? 'Redirecting…' : 'Proceed to payment'}
        </button>
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
