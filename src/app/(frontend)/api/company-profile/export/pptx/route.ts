import { NextRequest } from 'next/server'

import {
  buildCompanyProfilePptx,
  COMPANY_PROFILE_PPTX_FILENAME,
} from '@/lib/company-profile/build-pptx.server'

export const dynamic = 'force-dynamic'

type ExportPptxBody = {
  slides?: string[]
}

export async function POST(request: NextRequest) {
  let body: ExportPptxBody

  try {
    body = (await request.json()) as ExportPptxBody
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const slides = body.slides?.filter((slide) => typeof slide === 'string' && slide.startsWith('data:image/'))

  if (!slides?.length) {
    return new Response('Missing slide images', { status: 400 })
  }

  try {
    const pptxBuffer = await buildCompanyProfilePptx({ slideImages: slides })

    return new Response(pptxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${COMPANY_PROFILE_PPTX_FILENAME}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Company profile PPTX export failed:', error)
    return new Response('PPTX generation failed', { status: 500 })
  }
}
