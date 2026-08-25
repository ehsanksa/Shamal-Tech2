import React from 'react'

import { LocalizedLink as Link } from '../../../components/LocalizedLink'
import { getRequestLocale } from '../../../lib/i18n/getRequestLocale'
import { getCommonTranslations } from '../../../lib/translations/common'

/**
 * Training landing — Shamal drone operations academy.
 */
export default async function TrainingHomePage() {
  const locale = await getRequestLocale()
  const t = getCommonTranslations(locale).trainingLanding
  const cards = [
    { title: t.curriculumTitle, body: t.curriculumBody },
    { title: t.contentTitle, body: t.contentBody },
    { title: t.certTitle, body: t.certBody },
  ]

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 md:p-12">
        <p className="text-sm font-medium uppercase tracking-wider text-secondary">{t.kicker}</p>
        <h1 className="mt-3 font-[family-name:var(--font-rajdhani)] text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t.body}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/training/interest"
            className="inline-flex rounded-xl border border-secondary bg-card px-6 py-3 text-sm font-semibold text-secondary shadow-sm transition hover:bg-secondary/5"
          >
            {t.registerInterest}
          </Link>
          <Link
            href="/training/register"
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            {t.createAccount}
          </Link>
          <Link
            href="/training/login"
            className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
          >
            {t.signIn}
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-foreground">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
