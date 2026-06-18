import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const TrainingStudents: CollectionConfig = {
  slug: 'training-students',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'updatedAt'],
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
      defaultValue: 'student',
      options: [
        { label: 'Student', value: 'student' },
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
