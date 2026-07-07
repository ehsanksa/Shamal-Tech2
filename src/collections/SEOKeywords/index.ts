import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'

export const SEOKeywords: CollectionConfig = {
  slug: 'seo-keywords',
  access: {
    read: anyone,
    create: anyone,
    update: anyone,
    delete: anyone,
  },
  admin: {
    defaultColumns: ['keyword', 'language', 'category', 'priority', 'active'],
    useAsTitle: 'keyword',
  },
  fields: [
    {
      name: 'keyword',
      type: 'text',
      required: true,
      label: 'SEO Keyword/Phrase',
    },
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Arabic', value: 'ar' },
      ],
      label: 'Language',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
        {
          label: 'Long-tail',
          value: 'long-tail',
        },
        {
          label: 'Service-specific',
          value: 'service-specific',
        },
        {
          label: 'Sector-specific',
          value: 'sector-specific',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description/Usage Notes',
    },
    {
      name: 'relatedPages',
      type: 'relationship',
      relationTo: ['pages', 'services', 'products'],
      hasMany: true,
      label: 'Related Pages',
    },
    {
      name: 'priority',
      type: 'number',
      label: 'Priority (1-10)',
      min: 1,
      max: 10,
      defaultValue: 5,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
  timestamps: true,
}

