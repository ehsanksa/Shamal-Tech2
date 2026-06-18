'use client'

import { useRouter } from 'next/navigation'

import { useTrainingUser } from '@/hooks/useTrainingUser'

export default function TrainingCheckoutPage() {
  const router = useRouter()
  const { user, loading } = useTrainingUser()

  if (loading || !user) {
    return <p className="text-muted-foreground">Loading…</p>
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
        Access managed by training admin
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Course access is assigned by Shamal training admin. If you need access, please contact the
        academy administrator.
      </p>
      <button
        type="button"
        onClick={() => router.push('/training/dashboard')}
        className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Go to dashboard
      </button>
    </div>
  )
}
