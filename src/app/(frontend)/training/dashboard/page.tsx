'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

import { useTrainingUser } from '@/hooks/useTrainingUser'

/**
 * Learner dashboard — status, shortcuts, logout.
 */
function DashboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutOk = searchParams.get('checkout') === 'success'
  const { user, loading } = useTrainingUser()

  async function logout() {
    await fetch('/api/training/auth/logout', { method: 'POST', credentials: 'include' })
    router.replace('/training/login')
  }

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/training/login')
    }
  }, [loading, user, router])

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>
  }
  if (!user) {
    return null
  }

  const isPaid = user.role === 'paid' || user.role === 'admin'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
          Welcome back{user.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as <span className="text-foreground">{user.email}</span> · Role:{' '}
          <span className="font-medium capitalize text-foreground">{user.role}</span>
          {user.warmLead ? (
            <span className="ml-2 rounded-full bg-warning/20 px-2 py-0.5 text-xs text-foreground">
              Warm lead
            </span>
          ) : null}
        </p>
        {checkoutOk ? (
          <p className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-foreground">
            Payment received — if access doesn’t update instantly, refresh this page.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/training/courses"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary"
        >
          <h2 className="font-semibold text-foreground">Courses</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse modules and track progress.</p>
        </Link>
        {!isPaid ? (
          <Link
            href="/training/checkout"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary"
          >
            <h2 className="font-semibold text-foreground">Unlock full course</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upgrade from trial to full access.</p>
          </Link>
        ) : (
          <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
            <h2 className="font-semibold text-foreground">Full access active</h2>
            <p className="mt-1 text-sm text-muted-foreground">All modules are unlocked.</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => void logout()}
        className="text-sm text-muted-foreground underline"
      >
        Sign out
      </button>
    </div>
  )
}

export default function TrainingDashboardPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <DashboardInner />
    </Suspense>
  )
}
