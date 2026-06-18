/**
 * Generate Shamal Technologies training completion certificate PDF.
 */

import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

export type CertificateData = {
  studentName: string
  courseTitle: string
  issuedAt: Date
  certificateId: string
  verificationCode: string
  verificationUrl: string
}

export function generateVerificationCode(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SHML-${part}`
}

export function generateCertificateId(): string {
  const year = new Date().getFullYear()
  const seq = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `ST-${year}-${seq}`
}

export async function buildCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()

  doc.setFillColor(10, 50, 84)
  doc.rect(0, 0, w, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('Shamal Technologies', w / 2, 14, { align: 'center' })
  doc.setFontSize(10)
  doc.text('Drone & Geospatial Solutions · Saudi Arabia', w / 2, 21, { align: 'center' })

  doc.setTextColor(34, 96, 147)
  doc.setFontSize(14)
  doc.text('Certificate of Completion', w / 2, 48, { align: 'center' })

  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.text('This certifies that', w / 2, 62, { align: 'center' })

  doc.setTextColor(10, 50, 84)
  doc.setFontSize(26)
  doc.text(data.studentName, w / 2, 78, { align: 'center' })

  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.text('has successfully completed the training course', w / 2, 92, { align: 'center' })

  doc.setTextColor(34, 96, 147)
  doc.setFontSize(16)
  doc.text(data.courseTitle, w / 2, 104, { align: 'center' })

  const dateStr = data.issuedAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.text(`Completion date: ${dateStr}`, w / 2, 118, { align: 'center' })
  doc.text(`Certificate ID: ${data.certificateId}`, w / 2, 126, { align: 'center' })
  doc.text(`Verification code: ${data.verificationCode}`, w / 2, 134, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`Verify: ${data.verificationUrl}`, w / 2, 142, { align: 'center' })

  const qrData = await QRCode.toDataURL(data.verificationUrl, { margin: 1, width: 140 })
  doc.addImage(qrData, 'PNG', w - 46, h - 50, 28, 28)
  doc.setFontSize(8)
  doc.text('Scan to verify', w - 32, h - 18, { align: 'center' })

  doc.setDrawColor(34, 96, 147)
  doc.setLineWidth(0.4)
  doc.rect(12, 36, w - 24, h - 48)

  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(
    'Shamal Technologies · hello@shamal.sa · shamal.sa',
    w / 2,
    h - 10,
    { align: 'center' },
  )

  const buf = doc.output('arraybuffer')
  return new Uint8Array(buf)
}
