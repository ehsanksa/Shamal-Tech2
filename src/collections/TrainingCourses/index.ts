import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { anyone } from '../../access/anyone'
import { trainingAssignmentFields } from '../../fields/trainingAssignmentFields'

export const TrainingCourses: CollectionConfig = {
  slug: 'training-courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'published', 'updatedAt'],
    group: 'Training',
  },
  access: {
    create: adminOnly,
    read: anyone,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      label: 'Course banner',
    },
    {
      name: 'durationHours',
      type: 'number',
      label: 'Estimated duration (hours)',
    },
    {
      name: 'certificateEnabled',
      type: 'checkbox',
      label: 'Issues completion certificate',
      defaultValue: true,
    },
    {
      name: 'learningObjectives',
      type: 'array',
      label: 'Learning objectives',
      fields: [
        {
          name: 'objective',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'instructorName',
      type: 'text',
      label: 'Instructor name',
    },
    {
      name: 'instructorTitle',
      type: 'text',
      label: 'Instructor title',
    },
    {
      name: 'instructorBio',
      type: 'textarea',
      label: 'Instructor bio',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
    ...trainingAssignmentFields,
    {
      name: 'modules',
      type: 'array',
      labels: { singular: 'Module', plural: 'Modules' },
      fields: [
        {
          name: 'lessonId',
          type: 'text',
          required: true,
          admin: {
            description: 'Stable id for progress tracking (e.g. m1)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        ...trainingAssignmentFields,
        {
          name: 'lessons',
          type: 'array',
          labels: { singular: 'Lesson', plural: 'Lessons' },
          fields: [
            {
              name: 'lessonId',
              type: 'text',
              required: true,
              admin: {
                description: 'Stable id (e.g. v1)',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'durationMin',
              type: 'number',
            },
            {
              name: 'previewAllowed',
              type: 'checkbox',
              label: 'Available in preview access',
              defaultValue: false,
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              label: 'Lesson video (MP4)',
            },
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
              label: 'Lesson PDF / document',
            },
            {
              name: 'content',
              type: 'textarea',
              label: 'Lesson text (optional)',
            },
            ...trainingAssignmentFields,
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
