import { NextResponse } from 'next/server'

import configPromise from '@/payload.config'
import { removeBackgroundToWhiteFromBuffer } from '@/lib/removeBg'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const fullName = formData.get('fullName') as string
    const fullNameArabic = (formData.get('fullNameArabic') as string) || undefined
    const position = (formData.get('position') as string) || undefined
    const positionArabic = (formData.get('positionArabic') as string) || undefined
    const phoneNumber = formData.get('phoneNumber') as string
    const businessEmail = formData.get('businessEmail') as string
    const linkedInUrl = (formData.get('linkedInUrl') as string) || undefined
    const websiteUrl = (formData.get('websiteUrl') as string) || undefined
    const companyProfileFolderUrl = (formData.get('companyProfileFolderUrl') as string) || undefined
    const companyWebsiteUrl = (formData.get('companyWebsiteUrl') as string) || undefined
    const profileImage = formData.get('profileImage') as File | null
    const companyProfileArabic = formData.get('companyProfileArabic') as File | null
    const companyProfileEnglish = formData.get('companyProfileEnglish') as File | null

    if (!fullName?.trim() || !phoneNumber?.trim() || !businessEmail?.trim()) {
      return NextResponse.json(
        { error: 'Full name, phone number, and business email are required' },
        { status: 400 }
      )
    }

    if (!profileImage || profileImage.size === 0) {
      return NextResponse.json(
        { error: 'Profile photo is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Upload profile image to media
    let profileImageId: string | undefined
    try {
      const arrayBuffer = await profileImage.arrayBuffer()
      const originalBuffer = Buffer.from(arrayBuffer)
      let uploadBuffer = originalBuffer
      let uploadMimeType = profileImage.type || 'image/png'
      let uploadName = profileImage.name || 'profile.png'

      try {
        const processed = await removeBackgroundToWhiteFromBuffer(originalBuffer)
        uploadBuffer = processed.buffer
        uploadMimeType = processed.mimeType
        const nameWithoutExtension = uploadName.replace(/\.[^/.]+$/, '')
        uploadName = `${nameWithoutExtension || 'profile'}-white-bg.png`
      } catch (removeBgError) {
        console.error('remove.bg processing failed, using original profile photo:', removeBgError)
      }

      const uploaded = await payload.create({
        collection: 'media',
        data: { alt: fullName },
        file: {
          data: uploadBuffer,
          mimetype: uploadMimeType,
          name: uploadName,
          size: uploadBuffer.byteLength,
        },
        overrideAccess: true,
      })
      profileImageId = typeof uploaded.id === 'string' ? uploaded.id : String(uploaded.id)
    } catch (err) {
      console.error('Profile image upload error:', err)
      return NextResponse.json(
        { error: 'Failed to upload profile photo' },
        { status: 500 }
      )
    }

    // Upload Arabic PDF if provided
    let arabicPdfId: string | undefined
    if (companyProfileArabic?.size > 0) {
      try {
        const arrayBuffer = await companyProfileArabic.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const uploaded = await payload.create({
          collection: 'media',
          data: { alt: `Company Profile Arabic - ${fullName}` },
          file: {
            data: buffer,
            mimetype: companyProfileArabic.type || 'application/pdf',
            name: companyProfileArabic.name || 'company-profile-ar.pdf',
            size: companyProfileArabic.size,
          },
          overrideAccess: true,
        })
        arabicPdfId = typeof uploaded.id === 'string' ? uploaded.id : String(uploaded.id)
      } catch (err) {
        console.error('Arabic PDF upload error:', err)
      }
    }

    // Upload English PDF if provided
    let englishPdfId: string | undefined
    if (companyProfileEnglish?.size > 0) {
      try {
        const arrayBuffer = await companyProfileEnglish.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const uploaded = await payload.create({
          collection: 'media',
          data: { alt: `Company Profile English - ${fullName}` },
          file: {
            data: buffer,
            mimetype: companyProfileEnglish.type || 'application/pdf',
            name: companyProfileEnglish.name || 'company-profile-en.pdf',
            size: companyProfileEnglish.size,
          },
          overrideAccess: true,
        })
        englishPdfId = typeof uploaded.id === 'string' ? uploaded.id : String(uploaded.id)
      } catch (err) {
        console.error('English PDF upload error:', err)
      }
    }

    // Create employee (slug will be auto-generated by beforeChange hook)
    const employee = await payload.create({
      collection: 'employees',
      data: {
        fullName: fullName.trim(),
        fullNameArabic: fullNameArabic?.trim() || undefined,
        position: position?.trim() || undefined,
        positionArabic: positionArabic?.trim() || undefined,
        profileImage: profileImageId,
        phoneNumber: phoneNumber.trim(),
        businessEmail: businessEmail.trim(),
        linkedInUrl: linkedInUrl?.trim() || undefined,
        websiteUrl: websiteUrl?.trim() || undefined,
        companyProfileFolderUrl: companyProfileFolderUrl?.trim() || undefined,
        companyWebsiteUrl: companyWebsiteUrl?.trim() || undefined,
        companyProfileArabic: arabicPdfId,
        companyProfileEnglish: englishPdfId,
        status: 'draft', // Admin reviews before publishing
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const slug = (employee as { slug?: string }).slug
    const profileUrl = slug ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://shamal.sa'}/profile/${slug}` : null

    return NextResponse.json({
      success: true,
      message: 'Profile submitted successfully. An admin will review and publish it.',
      id: employee.id,
      slug,
      profileUrl,
    })
  } catch (error) {
    console.error('Employee submission error:', error)
    return NextResponse.json(
      {
        error: 'Failed to submit profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
