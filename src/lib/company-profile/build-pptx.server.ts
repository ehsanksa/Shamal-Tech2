import PptxGenJS from 'pptxgenjs'

export const COMPANY_PROFILE_PPTX_FILENAME = 'shamal-company-profile.pptx'

type BuildCompanyProfilePptxOptions = {
  slideImages: string[]
  title?: string
}

export async function buildCompanyProfilePptx({
  slideImages,
  title = 'Shamal Technologies Company Profile',
}: BuildCompanyProfilePptxOptions): Promise<Buffer> {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Shamal Technologies'
  pptx.title = title

  slideImages.forEach((image) => {
    const slide = pptx.addSlide()
    slide.addImage({
      data: image,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    })
  })

  const output = await pptx.write({ outputType: 'nodebuffer' })
  return Buffer.from(output as ArrayBuffer)
}
