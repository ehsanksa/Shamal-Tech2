import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import * as XLSX from 'xlsx'

import { adminOnly } from '../../access/adminOnly'
import type { EventClientSubmission } from '../../payload-types'

function mapSubmissionRow(doc: EventClientSubmission) {
  return {
    'Client Name': doc.clientName,
    'Company Name': doc.companyName ?? '',
    'Job Title': doc.jobTitle ?? '',
    'Phone Number': doc.phoneNumber ?? '',
    'Email Address': doc.email,
    Sector: doc.sector ?? '',
    'Service Required': doc.serviceRequired ?? '',
    'Client Interests': doc.clientInterests ?? '',
    'Priority Level': doc.priorityLevel ?? '',
    'Additional Notes': doc.additionalNotes ?? '',
    'Event Name': doc.eventName ?? '',
    Status: doc.status ?? '',
    'Submitted At': doc.submittedAt ?? '',
    'Created At': doc.createdAt ?? '',
    'Updated At': doc.updatedAt ?? '',
  }
}

export const EventClientSubmissions: CollectionConfig = {
  slug: 'event-client-submissions',
  labels: {
    singular: 'Visitors Form Submission',
    plural: 'Visitors Form Submissions',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['clientName', 'companyName', 'eventName', 'email', 'status', 'submittedAt'],
    useAsTitle: 'clientName',
    group: 'CRM',
    description:
      'Submissions from /events/client-form. Toggle collection & email alerts under Globals → Visitors Form Settings.',
    components: {
      beforeList: ['/collections/EventClientSubmissions/ExportEventClientsListActions#default'],
    },
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      label: 'Client Name',
      required: true,
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'sector',
      type: 'text',
      label: 'Sector',
    },
    {
      name: 'serviceRequired',
      type: 'text',
      label: 'Service Required',
    },
    {
      name: 'clientInterests',
      type: 'textarea',
      label: 'Client Interests',
    },
    {
      name: 'priorityLevel',
      type: 'select',
      label: 'Priority Level',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'additionalNotes',
      type: 'textarea',
      label: 'Additional Notes',
    },
    {
      name: 'eventName',
      type: 'text',
      label: 'Event Name',
    },
    {
      name: 'submittedAt',
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
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
    },
  ],
  timestamps: true,
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('You must be logged in to export visitors form submissions.', 401)
        }

        const format = req.searchParams?.get('format') === 'csv' ? 'csv' : 'xlsx'

        const result = await req.payload.find({
          collection: 'event-client-submissions',
          limit: 10000,
          sort: '-submittedAt',
        })

        const rows = result.docs.map(mapSubmissionRow)
        const worksheet = XLSX.utils.json_to_sheet(rows)
        const date = new Date().toISOString().slice(0, 10)

        if (format === 'csv') {
          const csv = XLSX.utils.sheet_to_csv(worksheet)
          const fileName = `visitors-form-submissions-${date}.csv`

          return new Response(csv, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="${fileName}"`,
              'Cache-Control': 'no-store',
            },
          })
        }

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions')
        const excelBuffer = XLSX.write(workbook, {
          type: 'buffer',
          bookType: 'xlsx',
        }) as Buffer
        const fileName = `visitors-form-submissions-${date}.xlsx`

        return new Response(new Uint8Array(excelBuffer), {
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
