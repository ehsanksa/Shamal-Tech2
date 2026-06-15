import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const TrainingStudents: CollectionConfig = {
  slug: 'training-students',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
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
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'passwordHash',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'trial',
      options: [
        { label: 'Trial', value: 'trial' },
        { label: 'Paid / Full access', value: 'paid' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'warmLead',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
