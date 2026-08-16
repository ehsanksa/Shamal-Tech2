'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { getLocalizedValue } from '../../lib/localization'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { PublicFormHoneypot, usePublicFormProtection } from '../forms/PublicFormHoneypot'
import { TurnstileWidget, useTurnstileSiteKey } from '../forms/TurnstileWidget'

interface ContactFormProps {
  services?: Array<{ id: string; title?: string | null; titleAr?: string | null; slug?: string }>
}

export function ContactForm({ services = [] }: ContactFormProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    services: [] as string[],
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { website, setWebsite, turnstileToken, setTurnstileToken, protectionPayload } =
    usePublicFormProtection()
  const turnstileSiteKey = useTurnstileSiteKey()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (turnstileSiteKey && !turnstileToken) {
      setSubmitStatus('error')
      setErrorMessage(t.completeVerification)
      return
    }
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, ...protectionPayload }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        services: [],
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      <PublicFormHoneypot website={website} onWebsiteChange={setWebsite} />
      <div>
        <Label htmlFor="name">{t.name} *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="email">{t.email} *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="phone">{t.phone}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="company">{t.company}</Label>
        <Input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="subject">{t.subject}</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
        />
      </div>

      {services.length > 0 && (
        <div>
          <Label>{t.servicesSelectAll}</Label>
          <div className="mt-2 space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`service-${service.id}`}
                  checked={formData.services.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                />
                <Label
                  htmlFor={`service-${service.id}`}
                  className="font-normal cursor-pointer"
                >
                  {getLocalizedValue(service.title, service.titleAr, language)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="message">{t.message} *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{t.thankYouSent}</AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            {errorMessage || t.failedToSend}
          </AlertDescription>
        </Alert>
      )}

      <TurnstileWidget onToken={setTurnstileToken} />

      <Button
        type="submit"
        disabled={isSubmitting || Boolean(turnstileSiteKey && !turnstileToken)}
        className="w-full"
      >
        {isSubmitting ? t.sending : t.sendMessage}
      </Button>
    </form>
  )
}

