import type { Field } from 'payload'

/** Reusable assignment field group for course / module / lesson in TrainingCourses. */
export const trainingAssignmentFields: Field[] = [
  {
    name: 'assignment',
    type: 'group',
    label: 'Assignment (optional)',
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        label: 'Assignment enabled',
        defaultValue: false,
      },
      {
        name: 'title',
        type: 'text',
        label: 'Assignment title',
      },
      {
        name: 'instructions',
        type: 'textarea',
        label: 'Instructions',
      },
      {
        name: 'referenceFile',
        type: 'upload',
        relationTo: 'media',
        label: 'Reference file (optional)',
      },
      {
        name: 'dueDate',
        type: 'date',
        label: 'Due date (optional)',
      },
      {
        name: 'submissionType',
        type: 'select',
        label: 'Submission type',
        defaultValue: 'text',
        options: [
          { label: 'Text only', value: 'text' },
          { label: 'File only', value: 'file' },
          { label: 'Text and file', value: 'both' },
        ],
      },
      {
        name: 'requiredForCertificate',
        type: 'checkbox',
        label: 'Required for certificate',
        defaultValue: false,
      },
      {
        name: 'requireAdminAcceptance',
        type: 'checkbox',
        label: 'Certificate requires admin acceptance (not just submission)',
        defaultValue: false,
      },
    ],
  },
]
