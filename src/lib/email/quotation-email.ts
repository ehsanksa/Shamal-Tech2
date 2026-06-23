/**
 * Quotation form customer auto-reply.
 */

import { sendEmail } from './index'
import { readSmtpEnv } from './smtpEnv'
import {
  generateQuotationAutoReplyEmail,
  quotationAutoReplySubject,
} from './templates/quotation-auto-reply'

function getShamalFromEmail(): string {
  return readSmtpEnv('SMTP_FROM') || readSmtpEnv('SMTP_USER') || 'hello@shamal.sa'
}

/**
 * sendQuotationAutoReply()
 * Sends one formatted HTML thank-you email to the customer. Called once per quote submission.
 */
export async function sendQuotationAutoReply(input: {
  customerName: string
  customerEmail: string
  quotationNumber: string
}): Promise<void> {
  const fromEmail = getShamalFromEmail()
  const html = generateQuotationAutoReplyEmail({
    customerName: input.customerName,
    quotationNumber: input.quotationNumber,
  })

  const { messageId } = await sendEmail({
    to: input.customerEmail,
    subject: quotationAutoReplySubject(input.quotationNumber),
    html,
    from: fromEmail,
    replyTo: fromEmail,
  })

  console.log('[quotation-email] Customer auto-reply sent', {
    to: input.customerEmail,
    quotationNumber: input.quotationNumber,
    messageId: messageId ?? null,
  })
}
