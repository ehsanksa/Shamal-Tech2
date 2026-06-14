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
      'Control the visitors form at /client-form (or /events/client-form): event banner image, submission collection, and email alerts.',
  },
  hooks: {
    afterChange: [revalidateVisitorsForm],
  },
  fields: [
    {
      name: 'eventImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ongoing event image',
      admin: {
        description:
          'Optional banner shown above the visitors form on /events/client-form. Remove the image to hide it.',
      },
    },
    {
      name: 'eventImageAlt',
      type: 'text',
      label: 'Event image alt text (English)',
      admin: {
        description: 'Accessibility label for the event image. Falls back to the media alt text or "Ongoing event".',
      },
    },
    {
      name: 'eventImageAltAr',
      type: 'text',
      label: 'Event image alt text (Arabic)',
    },
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
