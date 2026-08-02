import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const ProcurementAuditLogs: CollectionConfig = {
  slug: 'procurement-audit-logs',
  labels: {
    singular: 'Procurement Audit Log',
    plural: 'Procurement Audit Logs',
  },
  access: {
    create: () => false,
    read: adminOnly,
    update: () => false,
    delete: adminOnly,
  },
  admin: {
    group: 'Procurement',
    useAsTitle: 'action',
    defaultColumns: ['action', 'userName', 'relatedDomain', 'performedAt'],
    description: 'Security and change history for the Procurement Form and approved domains.',
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Domain Added', value: 'domain_added' },
        { label: 'Domain Edited', value: 'domain_edited' },
        { label: 'Domain Disabled', value: 'domain_disabled' },
        { label: 'Domain Deleted', value: 'domain_deleted' },
        { label: 'Form Enabled', value: 'form_enabled' },
        { label: 'Form Disabled', value: 'form_disabled' },
        { label: 'Domain Restriction Enabled', value: 'domain_restriction_enabled' },
        { label: 'Domain Restriction Disabled', value: 'domain_restriction_disabled' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userName',
      type: 'text',
      label: 'User',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userEmail',
      type: 'email',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'relatedDomain',
      type: 'text',
      label: 'Related Domain',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'previousValue',
      type: 'textarea',
      label: 'Previous Value',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'newValue',
      type: 'textarea',
      label: 'New Value',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'performedAt',
      type: 'date',
      label: 'Date & Time',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
