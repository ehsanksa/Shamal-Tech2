'use client'

import { useMemo, useState } from 'react'

import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useLanguage } from '../../providers/Language/LanguageContext'
import {
  DEFAULT_MAX_ATTACHMENT_SIZE_MB,
  PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS,
  PROCUREMENT_ITEM_CATEGORIES,
  PROCUREMENT_PRIORITIES,
  PROCUREMENT_PRIORITY_COLORS,
  type ProcurementPriority,
} from '../../lib/procurement/constants'
import {
  getProcurementFormTranslations,
  PROCUREMENT_CATEGORY_TRANSLATION_KEYS,
  PROCUREMENT_PRIORITY_TRANSLATION_KEYS,
  type ProcurementFormLanguage,
} from '../../lib/translations/procurementForm'

interface ProcurementRequestFormProps {
  formEnabled?: boolean
  closedMessage?: string
  closedMessageAr?: string
  maxAttachmentSizeMB?: number
}

const emptyForm = {
  requesterName: '',
  email: '',
  phoneNumber: '',
  companyName: '',
  department: '',
  project: '',
  itemCategory: '',
  itemCategoryOther: '',
  priority: 'medium',
  itemName: '',
  detailedDescription: '',
  productUrl: '',
  quantity: '1',
  preferredVendor: '',
  estimatedUnitCost: '',
  estimatedTotalCost: '',
  requiredByDate: '',
  businessJustification: '',
}

function RequiredMark() {
  return <span className="text-destructive">*</span>
}

