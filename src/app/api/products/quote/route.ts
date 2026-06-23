import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { recordAnalyticsEventTrusted } from '@/lib/analytics/recordEvent'
import { sendLeadResponseEmail, sendLeadNotificationEmail } from '@/lib/email/lead-email'
import { formatQuoteLinesForMessage, type QuoteLineItem } from '@/lib/products/quote-cart'
import { formatBudgetRange } from '@/lib/sales/budget-labels'
import { allocateQuotationNumber } from '@/lib/sales/quotation-number'
import { notifyQuoteRfqLead } from '@/lib/sales/quote-notify'
import configPromise from '@/payload.config'

export const dynamic = 'force-dynamic'

type QuoteBody = {
  items: Array<{ productId: string; quantity: number }>
  name: string
  company: string
  email: string
  phone: string
  industry?: string
  projectLocation?: string
  budgetRange?: string
  projectRequirement: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as QuoteBody
    const name = body.name?.trim()
    const company = body.company?.trim()
    const email = body.email?.trim()
    const phone = body.phone?.trim()
    const projectRequirement = body.projectRequirement?.trim()

    if (!name || !company || !email || !phone || !projectRequirement) {
      return NextResponse.json(
        { error: 'Name, company, email, phone, and project requirements are required' },
        { status: 400 },
      )
    }
    if (!body.items?.length) {
      return NextResponse.json({ error: 'Add at least one product to your quote cart' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const quoteLines: QuoteLineItem[] = []

    for (const item of body.items) {
      const qty = Math.floor(item.quantity)
      if (!item.productId || qty < 1) {
        return NextResponse.json({ error: 'Invalid quote line item' }, { status: 400 })
      }
      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
        depth: 0,
        overrideAccess: true,
      })
      if (!product || product._status !== 'published') {
        return NextResponse.json({ error: 'One or more products are no longer available' }, { status: 400 })
      }
      quoteLines.push({
        productId: String(product.id),
        name: product.name,
        category: product.category,
        quantity: qty,
      })
    }

    const industry = body.industry?.trim()
    const projectLocation = body.projectLocation?.trim()
    const budgetRangeKey = body.budgetRange?.trim()
    const budgetLabel = formatBudgetRange(budgetRangeKey)

    const quotationNumber = await allocateQuotationNumber(payload)

    /** Plain text for Payload lead record — structured fields hold the rest; ClickUp builds its own description. */
    const internalNote = [
      `Quotation: ${quotationNumber}`,
      '',
      'Products:',
      formatQuoteLinesForMessage(quoteLines),
      '',
      'Project requirements:',
      projectRequirement,
    ].join('\n')

    let lead
    try {
      lead = await payload.create({
        collection: 'leads',
        data: {
          name,
          email,
          phone,
          company,
          subject: quotationNumber,
          quotationNumber,
          message: projectRequirement,
          leadOrigin: 'website',
          source: 'product-quote-cart',
          status: 'new',
          priority: 'high',
          industry: industry || undefined,
          projectLocation: projectLocation || undefined,
          budgetRange: budgetRangeKey || undefined,
          quoteProducts: quoteLines.map((line) => ({
            product: line.productId,
            productName: line.name,
            quantity: line.quantity,
            category: line.category || undefined,
          })),
          tags: ['product-quote', 'rfq'],
          notes: internalNote,
        },
        context: { disableRevalidate: true, skipClickUpHook: true },
      })
    } catch (err) {
      console.error('Failed to create quote lead:', err)
      return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
    }

    const ts = new Date().toISOString()

    const { clickupTaskUrl, whatsappSent } = await notifyQuoteRfqLead(payload, lead, {
      leadId: String(lead.id),
      quotationNumber,
      name,
      email,
      phone,
      company,
      industry,
      projectLocation,
      budgetRange: budgetLabel,
      projectRequirement,
      quoteLines,
      timestamp: ts,
    })

    try {
      await sendLeadResponseEmail({
        leadName: name,
        leadEmail: email,
      })
      await payload.update({
        collection: 'leads',
        id: lead.id,
        data: { emailSent: true, emailSentAt: ts },
        context: { disableRevalidate: true },
        overrideAccess: true,
      })
    } catch (err) {
      console.error('Quote lead response email failed:', err)
    }

    try {
      await sendLeadNotificationEmail({
        name,
        email,
        phone,
        company,
        subject: `${quotationNumber} — Product Quote RFQ`,
        message: internalNote,
      })
    } catch (err) {
      console.error('Quote lead notification email failed:', err)
    }

    try {
      await recordAnalyticsEventTrusted(payload, {
        sessionId: `quote:${lead.id}`,
        eventType: 'CONTACT_SUBMITTED',
        pageUrl: '/products/quote',
        metaData: {
          leadId: lead.id,
          quotationNumber,
          productCount: quoteLines.length,
          source: 'product-quote-cart',
        },
        source: 'direct',
        deviceType: 'unknown',
        browser: 'Other',
      })
    } catch (err) {
      console.error('Quote analytics failed:', err)
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      quotationNumber,
      clickupTaskUrl: clickupTaskUrl || null,
      whatsappSent,
    })
  } catch (error) {
    console.error('Product quote submission error:', error)
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
  }
}
