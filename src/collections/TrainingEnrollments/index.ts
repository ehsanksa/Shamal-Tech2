import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const TrainingEnrollments: CollectionConfig = {
  slug: 'training-enrollments',
  admin: {
    useAsTitle: 'studentEmail',
    defaultColumns: ['studentEmail', 'courseSlug', 'accessLevel', 'status', 'updatedAt'],
    group: 'Training',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'training-students',
      required: true,
    },
    {
      name: 'studentEmail',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'courseSlug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'accessLevel',
      type: 'select',
      required: true,
      defaultValue: 'trial',
      options: [
        { label: 'Trial', value: 'trial' },
        { label: 'Paid', value: 'paid' },
        { label: 'Free (MVP)', value: 'free' },
        { label: 'Manual approval', value: 'manual' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Revoked', value: 'revoked' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Admin notes (manual enrollment reason, etc.)',
      },
    },
  ],
  timestamps: true,
}
