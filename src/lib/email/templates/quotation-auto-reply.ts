import {
  escapeHtml,
  renderReferenceHighlightBox,
  renderShamalFormEmailLayout,
} from './shamal-form-email-layout'

export interface QuotationAutoReplyEmailData {
  customerName: string
  quotationNumber: string
}

export function quotationAutoReplySubject(quotationNumber: string): string {
  return `Quotation Request Received | Ref: ${quotationNumber}`
}

export function generateQuotationAutoReplyEmail(data: QuotationAutoReplyEmailData): string {
  const safeName = escapeHtml(data.customerName)
  const safeRef = escapeHtml(data.quotationNumber)

  const bodyHtml = `
              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Dear <strong>${safeName}</strong>,
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Thank you for submitting your quotation request to <strong>Shamal Technologies</strong>.
                We have successfully received your request and our team will review the details shortly.
              </p>

              ${renderReferenceHighlightBox('Quotation Reference Number', data.quotationNumber)}

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Your quotation reference number is <strong>${safeRef}</strong>.
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 22px 0;">
                The relevant department will evaluate your requirements and contact you with the next steps.
              </p>`

  return renderShamalFormEmailLayout({
    pageTitle: 'Quotation Request Received',
    headerTitle: 'Quotation Request Received',
    headerSubtitle: 'Your request has been received by Shamal Technologies.',
    accentMessage: 'Our sales team is reviewing your quotation request',
    bodyHtml,
    signOffHtml: `<p style="font-size:16px; line-height:1.7; margin:22px 0 0 0;">
                Best regards,<br />
                <strong>Shamal Technologies Team</strong>
              </p>`,
  })
}
