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
  ],
}
