import type { GlobalConfig } from 'payload'

import { adminOnly, adminOnlyField } from '../../access/adminOnly'
import { anyone } from '../../access/anyone'
import {
  DEFAULT_MAX_ATTACHMENT_SIZE_MB,
  DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL,
  DEFAULT_PROCUREMENT_ASSIGNEE_NAME,
  DEFAULT_PROCUREMENT_RECIPIENT_EMAIL,
  DEFAULT_PROCUREMENT_SENDER_EMAIL,
  PROCUREMENT_FORM_CLOSED_MESSAGE,
  PROCUREMENT_FORM_CLOSED_MESSAGE_AR,
} from '../../lib/procurement/constants'
import { auditSettingsChange } from './hooks/auditSettingsChange'
import { revalidateProcurementForm } from './hooks/revalidateProcurementForm'

export const ProcurementFormSettings: GlobalConfig = {
  slug: 'procurement-form-settings',
  label: 'Procurement Form',
  access: {
    read: anyone,
    update: adminOnly,
  },
  admin: {
    group: 'Procurement',
    description:
      'Form Access Control, task assignment, email notifications, and attachment limits for /procurement/request.',
  },
  hooks: {
    afterChange: [auditSettingsChange, revalidateProcurementForm],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Form Availability',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'formEnabled',
          type: 'checkbox',
          label: 'Procurement Form Status (Enabled)',
          defaultValue: true,
          admin: {
            description:
              'When disabled, the public form becomes inaccessible and shows the closed message below.',
          },
        },
        {
          name: 'closedMessage',
          type: 'textarea',
          label: 'Closed message (English)',
          defaultValue: PROCUREMENT_FORM_CLOSED_MESSAGE,
          admin: {
            description: 'Shown on the public form URL when the form is disabled.',
          },
        },
        {
          name: 'closedMessageAr',
          type: 'textarea',
          label: 'Closed message (Arabic)',
          defaultValue: PROCUREMENT_FORM_CLOSED_MESSAGE_AR,
        },
        {
          name: 'maxAttachmentSizeMB',
          type: 'number',
          label: 'Maximum attachment size (MB)',
          defaultValue: DEFAULT_MAX_ATTACHMENT_SIZE_MB,
          min: 1,
          max: 5,
          admin: {
            description:
              'Maximum size per uploaded file (PDF, DOCX, XLSX, JPG, PNG). Capped at 5MB due to platform limits.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Domain Restriction Settings',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'domainRestrictionEnabled',
          type: 'checkbox',
          label: 'Enable Domain Restriction',
          defaultValue: true,
          admin: {
            description:
              'When ON, only approved domains (including permanent @shamal.sa) can submit. When OFF, any email address can submit.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Task Assignment Settings',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'defaultAssigneeName',
          type: 'text',
          label: 'Default Procurement Assignee Name',
          defaultValue: DEFAULT_PROCUREMENT_ASSIGNEE_NAME,
        },
        {
          name: 'defaultAssigneeEmail',
          type: 'email',
          label: 'Default Procurement Assignee Email',
          required: true,
          defaultValue: DEFAULT_PROCUREMENT_ASSIGNEE_EMAIL,
          admin: {
            description:
              'Receives all procurement ClickUp tasks unless changed. Falls back to Procurement Recipient Email if unset/unresolvable.',
          },
        },
        {
          name: 'additionalAssignees',
          type: 'array',
          label: 'Additional Assignees',
          labels: {
            singular: 'Additional Assignee',
            plural: 'Additional Assignees',
          },
          admin: {
            description:
              'Optional. Added as secondary ClickUp assignees (e.g. Procurement Manager, Finance, Project Manager).',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Email Notifications',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'emailAlertsEnabled',
          type: 'checkbox',
          label: 'Send email alerts on new submission',
          defaultValue: true,
        },
        {
          name: 'senderEmail',
          type: 'email',
          label: 'Sender Email',
          defaultValue: DEFAULT_PROCUREMENT_SENDER_EMAIL,
          access: {
            update: adminOnlyField,
          },
          admin: {
            description: 'Editable by Super Admin only. Default: hello@shamal.sa',
          },
        },
        {
          name: 'procurementRecipientEmail',
          type: 'email',
          label: 'Procurement Recipient Email',
          defaultValue: DEFAULT_PROCUREMENT_RECIPIENT_EMAIL,
          admin: {
            description:
              'Used when default assignee is removed, ClickUp is unavailable, or as backup notification recipient.',
          },
        },
        {
          name: 'notificationEmails',
          type: 'textarea',
          label: 'Additional notification recipients',
          admin: {
            description:
              'Optional. One email per line (or comma-separated). Also used for domain expiry notices (30 / 7 / 0 days).',
          },
        },
      ],
    },
    {
      name: 'domainDashboard',
      type: 'ui',
      admin: {
        components: {
          Field: '/globals/ProcurementFormSettings/DomainDashboard#default',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'manageDomainsLink',
          type: 'ui',
          admin: {
            width: '50%',
            components: {
              Field: '/globals/ProcurementFormSettings/ManageDomainsLink#default',
            },
          },
        },
      ],
    },
  ],
}