export function ProcurementRequestForm({
  formEnabled = true,
  closedMessage,
  closedMessageAr,
  maxAttachmentSizeMB = DEFAULT_MAX_ATTACHMENT_SIZE_MB,
}: ProcurementRequestFormProps) {
  const { language } = useLanguage()
  const isAr = language === 'ar'
  const t = getProcurementFormTranslations(language as ProcurementFormLanguage)

  const [formData, setFormData] = useState(emptyForm)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [requestId, setRequestId] = useState('')

  const maxMb = Math.min(Math.max(maxAttachmentSizeMB, 1), 5)
  const maxBytes = useMemo(() => maxMb * 1024 * 1024, [maxMb])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) {
      setAttachments([])
      return
    }

    const next: File[] = []
    for (const file of Array.from(files)) {
      const ext = `.${file.name.split('.').pop()?.toLowerCase() || ''}`
      if (
        !PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS.includes(
          ext as (typeof PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS)[number],
        )
      ) {
        setErrorMessage(t.unsupportedFile(file.name))
        setSubmitStatus('error')
        return
      }
      if (file.size > maxBytes) {
        setErrorMessage(t.fileTooLarge(file.name, maxMb))
        setSubmitStatus('error')
        return
      }
      next.push(file)
    }
    setErrorMessage('')
    setSubmitStatus('idle')
    setAttachments(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    setRequestId('')

    try {
      if (!formData.itemCategory) {
        throw new Error(t.categoryRequired)
      }
      if (formData.itemCategory === 'other' && !formData.itemCategoryOther.trim()) {
        throw new Error(t.categoryOtherRequired)
      }

      const body = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        body.append(key, value)
      })
      for (const file of attachments) {
        body.append('attachments', file)
      }

      const response = await fetch('/api/procurement/submit', {
        method: 'POST',
        body,
      })

      const data = await response.json()

      if (!response.ok) {
        const localized = isAr
          ? data.messageAr || data.message || data.error || t.error
          : data.message || data.messageAr || data.error || t.error
        throw new Error(localized)
      }

      setSubmitStatus('success')
      setRequestId(typeof data.requestId === 'string' ? data.requestId : '')
      setFormData(emptyForm)
      setAttachments([])
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : t.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formEnabled) {
    return (
      <Alert
        className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <AlertDescription>
          <p className="font-medium mb-2">{t.formClosedTitle}</p>
          <p>
            {isAr
              ? closedMessageAr || t.formClosed
              : closedMessage || t.formClosed}
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  const priorityKey = (formData.priority || 'medium') as ProcurementPriority
  const priorityColors = PROCUREMENT_PRIORITY_COLORS[priorityKey]
  const priorityLabelKey = PROCUREMENT_PRIORITY_TRANSLATION_KEYS[priorityKey]

  return (
    <form onSubmit={handleSubmit} className="space-y-8" dir={isAr ? 'rtl' : 'ltr'} lang={language}>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.requesterSection}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="requesterName">
              {t.requesterName} <RequiredMark />
            </Label>
            <Input
              id="requesterName"
              name="requesterName"
              required
              value={formData.requesterName}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">
              {t.email} <RequiredMark />
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
            <Label htmlFor="phoneNumber">{t.phoneNumber}</Label>
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
            <Label htmlFor="companyName">{t.companyName}</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="department">
              {t.department} <RequiredMark />
            </Label>
            <Input
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.projectSection}</h3>
        <div>
          <Label htmlFor="project">
            {t.project} <RequiredMark />
          </Label>
          <Input
            id="project"
            name="project"
            required
            value={formData.project}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.detailsSection}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>
              {t.itemCategory} <RequiredMark />
            </Label>
            <Select
              value={formData.itemCategory}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  itemCategory: value,
                  itemCategoryOther: value === 'other' ? prev.itemCategoryOther : '',
                }))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {PROCUREMENT_ITEM_CATEGORIES.map((category) => {
                  const key = PROCUREMENT_CATEGORY_TRANSLATION_KEYS[category.value]
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      {t[key]}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {t.priority} <RequiredMark />
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t.selectPriority} />
              </SelectTrigger>
              <SelectContent>
                {PROCUREMENT_PRIORITIES.map((priority) => {
                  const key = PROCUREMENT_PRIORITY_TRANSLATION_KEYS[priority.value]
                  return (
                    <SelectItem key={priority.value} value={priority.value}>
                      {t[key]}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <div className="mt-2">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide"
                style={{
                  background: priorityColors.bg,
                  color: priorityColors.text,
                  border: `1px solid ${priorityColors.border}`,
                }}
              >
                {t[priorityLabelKey]}
              </span>
            </div>
          </div>

          {formData.itemCategory === 'other' && (
            <div className="md:col-span-2">
              <Label htmlFor="itemCategoryOther">
                {t.pleaseSpecify} <RequiredMark />
              </Label>
              <Input
                id="itemCategoryOther"
                name="itemCategoryOther"
                required
                value={formData.itemCategoryOther}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="itemName">
              {t.itemName} <RequiredMark />
            </Label>
            <Input
              id="itemName"
              name="itemName"
              required
              value={formData.itemName}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="detailedDescription">
              {t.detailedDescription} <RequiredMark />
            </Label>
            <Textarea
              id="detailedDescription"
              name="detailedDescription"
              required
              rows={4}
              value={formData.detailedDescription}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="productUrl">{t.productUrl}</Label>
            <Input
              id="productUrl"
              name="productUrl"
              type="url"
              value={formData.productUrl}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="quantity">
              {t.quantity} <RequiredMark />
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              required
              value={formData.quantity}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="preferredVendor">{t.preferredVendor}</Label>
            <Input
              id="preferredVendor"
              name="preferredVendor"
              value={formData.preferredVendor}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="estimatedUnitCost">{t.estimatedUnitCost}</Label>
            <Input
              id="estimatedUnitCost"
              name="estimatedUnitCost"
              type="number"
              min={0}
              step="0.01"
              value={formData.estimatedUnitCost}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="estimatedTotalCost">{t.estimatedTotalCost}</Label>
            <Input
              id="estimatedTotalCost"
              name="estimatedTotalCost"
              type="number"
              min={0}
              step="0.01"
              value={formData.estimatedTotalCost}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="requiredByDate">{t.requiredByDate}</Label>
            <Input
              id="requiredByDate"
              name="requiredByDate"
              type="date"
              value={formData.requiredByDate}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.justificationSection}</h3>
        <div>
          <Label htmlFor="businessJustification">
            {t.businessJustification} <RequiredMark />
          </Label>
          <Textarea
            id="businessJustification"
            name="businessJustification"
            required
            rows={4}
            placeholder={t.businessJustificationPlaceholder}
            value={formData.businessJustification}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t.attachmentsSection}</h3>
        <div>
          <Label htmlFor="attachments">{t.uploadFiles}</Label>
          <Input
            id="attachments"
            name="attachments"
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="mt-2"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {t.maxFileSize(maxMb)}
            {attachments.length > 0
              ? ` ${t.filesSelected(attachments.length)}`
              : ` ${t.noFileSelected}`}
          </p>
        </div>
      </section>

      {submitStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100">
          <AlertDescription>
            <p>{t.success}</p>
            {requestId ? (
              <p className="mt-2 font-semibold">
                {t.requestIdLabel}: {requestId}
              </p>
            ) : null}
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
