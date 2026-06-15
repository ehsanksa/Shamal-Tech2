import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const TrainingProgress: CollectionConfig = {
  slug: 'training-progress',
  admin: {
    useAsTitle: 'studentEmail',
    defaultColumns: ['studentEmail', 'courseSlug', 'progressPercent', 'completed', 'updatedAt'],
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
      name: 'progressPercent',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'watchedLessonIds',
      type: 'json',
      admin: {
        description: 'Array of lesson ids marked complete',
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
    },
  ],
  timestamps: true,
}
