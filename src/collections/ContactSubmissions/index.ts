import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    // Create: adminOnly at API level. Public submissions go through /api/contact which uses server-side payload.create() (bypasses access).
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['ticketNumber', 'name', 'email', 'status', 'submittedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'ticketNumber',
      type: 'text',
      label: 'Ticket number',
      admin: {
        description: 'Auto-assigned contact form reference (e.g. STCF0001).',
        readOnly: true,
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Selected Services',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
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
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Read',
          value: 'read',
        },
        {
          label: 'Replied',
          value: 'replied',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'new',
    },
  ],
  timestamps: true,
}

