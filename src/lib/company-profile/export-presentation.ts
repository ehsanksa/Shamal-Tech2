import type { RefObject } from 'react'

export const COMPANY_PROFILE_PDF_FILENAME = 'shamal-company-profile.pdf'
export const COMPANY_PROFILE_PPTX_FILENAME = 'shamal-company-profile.pptx'

export type PresentationExportFormat = 'pdf' | 'pptx'

const SLIDE_SETTLE_MS = 520

type CapturePresentationSlidesOptions = {
  slideCount: number
  setSlideIndex: (index: number) => void
  captureRef: RefObject<HTMLElement | null>
  scale?: number
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type CapturedSlide = {
  png: string
  jpeg: string
  width: number
  height: number
}

async function capturePresentationSlides({
  slideCount,
  setSlideIndex,
  captureRef,
  scale = 2,
}: CapturePresentationSlidesOptions): Promise<CapturedSlide[]> {
  const { default: html2canvas } = await import('html2canvas')

  const captureEl = captureRef.current
  if (!captureEl) {
    throw new Error('Presentation capture area is not ready.')
  }

  const slides: CapturedSlide[] = []

  for (let index = 0; index < slideCount; index += 1) {
    setSlideIndex(index)
    await waitForPaint()
    await wait(SLIDE_SETTLE_MS)

    const canvas = await html2canvas(captureEl, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: captureEl.scrollWidth,
      windowHeight: captureEl.scrollHeight,
    })

    slides.push({
      png: canvas.toDataURL('image/png'),
      jpeg: canvas.toDataURL('image/jpeg', 0.82),
      width: canvas.width,
      height: canvas.height,
    })
  }

  return slides
}

type ExportPresentationOptions = CapturePresentationSlidesOptions & {
  filename?: string
}

export async function exportCompanyProfilePdf({
  slideCount,
  setSlideIndex,
  captureRef,
  filename = COMPANY_PROFILE_PDF_FILENAME,
}: ExportPresentationOptions): Promise<void> {
  const slides = await capturePresentationSlides({
    slideCount,
    setSlideIndex,
    captureRef,
    scale: 2,
  })

  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  slides.forEach((slide, index) => {
    if (index > 0) {
      pdf.addPage()
    }

    const imgWidth = pageWidth
    const imgHeight = (slide.height * pageWidth) / slide.width

    if (imgHeight <= pageHeight) {
      pdf.addImage(slide.jpeg, 'JPEG', 0, (pageHeight - imgHeight) / 2, imgWidth, imgHeight)
    } else {
      pdf.addImage(slide.jpeg, 'JPEG', 0, 0, imgWidth, pageHeight)
    }
  })

  pdf.save(filename)
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportCompanyProfilePptx({
  slideCount,
  setSlideIndex,
  captureRef,
  filename = COMPANY_PROFILE_PPTX_FILENAME,
}: ExportPresentationOptions): Promise<void> {
  const slides = await capturePresentationSlides({
    slideCount,
    setSlideIndex,
    captureRef,
    scale: 1.5,
  })

  const response = await fetch('/api/company-profile/export/pptx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slides: slides.map((slide) => slide.jpeg) }),
  })

  if (!response.ok) {
    throw new Error(`PPTX export failed (${response.status})`)
  }

  const blob = await response.blob()
  downloadBlob(blob, filename)
}

export async function exportCompanyProfilePresentation(
  format: PresentationExportFormat,
  options: ExportPresentationOptions,
): Promise<void> {
  if (format === 'pdf') {
    await exportCompanyProfilePdf(options)
    return
  }

  await exportCompanyProfilePptx(options)
}
