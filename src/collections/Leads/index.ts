import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { anyone } from '../../access/anyone'
import { pushLeadToClickUp } from '../../lib/clickup/pushLeadToClickUp'
import { pushToClickUp } from './hooks/pushToClickUp'

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    create: anyone,
    read: anyone,
    update: anyone,
    delete: anyone,
  },
  admin: {
    defaultColumns: ['quotationNumber', 'name', 'email', 'status', 'leadOrigin', 'pushedToClickUp', 'createdAt'],
    useAsTitle: 'name',
    group: 'CRM',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the lead',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the lead',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number of the lead',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Company name',
      },
    },
    {
      name: 'subject',
      type: 'text',
      admin: {
        description: 'Subject of inquiry',
      },
    },
    {
      name: 'quotationNumber',
      type: 'text',
      label: 'Quotation number',
      admin: {
        description: 'Auto-assigned for product quote cart (e.g. STQF0001). Used as ClickUp task title.',
        readOnly: true,
      },
    },
    {
      name: 'ticketNumber',
      type: 'text',
      label: 'Contact ticket number',
      admin: {
        description: 'Auto-assigned for contact form leads (e.g. STCF0001).',
        readOnly: true,
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Services the lead is interested in',
      },
    },
    {
      name: 'quoteProducts',
      type: 'array',
      admin: {
        description: 'Products requested via Quote Cart (bundled RFQ)',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'category',
          type: 'text',
        },
      ],
    },
    {
      name: 'industry',
      type: 'text',
      admin: {
        description: 'Industry / sector (from product quote form)',
      },
    },
    {
      name: 'projectLocation',
      type: 'text',
      label: 'Project location',
    },
    {
      name: 'budgetRange',
      type: 'select',
      options: [
        { label: 'Under SAR 100k', value: 'under-100k' },
        { label: 'SAR 100k – 500k', value: '100k-500k' },
        { label: 'SAR 500k – 1M', value: '500k-1m' },
        { label: 'SAR 1M+', value: '1m-plus' },
        { label: 'Not sure yet', value: 'unsure' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Initial message from the lead',
      },
    },
    {
      name: 'leadOrigin',
      type: 'select',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'admin',
      required: true,
      admin: {
        description: 'Where was this lead created? Website form triggers ClickUp sync.',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        {
          label: 'Contact Form',
          value: 'contact-form',
        },
        {
          label: 'Product Quote Cart',
          value: 'product-quote-cart',
        },
        {
          label: 'Phone',
          value: 'phone',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Referral',
          value: 'referral',
        },
        {
          label: 'Social Media',
          value: 'social-media',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      defaultValue: 'contact-form',
      admin: {
        description: 'How did this lead find us?',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Contacted',
          value: 'contacted',
        },
        {
          label: 'Qualified',
          value: 'qualified',
        },
        {
          label: 'Proposal Sent',
          value: 'proposal-sent',
        },
        {
          label: 'Negotiating',
          value: 'negotiating',
        },
        {
          label: 'Won',
          value: 'won',
        },
        {
          label: 'Lost',
          value: 'lost',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'new',
      admin: {
        description: 'Current status of the lead',
      },
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
      defaultValue: 'medium',
      admin: {
        description: 'Priority level of the lead',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User responsible for following up with this lead',
      },
    },
    {
      name: 'estimatedValue',
      type: 'number',
      admin: {
        description: 'Estimated value of this lead in SAR',
        step: 1000,
      },
    },
    {
      name: 'followUps',
      type: 'array',
      admin: {
        description: 'Follow-up activities and notes',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Date and time of the follow-up',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Call',
              value: 'call',
            },
            {
              label: 'Email',
              value: 'email',
            },
            {
              label: 'Meeting',
              value: 'meeting',
            },
            {
              label: 'Proposal',
              value: 'proposal',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
          admin: {
            description: 'Type of follow-up activity',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Notes about this follow-up',
          },
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as completed',
          },
        },
        {
          name: 'completedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            condition: (data) => data?.completed === true,
            description: 'User who completed this follow-up',
          },
        },
      ],
    },
    {
      name: 'nextFollowUpDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Scheduled date for next follow-up',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tags for categorizing leads',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this lead',
      },
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the initial response email was sent',
        readOnly: true,
      },
    },
    {
      name: 'emailSentAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
        description: 'When the initial response email was sent',
      },
    },
    // --- ClickUp integration (read-only, set by hook) ---
    {
      name: 'pushedToClickUp',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this lead was synced to ClickUp. Use the "Push to ClickUp" button below to sync this lead.',
        readOnly: true,
      },
    },
    {
      name: 'clickupTaskId',
      type: 'text',
      admin: {
        description: 'ClickUp task ID (set automatically for website leads)',
        readOnly: true,
      },
    },
    {
      name: 'clickupTaskUrl',
      type: 'text',
      admin: {
        description: 'Link to the ClickUp task',
        readOnly: true,
      },
    },
    {
      name: 'pushToClickUpAction',
      type: 'ui',
      admin: {
        description: 'Push this lead to ClickUp (creates a task in your BD list).',
        components: {
          Field: '/collections/Leads/PushToClickUpButton#default',
        },
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
        description: 'When the lead was first submitted',
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
  ],
  timestamps: true,
  hooks: {
    afterChange: [pushToClickUp],
  },
  endpoints: [
    {
      path: '/:id/push-to-clickup',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('You must be logged in to push a lead to ClickUp.', 401)
        }
        const id = req.routeParams?.id
        if (!id) {
          throw new APIError('Lead ID is required.', 400)
        }
        const lead = await req.payload.findByID({
          collection: 'leads',
          id,
          depth: 1,
        })
        if (!lead) {
          throw new APIError('Lead not found.', 404)
        }
        if (lead.pushedToClickUp) {
          return Response.json({
            ok: true,
            alreadyPushed: true,
            clickupTaskUrl: lead.clickupTaskUrl ?? undefined,
          })
        }
        const result = await pushLeadToClickUp(req.payload, lead)
        if (!result) {
          throw new APIError('Failed to create task in ClickUp. Check server logs.', 502)
        }
        await req.payload.update({
          collection: 'leads',
          id: lead.id,
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

