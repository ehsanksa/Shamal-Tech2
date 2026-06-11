import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const EventClientSubmissions: CollectionConfig = {
  slug: 'event-client-submissions',
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
}
