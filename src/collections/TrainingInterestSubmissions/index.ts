import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import * as XLSX from 'xlsx'

import { adminOnly } from '../../access/adminOnly'
import { anyone } from '../../access/anyone'
import { mapTrainingInterestRow } from '../../lib/clickup/formatTrainingInterestTask'
import { pushTrainingInterestToClickUp } from '../../lib/clickup/pushTrainingInterestToClickUp'
import type { TrainingInterestSubmission } from '../../payload-types'
import { pushTrainingInterestToClickUpHook } from './hooks/pushToClickUp'

export const TrainingInterestSubmissions: CollectionConfig = {
  slug: 'training-interest-submissions',
  labels: {
    singular: 'Interest Form Submission',
    plural: 'Form Data',
  },
  access: {
    create: anyone,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['referenceNumber', 'fullName', 'email', 'mobile', 'city', 'status', 'submittedAt'],
    useAsTitle: 'fullName',
    group: 'Training',
    description:
      'Interest registrations from /training/interest. Submissions sync to ClickUp (BD → Training Platform) and can be exported as Excel.',
    components: {
      beforeList: ['/collections/TrainingInterestSubmissions/ExportFormDataListActions#default'],
    },
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Personal Information',
      fields: [
        { name: 'fullName', type: 'text', label: 'Full Name', required: true },
        {
          name: 'referenceNumber',
          type: 'text',
          label: 'Training reference number',
          admin: {
            description: 'Auto-assigned training interest reference (e.g. STT0001).',
            readOnly: true,
          },
        },
        { name: 'mobile', type: 'text', label: 'Mobile / WhatsApp', required: true },
        { name: 'email', type: 'email', label: 'Email Address', required: true },
        { name: 'city', type: 'text', label: 'City / Location', required: true },
        { name: 'nationality', type: 'text', label: 'Nationality' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Professional Details',
      fields: [
        { name: 'organization', type: 'text', label: 'Organization / Company / University' },
        { name: 'jobTitle', type: 'text', label: 'Job Title / Position' },
        {
          name: 'registeringAs',
          type: 'select',
          label: 'Registering as',
          required: true,
          options: [
            { label: 'Individual', value: 'individual' },
            { label: 'Company Employee', value: 'company-employee' },
            { label: 'Student', value: 'student' },
            { label: 'Government Entity', value: 'government' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Training Interest',
      fields: [
        {
          name: 'droneExperience',
          type: 'select',
          label: 'Previous drone or GIS experience',
          required: true,
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Beginner level', value: 'beginner' },
            { label: 'Intermediate level', value: 'intermediate' },
            { label: 'Advanced level', value: 'advanced' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Purpose of Training',
      fields: [
        {
          name: 'trainingPurpose',
          type: 'textarea',
          label: 'Why are you interested in this training?',
          required: true,
        },
        {
          name: 'expectedOutcomes',
          type: 'textarea',
          label: 'Expected skills or outcomes',
        },
        {
          name: 'certificateInterest',
          type: 'select',
          label: 'Certificate after completion',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Maybe', value: 'maybe' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Additional Information',
      fields: [
        {
          name: 'additionalInfo',
          type: 'textarea',
          label: 'Questions or special requirements',
        },
        {
          name: 'referralSource',
          type: 'select',
          label: 'How did you hear about us?',
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Website', value: 'website' },
            { label: 'Google Search', value: 'google' },
            { label: 'Referral', value: 'referral' },
            { label: 'Event / Exhibition', value: 'event' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'consentGiven',
          type: 'checkbox',
          label: 'Consent given',
          required: true,
          defaultValue: false,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
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
      name: 'pushedToClickUp',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Synced to ClickUp BD → Training Platform list.',
      },
    },
    {
      name: 'clickupTaskId',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'clickupTaskUrl',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'pushToClickUpAction',
      type: 'ui',
      admin: {
        description: 'Manually push this submission to ClickUp if auto-sync failed.',
        components: {
          Field: '/collections/TrainingInterestSubmissions/PushToClickUpButton#default',
        },
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [pushTrainingInterestToClickUpHook],
  },
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('You must be logged in to export training interest form data.', 401)
        }

        const format = req.searchParams?.get('format') === 'csv' ? 'csv' : 'xlsx'

        const result = await req.payload.find({
          collection: 'training-interest-submissions',
          limit: 10000,
          sort: '-submittedAt',
        })

        const rows = result.docs.map((doc) =>
          mapTrainingInterestRow(doc as TrainingInterestSubmission),
        )
        const worksheet = XLSX.utils.json_to_sheet(rows)
        const date = new Date().toISOString().slice(0, 10)

        if (format === 'csv') {
          const csv = XLSX.utils.sheet_to_csv(worksheet)
          const fileName = `training-interest-form-${date}.csv`
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Data')
        const excelBuffer = XLSX.write(workbook, {
          type: 'buffer',
          bookType: 'xlsx',
        }) as Buffer
        const fileName = `training-interest-form-${date}.xlsx`

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
    {
      path: '/:id/push-to-clickup',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('You must be logged in to push to ClickUp.', 401)
        }
        const id = req.routeParams?.id
        if (!id) {
          throw new APIError('Submission ID is required.', 400)
        }
        const doc = await req.payload.findByID({
          collection: 'training-interest-submissions',
          id,
          depth: 0,
        })
        if (!doc) {
          throw new APIError('Submission not found.', 404)
        }
        if (doc.pushedToClickUp) {
          return Response.json({
            ok: true,
            alreadyPushed: true,
            clickupTaskUrl: doc.clickupTaskUrl ?? undefined,
          })
        }
        const result = await pushTrainingInterestToClickUp(doc)
        if (!result) {
          throw new APIError('Failed to create task in ClickUp. Check server logs.', 502)
        }
        await req.payload.update({
          collection: 'training-interest-submissions',
          id: doc.id,
          data: {
            pushedToClickUp: true,
            clickupTaskId: result.id,
            clickupTaskUrl: result.url,
          },
          context: { disableRevalidate: true },
        })
        return Response.json({
          ok: true,
          taskId: result.id,
          taskUrl: result.url,
        })
      },
    },
  ],
}
