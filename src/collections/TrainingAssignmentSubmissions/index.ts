import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const TrainingAssignmentSubmissions: CollectionConfig = {
  slug: 'training-assignment-submissions',
  admin: {
    useAsTitle: 'assignmentTitle',
    defaultColumns: ['studentEmail', 'courseSlug', 'scope', 'status', 'submittedAt'],
    group: 'Training',
    description: 'Student assignment submissions — review, accept, or reject with remarks.',
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
      name: 'scope',
      type: 'select',
      required: true,
      options: [
        { label: 'Course', value: 'course' },
        { label: 'Module', value: 'module' },
        { label: 'Lesson', value: 'lesson' },
      ],
    },
    {
      name: 'scopeId',
      type: 'text',
      required: true,
      admin: {
        description: 'Course slug, module lessonId, or lesson lessonId',
      },
    },
    {
      name: 'assignmentTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'textAnswer',
      type: 'textarea',
      label: 'Student text response',
    },
    {
      name: 'submittedFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Submitted file',
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'submitted',
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'adminRemarks',
      type: 'textarea',
      label: 'Admin remarks',
    },
  ],
  timestamps: true,
}
