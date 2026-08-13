'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import {
  getTrainingInterestFormTranslations,
  translateTrainingInterestApiError,
  type TrainingInterestFormLanguage,
} from '@/lib/translations/trainingInterestForm'
import { useLanguage } from '@/providers/Language/LanguageContext'
import { PublicFormHoneypot, usePublicFormProtection } from '@/components/forms/PublicFormHoneypot'
import { TurnstileWidget } from '@/components/forms/TurnstileWidget'

const inputClass =
  'mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground'
const labelClass = 'block text-sm font-medium text-foreground'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <legend className="px-1 font-[family-name:var(--font-rajdhani)] text-lg font-semibold text-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export default function TrainingInterestPage() {
  const { language } = useLanguage()
  const t = getTrainingInterestFormTranslations(language as TrainingInterestFormLanguage)

  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [nationality, setNationality] = useState('')
  const [organization, setOrganization] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [registeringAs, setRegisteringAs] = useState('')
  const [droneExperience, setDroneExperience] = useState('')
  const [trainingPurpose, setTrainingPurpose] = useState('')
  const [expectedOutcomes, setExpectedOutcomes] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [referralSource, setReferralSource] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { website, setWebsite, setTurnstileToken, protectionPayload } = usePublicFormProtection()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/training/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          city,
          nationality: nationality || undefined,
          organization: organization || undefined,
          jobTitle: jobTitle || undefined,
          registeringAs,
          droneExperience,
          trainingPurpose,
          expectedOutcomes: expectedOutcomes || undefined,
          additionalInfo: additionalInfo || undefined,
          referralSource: referralSource || undefined,
          consentGiven,
          ...protectionPayload,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          translateTrainingInterestApiError(data.error, language as TrainingInterestFormLanguage),
        )
        return
      }
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
          {t.thankYou}
        </h1>
        <p className="text-muted-foreground">{t.successMessage}</p>
        <Link
          href="/training"
          className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          {t.backToTraining}
        </Link>
      </div>
    )
  }

  const registeringAsOptions = [
    ['individual', t.registeringIndividual],
    ['company-employee', t.registeringCompanyEmployee],
    ['student', t.registeringStudent],
    ['government', t.registeringGovernment],
    ['other', t.registeringOther],
  ] as const

  const droneExperienceOptions = [
    ['yes', t.experienceYes],
    ['no', t.experienceNo],
    ['beginner', t.experienceBeginner],
    ['intermediate', t.experienceIntermediate],
    ['advanced', t.experienceAdvanced],
  ] as const

  const referralOptions = [
    ['linkedin', t.referralLinkedIn],
    ['instagram', t.referralInstagram],
    ['website', t.referralWebsite],
    ['google', t.referralGoogle],
    ['referral', t.referralReferral],
    ['event', t.referralEvent],
    ['other', t.referralOther],
  ] as const

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-secondary">
          {t.platformLabel}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground md:text-4xl">
          {t.pageTitle}
        </h1>
        <p className="mt-3 text-muted-foreground">{t.pageDescription}</p>
      </div>

      <form onSubmit={onSubmit} className="relative space-y-6">
        <PublicFormHoneypot website={website} onWebsiteChange={setWebsite} />
        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Section title={t.sectionPersonal}>
          <div>
            <label className={labelClass} htmlFor="fullName">
              {t.fullName} <span className="text-destructive">*</span>
            </label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="mobile">
              {t.mobile} <span className="text-destructive">*</span>
            </label>
            <input
              id="mobile"
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              {t.email} <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="city">
                {t.city} <span className="text-destructive">*</span>
              </label>
              <input
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="nationality">
                {t.nationality}
              </label>
              <input
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </Section>

        <Section title={t.sectionProfessional}>
          <div>
            <label className={labelClass} htmlFor="organization">
              {t.organization}
            </label>
            <input
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="jobTitle">
              {t.jobTitle}
            </label>
            <input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <span className={labelClass}>
              {t.registeringAs} <span className="text-destructive">*</span>
            </span>
            <div className="mt-2 space-y-2">
              {registeringAsOptions.map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="registeringAs"
                    required
                    value={value}
                    checked={registeringAs === value}
                    onChange={(e) => setRegisteringAs(e.target.value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title={t.sectionTrainingInterest}>
          <div>
            <span className={labelClass}>
              {t.droneExperience} <span className="text-destructive">*</span>
            </span>
            <div className="mt-2 space-y-2">
              {droneExperienceOptions.map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="droneExperience"
                    required
                    value={value}
                    checked={droneExperience === value}
                    onChange={(e) => setDroneExperience(e.target.value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title={t.sectionPurpose}>
          <div>
            <label className={labelClass} htmlFor="trainingPurpose">
              {t.trainingPurpose} <span className="text-destructive">*</span>
            </label>
            <textarea
              id="trainingPurpose"
              required
              rows={4}
              value={trainingPurpose}
              onChange={(e) => setTrainingPurpose(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="expectedOutcomes">
              {t.expectedOutcomes}
            </label>
            <textarea
              id="expectedOutcomes"
              rows={3}
              value={expectedOutcomes}
              onChange={(e) => setExpectedOutcomes(e.target.value)}
              className={inputClass}
            />
          </div>
        </Section>

        <Section title={t.sectionAdditional}>
          <div>
            <label className={labelClass} htmlFor="additionalInfo">
              {t.additionalInfo}
            </label>
            <textarea
              id="additionalInfo"
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="referralSource">
              {t.referralSource}
            </label>
            <select
              id="referralSource"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              className={inputClass}
            >
              <option value="">{t.selectOption}</option>
              {referralOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </Section>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <label className="flex items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              required
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              {t.consent} <span className="text-destructive">*</span>
            </span>
          </label>
        </div>

        <TurnstileWidget onToken={setTurnstileToken} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  )
}
