import Link from 'next/link'
import React from 'react'

/**
 * Training landing — Shamal drone operations academy.
 */
export default function TrainingHomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 md:p-12">
        <p className="text-sm font-medium uppercase tracking-wider text-secondary">Shamal Training Academy</p>
        <h1 className="mt-3 font-[family-name:var(--font-rajdhani)] text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Drone & UAS operations training for enterprise teams
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Professional drone survey and geospatial training from Shamal Technologies — safety, regulations,
          mission planning, and field operations for Saudi Arabia and the Gulf.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/training/register"
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            Create account
          </Link>
          <Link
            href="/training/login"
            className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Structured curriculum',
            body: 'Review course outlines and selected preview lessons before completing enrollment.',
          },
          {
            title: 'Field-ready content',
            body: 'Video lessons, reference documents, and guided modules aligned with Shamal project delivery.',
          },
          {
            title: 'Completion certificate',
            body: 'Earn a Shamal Technologies certificate when you finish all required lessons.',
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-foreground">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
