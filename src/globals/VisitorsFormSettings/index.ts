import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateVisitorsForm } from './hooks/revalidateVisitorsForm'

export const VisitorsFormSettings: GlobalConfig = {
  slug: 'visitors-form-settings',
  label: 'Visitors Form Settings',
  access: {
    read: anyone,
    update: anyone,
  },
  admin: {
    group: 'CRM',
    description:
      'Control whether the public visitors form at /events/client-form accepts submissions and who receives email alerts.',
  },
  hooks: {
    afterChange: [revalidateVisitorsForm],
  },
  fields: [
    {
      name: 'collectionEnabled',
      type: 'checkbox',
      label: 'Accept new submissions',
      defaultValue: true,
      admin: {
        description:
          'When disabled, the public form is closed and new submissions are rejected.',
      },
    },
    {
      name: 'emailAlertsEnabled',
      type: 'checkbox',
      label: 'Send email alerts on new submission',
      defaultValue: true,
      admin: {
        description:
          'Sends an internal notification email when someone submits the visitors form.',
      },
    },
    {
      name: 'notificationEmails',
      type: 'textarea',
      label: 'Notification email recipients',
      admin: {
        description:
          'Optional. One email per line (or comma-separated). Falls back to CONTACT_EMAIL or hello@shamal.sa when empty.',
      },
    },
    {
      name: 'closedMessage',
      type: 'textarea',
      label: 'Closed message (English)',
      defaultValue: 'This form is currently closed and not accepting new submissions.',
    },
    {
      name: 'closedMessageAr',
      type: 'textarea',
      label: 'Closed message (Arabic)',
      defaultValue: 'هذا النموذج مغلق حالياً ولا يقبل تسجيلات جديدة.',
    },
  ],
}
