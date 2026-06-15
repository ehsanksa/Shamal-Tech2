import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const TrainingCertificates: CollectionConfig = {
  slug: 'training-certificates',
  admin: {
    useAsTitle: 'certificateId',
    defaultColumns: ['certificateId', 'studentName', 'courseTitle', 'issuedAt', 'verificationCode'],
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
      name: 'certificateId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'verificationCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'studentEmail',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'studentName',
      type: 'text',
      required: true,
    },
    {
      name: 'courseSlug',
      type: 'text',
      required: true,
    },
    {
      name: 'courseTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'issuedAt',
      type: 'date',
      required: true,
    },
  ],
  timestamps: true,
}
