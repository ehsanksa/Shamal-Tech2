import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'

export const FormNotificationSettings: GlobalConfig = {
  slug: 'form-notification-settings',
  label: 'Form Notification Settings',
  access: {
    read: anyone,
    update: anyone,
  },
  admin: {
    group: 'CRM',
    description: 'Configure internal email recipients for website form submissions.',
  },
  fields: [
    {
      name: 'contactFormRecipientEmail',
      type: 'email',
      label: 'Contact Form Recipient Email',
      defaultValue: 'r.mohammed@shamal.sa',
      required: true,
      admin: {
        description:
          'Internal recipient for contact form submissions at /contact. Falls back to r.mohammed@shamal.sa if empty or invalid.',
      },
    },
    {
      name: 'quotationFormRecipientEmail',
      type: 'email',
      label: 'Quotation Form Recipient Email',
      defaultValue: 'k.shami@shamal.sa',
      required: true,
      admin: {
        description:
          'Internal recipient for product quotation requests. Falls back to k.shami@shamal.sa if empty or invalid.',
      },
    },
    {
      name: 'trainingFormRecipientEmail',
      type: 'email',
      label: 'Training Interest Form Recipient Email',
      defaultValue: 'k.shami@shamal.sa',
      required: true,
      admin: {
        description:
          'Internal recipient for training interest form submissions. Falls back to k.shami@shamal.sa if empty or invalid.',
      },
    },
    {
      type: 'collapsible',
      label: 'ClickUp — Training Interest Form',
      admin: {
        initCollapsed: false,
        description:
          'Training interest submissions at /training/interest create tasks in ClickUp (BD → Training Platform → Interest Registrations).',
      },
      fields: [
        {
          name: 'trainingFormClickUpAssigneeEmail',
          type: 'email',
          label: 'ClickUp task assignee',
          defaultValue: 'k.shami@shamal.sa',
          required: true,
          admin: {
            description:
              'ClickUp workspace member who receives every new training interest task. Falls back to k.shami@shamal.sa if empty.',
          },
        },
      ],
    },
  ],
}
