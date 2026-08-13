import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { jsonSheetsToXlsxBuffer } from '../../utilities/excelExport'
import { anyone } from '../../access/anyone'

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  access: {
    create: anyone,
    read: anyone,
    update: anyone,
    delete: anyone,
  },
  admin: {
    defaultColumns: ['email', 'status', 'subscribedAt', 'source'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ operation, value }) => {
            if (operation === 'create' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
      ],
      defaultValue: 'active',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Subscription Source',
    },
    {
      name: 'exportToExcel',
      type: 'ui',
      admin: {
        description: 'Download all newsletter subscribers as an Excel file.',
        components: {
          Field: '/collections/NewsletterSubscriptions/ExportNewsletterButton#default',
        },
      },
    },
  ],
  timestamps: true,
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('You must be logged in to export newsletter subscriptions.', 401)
        }

        const result = await req.payload.find({
          collection: 'newsletter-subscriptions',
          limit: 10000,
          sort: '-subscribedAt',
        })

        const rows = result.docs.map((doc) => ({
          Email: doc.email,
          Status: doc.status,
          Source: doc.source ?? '',
          SubscribedAt: doc.subscribedAt ?? '',
          CreatedAt: doc.createdAt ?? '',
          UpdatedAt: doc.updatedAt ?? '',
        }))

        const excelBuffer = await jsonSheetsToXlsxBuffer([{ name: 'Subscribers', rows }])

        const date = new Date().toISOString().slice(0, 10)
        const fileName = `newsletter-subscribers-${date}.xlsx`

        return new Response(excelBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  ],
}

