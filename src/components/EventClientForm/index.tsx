'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import {
  getEventClientFormTranslations,
  type EventClientFormLanguage,
} from '../../lib/translations/eventClientForm'

interface SectorOption {
  slug: string
  name?: string | null
  nameAr?: string | null
}

interface ServiceOption {
  id: string
  title?: string | null
  titleAr?: string | null
}

interface EventClientFormProps {
  sectors?: SectorOption[]
  services?: ServiceOption[]
  defaultEventName?: string
  collectionEnabled?: boolean
  closedMessage?: string
  closedMessageAr?: string
}

function BilingualLabel({
  en,
  ar,
  required,
}: {
  en: string
  ar: string
  required?: boolean
}) {
  return (
    <span className="flex flex-col gap-0.5">
      <span>
        {en}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      <span className="text-sm text-muted-foreground" dir="rtl" lang="ar">
        {ar}
      </span>
    </span>
  )
}

export function EventClientForm({
  sectors = [],
  services = [],
  defaultEventName = '',
  collectionEnabled = true,
  closedMessage,
  closedMessageAr,
}: EventClientFormProps) {
  const { language } = useLanguage()
  const t = getEventClientFormTranslations(language as EventClientFormLanguage)
  const tEn = getEventClientFormTranslations('en')
  const tAr = getEventClientFormTranslations('ar')

  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
    email: '',
    sector: '',
    serviceRequired: '',
    clientInterests: '',
    priorityLevel: 'medium',
    additionalNotes: '',
    eventName: defaultEventName,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/event-clients/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          const localized =
            language === 'ar'
              ? data.messageAr || data.message || t.formClosed
              : data.message || data.messageAr || t.formClosed
          throw new Error(localized)
        }
        throw new Error(data.error || data.message || 'Failed to submit form')
      }

      setSubmitStatus('success')
      setFormData({
        clientName: '',
        companyName: '',
        jobTitle: '',
        phoneNumber: '',
        email: '',
        sector: '',
        serviceRequired: '',
        clientInterests: '',
        priorityLevel: 'medium',
        additionalNotes: '',
        eventName: defaultEventName,
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityOptions = [
    { value: 'low', label: tEn.priorityLow, labelAlt: tAr.priorityLow },
    { value: 'medium', label: tEn.priorityMedium, labelAlt: tAr.priorityMedium },
    { value: 'high', label: tEn.priorityHigh, labelAlt: tAr.priorityHigh },
    { value: 'urgent', label: tEn.priorityUrgent, labelAlt: tAr.priorityUrgent },
  ]

  const closedTextEn = closedMessage || tEn.formClosed
  const closedTextAr = closedMessageAr || tAr.formClosed

  if (!collectionEnabled) {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
        <AlertDescription>
          <p className="font-medium mb-2">{t.formClosedTitle}</p>
          <p>{closedTextEn}</p>
          <p className="mt-2" dir="rtl" lang="ar">
            {closedTextAr}
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="clientName">
            <BilingualLabel en={tEn.clientName} ar={tAr.clientName} required />
          </Label>
          <Input
            id="clientName"
            name="clientName"
            type="text"
            required
            value={formData.clientName}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="companyName">
            <BilingualLabel en={tEn.companyName} ar={tAr.companyName} />
          </Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="jobTitle">
            <BilingualLabel en={tEn.jobTitle} ar={tAr.jobTitle} />
          </Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">
            <BilingualLabel en={tEn.phoneNumber} ar={tAr.phoneNumber} />
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">
            <BilingualLabel en={tEn.emailAddress} ar={tAr.emailAddress} required />
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label>
            <BilingualLabel en={tEn.sector} ar={tAr.sector} />
          </Label>
          <Select
            value={formData.sector || undefined}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, sector: value }))}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.selectSector} />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.slug} value={sector.slug}>
                  {getLocalizedValue(sector.name, sector.nameAr, language)}
                </SelectItem>
              ))}
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            <BilingualLabel en={tEn.serviceRequired} ar={tAr.serviceRequired} />
          </Label>
          <Select
            value={formData.serviceRequired || undefined}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceRequired: value }))}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.selectService} />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {getLocalizedValue(service.title, service.titleAr, language)}
                </SelectItem>
              ))}
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            <BilingualLabel en={tEn.priorityLevel} ar={tAr.priorityLevel} />
          </Label>
          <Select
            value={formData.priorityLevel}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, priorityLevel: value }))}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.selectPriority} />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} / {option.labelAlt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="eventName">
            <BilingualLabel en={tEn.eventName} ar={tAr.eventName} />
          </Label>
          <Input
            id="eventName"
            name="eventName"
            type="text"
            value={formData.eventName}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="clientInterests">
            <BilingualLabel en={tEn.clientInterests} ar={tAr.clientInterests} />
          </Label>
          <Textarea
            id="clientInterests"
            name="clientInterests"
            rows={4}
            value={formData.clientInterests}
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="additionalNotes">
            <BilingualLabel en={tEn.additionalNotes} ar={tAr.additionalNotes} />
          </Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={4}
            value={formData.additionalNotes}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </div>

      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
          <AlertDescription>{t.success}</AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage || t.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
