import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Employees: CollectionConfig = {
  slug: 'employees',
  access: {
    create: authenticated,
    read: ({ req }) => {
      if (req?.user) return true
      return { status: { equals: 'published' } }
    },
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['fullName', 'position', 'businessEmail', 'slug', 'status', 'updatedAt'],
    useAsTitle: 'fullName',
    description:
      'Employee digital profiles for QR code business cards. Each employee gets a unique public URL for their profile. Export to Excel: /api/employees/export (must be logged in).',
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://localhost:3000'
        return data?.slug ? `${baseURL}/profile/${data.slug}` : baseURL
      },
    },
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name (English)',
    },
    {
      name: 'fullNameArabic',
      type: 'text',
      label: 'Full Name (Arabic)',
      admin: {
        description: 'Arabic name for profile when user selects Arabic language',
      },
    },
    {
      name: 'position',
      type: 'text',
      label: 'Position / Job Title (English)',
    },
    {
      name: 'positionArabic',
      type: 'text',
      label: 'Position / Job Title (Arabic)',
      admin: {
        description: 'Arabic job title for profile when user selects Arabic language',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'businessEmail',
      type: 'email',
      required: true,
      label: 'Business Email',
    },
    {
      name: 'linkedInUrl',
      type: 'text',
      label: 'LinkedIn Profile URL',
      admin: {
        description: 'Full LinkedIn profile URL (e.g. https://linkedin.com/in/username)',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Personal/Portfolio Website URL',
    },
    {
      name: 'companyProfileArabic',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Profile (Arabic)',
      admin: {
        description: 'PDF file - Company profile in Arabic',
      },
    },
    {
      name: 'companyProfileEnglish',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Profile (English)',
      admin: {
        description: 'PDF file - Company profile in English',
      },
    },
    {
      name: 'companyProfileFolderUrl',
      type: 'text',
      label: 'OneDrive/Cloud Folder URL (Alternative)',
      admin: {
        description:
          'Optional: Public folder link containing both Arabic & English PDFs. If set, this will be shown instead of individual PDF buttons.',
      },
    },
    {
      name: 'companyWebsiteUrl',
      type: 'text',
      label: 'Company Website',
      admin: {
        description: 'Main company website URL (displayed at bottom of profile). Enter with or without https:// (e.g. shamal.sa or https://shamal.sa)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Published profiles are visible on the public QR page',
      },
    },
    {
      name: 'qrCode',
      type: 'ui',
      admin: {
        position: 'sidebar',
        description: 'QR code for business cards. Use this URL when generating QR codes.',
        components: {
          Field: '/collections/Employees/QRCodeField#default',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: false,
        description:
          'Editable profile URL slug. Example: dr-hesham-malak-12694035 → shamal.sa/profile/dr-hesham-malak-12694035. Auto-generated only if left empty on first save.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data) return data

        // Auto-generate slug only on first create when left empty
        if (operation === 'create' && !data.slug?.trim()) {
          const baseSlug = (data.fullName || 'employee')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
          const uniqueId = crypto.randomUUID().slice(0, 8)
          const candidateSlug = `${baseSlug || 'profile'}-${uniqueId}`

          const existing = await req.payload.find({
            collection: 'employees',
            where: { slug: { equals: candidateSlug } },
            limit: 1,
          })
          data.slug =
            existing.docs.length > 0 ? `${candidateSlug}-${Date.now().toString(36)}` : candidateSlug
        }

        return data
      },
    ],
    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        if (!data) return data

        // On update: keep existing slug only if admin cleared the field
        if (operation === 'update' && originalDoc?.slug && !data.slug?.trim()) {
          data.slug = originalDoc.slug
          return data
        }

        // Normalize manual slug input (allows admin to set e.g. dr-hesham-malak-12694035)
        if (data.slug?.trim()) {
          data.slug = data.slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-|-$/g, '')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
