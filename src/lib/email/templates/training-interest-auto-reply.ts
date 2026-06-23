import {
  escapeHtml,
  renderReferenceHighlightBox,
  renderShamalFormEmailLayout,
} from './shamal-form-email-layout'

export interface TrainingInterestAutoReplyEmailData {
  applicantName: string
  referenceNumber: string
}

export function trainingInterestAutoReplySubject(referenceNumber: string): string {
  return `Training Interest Received | Ref: ${referenceNumber}`
}

export function generateTrainingInterestAutoReplyEmail(
  data: TrainingInterestAutoReplyEmailData,
): string {
  const safeName = escapeHtml(data.applicantName)
  const safeRef = escapeHtml(data.referenceNumber)

  const bodyHtml = `
              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Hi <strong>${safeName}</strong>,
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Thank you for showing your interest in <strong>Shamal Technologies</strong> Courses.
                We are pleased to know that you are interested in learning with us.
              </p>

              ${renderReferenceHighlightBox('Training Reference Number', data.referenceNumber)}

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Your training reference number is <strong>${safeRef}</strong>.
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                Our training team will review your submitted details and contact you with the relevant course information,
                schedule, registration process, and next steps.
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 18px 0;">
                If you have selected a specific course, our team will guide you regarding the course outline, available batches,
                enrollment process, and certificate details.
              </p>

              <p style="font-size:16px; line-height:1.7; margin:0 0 22px 0;">
                If you have any questions or need help selecting the right training module, our team will be happy to assist you.
              </p>`

  return renderShamalFormEmailLayout({
    pageTitle: 'Training Interest Received',
    headerTitle: 'Training Interest Received',
    headerSubtitle: 'Thank you for your interest in Shamal Technologies training programs.',
    accentMessage: 'Our training team is reviewing your submission',
    bodyHtml,
    signOffHtml: `<p style="font-size:16px; line-height:1.7; margin:22px 0 0 0;">
                Best regards,<br />
                <strong>Shamal Technologies Training Team</strong>
              </p>`,
  })
}
