import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '../../../../../payload.config'
import { pushProcurementToClickUp } from '../../../../../lib/clickup/pushProcurementToClickUp'
import { sendProcurementRequestNotification } from '../../../../../lib/email/procurement-email'
import {
  DEFAULT_MAX_ATTACHMENT_SIZE_MB,
  PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS,
  PROCUREMENT_ALLOWED_ATTACHMENT_MIME_TYPES,
  PROCUREMENT_DOMAIN_UNAUTHORIZED_MESSAGE,
  PROCUREMENT_DOMAIN_UNAUTHORIZED_MESSAGE_AR,
  PROCUREMENT_FORM_CLOSED_MESSAGE,
  PROCUREMENT_FORM_CLOSED_MESSAGE_AR,
  PROCUREMENT_ITEM_CATEGORIES,
  PROCUREMENT_PRIORITIES,
} from '../../../../../lib/procurement/constants'
import {
  ensurePermanentInternalDomain,
  extractEmailDomain,
  findAuthorizedDomain,
} from '../../../../../lib/procurement/domains'
import { allocateProcurementRequestId } from '../../../../../lib/procurement/requestId'

export const dynamic = 'force-dynamic'

function getString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function getOptionalNumber(formData: FormData, key: string): number | undefined {
  const raw = getString(formData, key)
  if (!raw) return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

function isAllowedAttachment(file: File): boolean {
  const ext = `.${file.name.split('.').pop()?.toLowerCase() || ''}`
  const mimeOk = PROCUREMENT_ALLOWED_ATTACHMENT_MIME_TYPES.includes(
    file.type as (typeof PROCUREMENT_ALLOWED_ATTACHMENT_MIME_TYPES)[number],
  )
  const extOk = PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS.includes(
    ext as (typeof PROCUREMENT_ALLOWED_ATTACHMENT_EXTENSIONS)[number],
  )
  return mimeOk || extOk
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const requesterName = getString(formData, 'requesterName')
    const email = getString(formData, 'email')
    const phoneNumber = getString(formData, 'phoneNumber')
    const companyName = getString(formData, 'companyName')
    const department = getString(formData, 'department')
    const project = getString(formData, 'project')
    const itemCategory = getString(formData, 'itemCategory')
    const itemCategoryOther = getString(formData, 'itemCategoryOther')
    const priority = getString(formData, 'priority') || 'medium'
    const itemName = getString(formData, 'itemName')
    const detailedDescription = getString(formData, 'detailedDescription')
    const productUrl = getString(formData, 'productUrl')
    const preferredVendor = getString(formData, 'preferredVendor')
    const businessJustification = getString(formData, 'businessJustification')
    const requiredByDate = getString(formData, 'requiredByDate')
    const quantity = getOptionalNumber(formData, 'quantity')
    const estimatedUnitCost = getOptionalNumber(formData, 'estimatedUnitCost')
    const estimatedTotalCost = getOptionalNumber(formData, 'estimatedTotalCost')

    const validCategories = new Set(PROCUREMENT_ITEM_CATEGORIES.map((c) => c.value))
    const validPriorities = new Set(PROCUREMENT_PRIORITIES.map((p) => p.value))

    if (
      !requesterName ||
      !email ||
      !department ||
      !project ||
      !itemCategory ||
      !itemName ||
      !detailedDescription ||
      !businessJustification ||
      quantity == null
    ) {
      return NextResponse.json(
        {
          error:
            'Requester name, email, department, project, item category, item name, description, justification, and quantity are required',
        },
        { status: 400 },
      )
    }

    if (!validCategories.has(itemCategory as (typeof PROCUREMENT_ITEM_CATEGORIES)[number]['value'])) {
      return NextResponse.json({ error: 'Invalid item category' }, { status: 400 })
    }

    if (itemCategory === 'other' && !itemCategoryOther) {
      return NextResponse.json(
        { error: 'Please specify the item category when Other is selected' },
        { status: 400 },
      )
    }

    if (!validPriorities.has(priority as (typeof PROCUREMENT_PRIORITIES)[number]['value'])) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 })
    }

    const emailDomain = extractEmailDomain(email)
    if (!emailDomain) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    await ensurePermanentInternalDomain(payload)

    const formSettings = (await payload.findGlobal({
      slug: 'procurement-form-settings',
      depth: 0,
    })) as {
      formEnabled?: boolean | null
      domainRestrictionEnabled?: boolean | null
      emailAlertsEnabled?: boolean | null
      notificationEmails?: string | null
      closedMessage?: string | null
      closedMessageAr?: string | null
      maxAttachmentSizeMB?: number | null
      defaultAssigneeEmail?: string | null
      procurementRecipientEmail?: string | null
      senderEmail?: string | null
      additionalAssignees?: Array<{ email?: string | null }> | null
    }

    if (formSettings.formEnabled === false) {
      return NextResponse.json(
        {
          error: 'Form closed',
          message: formSettings.closedMessage || PROCUREMENT_FORM_CLOSED_MESSAGE,
          messageAr: formSettings.closedMessageAr || PROCUREMENT_FORM_CLOSED_MESSAGE_AR,
        },
        { status: 403 },
      )
    }

    let approvedDomainId: string | undefined

    if (formSettings.domainRestrictionEnabled !== false) {
      const authorized = await findAuthorizedDomain(payload, email)
      if (!authorized) {
        return NextResponse.json(
          {
            error: 'Domain not authorized',
            message: PROCUREMENT_DOMAIN_UNAUTHORIZED_MESSAGE,
            messageAr: PROCUREMENT_DOMAIN_UNAUTHORIZED_MESSAGE_AR,
          },
          { status: 403 },
        )
      }
      if (authorized.id !== 'permanent') {
        approvedDomainId = authorized.id
      }
    }

    const maxMb = Math.min(
      Math.max(formSettings.maxAttachmentSizeMB || DEFAULT_MAX_ATTACHMENT_SIZE_MB, 1),
      5,
    )
    const maxBytes = maxMb * 1024 * 1024

    const files = formData
      .getAll('attachments')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)

    for (const file of files) {
      if (!isAllowedAttachment(file)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.name}. Allowed: PDF, DOCX, XLSX, JPG, PNG.` },
          { status: 400 },
        )
      }
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum size of ${maxMb}MB.` },
          { status: 400 },
        )
      }
    }

    const attachmentIds: string[] = []
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const uploaded = await payload.create({
        collection: 'media',
        data: {
          alt: `${itemName} - ${file.name}`,
        },
        file: {
          data: buffer,
          mimetype: file.type || 'application/octet-stream',
          name: file.name,
          size: file.size,
        },
        overrideAccess: true,
      })
      attachmentIds.push(String(uploaded.id))
    }

    const requestId = await allocateProcurementRequestId(payload)
    const submittedAt = new Date().toISOString()

    const submission = await payload.create({
      collection: 'procurement-requests',
      data: {
        requestId,
        requesterName,
        email: email.toLowerCase(),
        emailDomain,
        phoneNumber: phoneNumber || undefined,
        companyName: companyName || undefined,
        department,
        project,
        itemCategory: itemCategory as (typeof PROCUREMENT_ITEM_CATEGORIES)[number]['value'],
        itemCategoryOther: itemCategory === 'other' ? itemCategoryOther : undefined,
        priority: priority as (typeof PROCUREMENT_PRIORITIES)[number]['value'],
        itemName,
        detailedDescription,
        productUrl: productUrl || undefined,
        quantity,
        preferredVendor: preferredVendor || undefined,
        estimatedUnitCost,
        estimatedTotalCost,
        requiredByDate: requiredByDate || undefined,
        businessJustification,
        attachments: attachmentIds.length ? attachmentIds : undefined,
        approvedDomain: approvedDomainId,
        submittedAt,
        status: 'new',
      },
      overrideAccess: true,
      context: {
        disableRevalidate: true,
      },
    })

    let clickupTaskUrl: string | undefined
    let clickupTaskId: string | undefined

    try {
      const clickup = await pushProcurementToClickUp(
        {
          requestId,
          requesterName,
          email: email.toLowerCase(),
          phoneNumber,
          companyName,
          department,
          project,
          itemCategory,
          itemCategoryOther,
          priority,
          itemName,
          detailedDescription,
          productUrl,
          quantity,
          preferredVendor,
          estimatedUnitCost,
          estimatedTotalCost,
          requiredByDate,
          businessJustification,
          submittedAt,
        },
        { formSettings },
      )

      if (clickup) {
        clickupTaskId = clickup.id
        clickupTaskUrl = clickup.url
        await payload.update({
          collection: 'procurement-requests',
          id: submission.id,
          data: {
            clickupTaskId: clickup.id,
            clickupTaskUrl: clickup.url,
            pushedToClickUp: true,
          },
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
      }
    } catch (clickupError) {
      payload.logger.error({ err: clickupError }, 'Failed to push procurement request to ClickUp')
    }

    if (formSettings.emailAlertsEnabled !== false) {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
        await sendProcurementRequestNotification(
          {
            requestId,
            requesterName,
            email: email.toLowerCase(),
            phoneNumber: phoneNumber || undefined,
            companyName: companyName || undefined,
            department,
            project,
            priority,
            itemCategory,
            itemCategoryOther: itemCategoryOther || undefined,
            itemName,
            estimatedTotalCost,
            estimatedUnitCost,
            businessJustification,
            emailDomain,
          },
          {
            defaultAssigneeEmail: formSettings.defaultAssigneeEmail,
            procurementRecipientEmail: formSettings.procurementRecipientEmail,
            notificationEmails: formSettings.notificationEmails,
            senderEmail: formSettings.senderEmail,
            adminRecordUrl: serverUrl
              ? `${serverUrl}/admin/collections/procurement-requests/${submission.id}`
              : undefined,
            clickupTaskUrl,
          },
        )
      } catch (emailError) {
        payload.logger.error({ err: emailError }, 'Failed to send procurement notification email')
      }
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
      requestId,
      clickupTaskId,
      clickupTaskUrl,
    })
  } catch (error) {
    console.error('procurement submit error', error)
    return NextResponse.json({ error: 'Failed to submit procurement request' }, { status: 500 })
  }
}
