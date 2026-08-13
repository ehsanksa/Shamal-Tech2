import { getPayload } from 'payload'
import { headers } from 'next/headers'
import configPromise from '@/payload.config'
import { jsonSheetsToXlsxBuffer } from '@/utilities/excelExport'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

function getMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${getServerSideURL()}${url}`
}

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Unauthorized. Admin login required.', { status: 401 })
  }

  try {
    const employees = await payload.find({
      collection: 'employees',
      limit: 10000,
      depth: 2,
    })

    const rows = employees.docs.map((emp: Record<string, unknown>) => {
      const profileImage = emp.profileImage as { url?: string } | string | null
      const arabicPdf = emp.companyProfileArabic as { url?: string; filename?: string } | string | null
      const englishPdf = emp.companyProfileEnglish as { url?: string; filename?: string } | string | null

      const profileUrl =
        profileImage && typeof profileImage === 'object' && profileImage.url
          ? getMediaUrl(profileImage.url)
          : ''
      const arabicUrl =
        arabicPdf && typeof arabicPdf === 'object' && arabicPdf.url ? getMediaUrl(arabicPdf.url) : ''
      const englishUrl =
        englishPdf && typeof englishPdf === 'object' && englishPdf.url ? getMediaUrl(englishPdf.url) : ''

      return {
        'Full Name': emp.fullName ?? '',
        'Full Name (Arabic)': emp.fullNameArabic ?? '',
        'Position': emp.position ?? '',
        'Position (Arabic)': emp.positionArabic ?? '',
        'Phone Number': emp.phoneNumber ?? '',
        'Business Email': emp.businessEmail ?? '',
        'LinkedIn URL': emp.linkedInUrl ?? '',
        'Website URL': emp.websiteUrl ?? '',
        'Company Website': emp.companyWebsiteUrl ?? '',
        'Profile Image URL': profileUrl,
        'Company Profile (Arabic) URL': arabicUrl,
        'Company Profile (English) URL': englishUrl,
        'OneDrive/Folder URL': emp.companyProfileFolderUrl ?? '',
        'Profile URL (QR)': emp.slug ? `${getServerSideURL()}/profile/${emp.slug}` : '',
        Status: emp.status ?? '',
        'Created At': emp.createdAt ? new Date(emp.createdAt as string).toISOString() : '',
        'Updated At': emp.updatedAt ? new Date(emp.updatedAt as string).toISOString() : '',
      }
    })

    const buffer = await jsonSheetsToXlsxBuffer([{ name: 'Employees', rows }])
    const filename = `employees-export-${new Date().toISOString().slice(0, 10)}.xlsx`

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    payload.logger?.error?.({ err: error, message: 'Employee export failed' })
    return new Response('Export failed.', { status: 500 })
  }
}
