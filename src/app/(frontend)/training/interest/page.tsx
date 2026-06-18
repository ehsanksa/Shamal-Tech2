'use client'

import Link from 'next/link'
import React, { useState } from 'react'

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
  const [certificateInterest, setCertificateInterest] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [referralSource, setReferralSource] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
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
          certificateInterest,
          additionalInfo: additionalInfo || undefined,
          referralSource: referralSource || undefined,
          consentGiven,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed')
        return
      }
      setSuccessMessage(data.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (successMessage) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">
          Thank you
        </h1>
        <p className="text-muted-foreground">{successMessage}</p>
        <Link
          href="/training"
          className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to Training
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-secondary">
          Shamal Training Platform
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground md:text-4xl">
          Register Your Interest
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your interest in Shamal Technologies training programs. Please complete the
          form below so our team can understand your training needs and contact you with the relevant
          course details, schedule, and registration process.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Section title="1. Personal Information">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
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
              Mobile Number / WhatsApp <span className="text-destructive">*</span>
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
              Email Address <span className="text-destructive">*</span>
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
                City / Location <span className="text-destructive">*</span>
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
                Nationality
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

        <Section title="2. Professional Details">
          <div>
            <label className={labelClass} htmlFor="organization">
              Organization / Company / University Name
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
              Job Title / Position
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
              Are you registering as: <span className="text-destructive">*</span>
            </span>
            <div className="mt-2 space-y-2">
              {[
                ['individual', 'Individual'],
                ['company-employee', 'Company Employee'],
                ['student', 'Student'],
                ['government', 'Government Entity'],
                ['other', 'Other'],
              ].map(([value, label]) => (
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

        <Section title="3. Training Interest">
          <div>
            <span className={labelClass}>
              Do you have previous drone or GIS experience?{' '}
              <span className="text-destructive">*</span>
            </span>
            <div className="mt-2 space-y-2">
              {[
                ['yes', 'Yes'],
                ['no', 'No'],
                ['beginner', 'Beginner level'],
                ['intermediate', 'Intermediate level'],
                ['advanced', 'Advanced level'],
              ].map(([value, label]) => (
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

        <Section title="4. Purpose of Training">
          <div>
            <label className={labelClass} htmlFor="trainingPurpose">
              Why are you interested in this training? <span className="text-destructive">*</span>
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
              What skills or outcomes do you expect from this program?
            </label>
            <textarea
              id="expectedOutcomes"
              rows={3}
              value={expectedOutcomes}
              onChange={(e) => setExpectedOutcomes(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <span className={labelClass}>
              Are you interested in receiving a certificate after completion?{' '}
              <span className="text-destructive">*</span>
            </span>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                ['yes', 'Yes'],
                ['no', 'No'],
                ['maybe', 'Maybe'],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="certificateInterest"
                    required
                    value={value}
                    checked={certificateInterest === value}
                    onChange={(e) => setCertificateInterest(e.target.value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title="5. Additional Information">
          <div>
            <label className={labelClass} htmlFor="additionalInfo">
              Any questions or special requirements?
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
              How did you hear about Shamal Technologies training?
            </label>
            <select
              id="referralSource"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              className={inputClass}
            >
              <option value="">Select an option</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="website">Website</option>
              <option value="google">Google Search</option>
              <option value="referral">Referral</option>
              <option value="event">Event / Exhibition</option>
              <option value="other">Other</option>
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
              I agree to share my information with Shamal Technologies for the purpose of training
              registration, course updates, and communication related to training programs.{' '}
              <span className="text-destructive">*</span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Submit Interest'}
        </button>
      </form>
    </div>
  )
}
