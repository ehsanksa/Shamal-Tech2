'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { PublicFormHoneypot, usePublicFormProtection } from '../forms/PublicFormHoneypot'

export function NewsletterForm() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { website, setWebsite, protectionPayload } = usePublicFormProtection()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'website', ...protectionPayload }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t.failedToSubscribe)
      }

      setSubmitStatus('success')
      setEmail('')
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : t.failedToSubscribe)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-3">
      <PublicFormHoneypot website={website} onWebsiteChange={setWebsite} />
      <div className="flex flex-col gap-2">
        <Input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.enterYourEmail}
          className="w-full"
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t.subscribing : t.subscribe}
        </Button>
      </div>

      {submitStatus === 'success' && (
        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs">
          {t.successSubscribed}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs">
          {errorMessage || t.failedToSubscribe}
        </div>
      )}
    </form>
  )
}

