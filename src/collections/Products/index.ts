import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { revalidateProduct } from './hooks/revalidateProduct'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: anyone,
    create: anyone,
    update: anyone,
    delete: anyone,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'category', 'featured', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'nameAr',
      type: 'text',
      label: 'Name (Arabic)',
      admin: {
        description: 'Arabic product name displayed when Arabic language is selected',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description: 'Attach only when a product image is available. Leave empty if no exact match exists.',
              },
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'descriptionAr',
              type: 'richText',
              label: 'Description (Arabic)',
            },
            {
              name: 'compatibility',
              type: 'text',
              label: 'Compatibility',
              admin: {
                description: 'Compatible aircraft, platforms, or software',
              },
            },
            {
              name: 'inTheBox',
              type: 'array',
              label: 'In the Box',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'specifications',
              type: 'json',
              label: 'Specifications',
              admin: {
                description: 'Technical specification key-value pairs',
              },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Drones',
                  value: 'drones',
                },
                {
                  label: 'Payloads',
                  value: 'payloads',
                },
                {
                  label: 'Other',
                  value: 'other',
                },
              ],
            },
            {
              name: 'categoryTag',
              type: 'text',
              label: 'Category Tag',
              admin: {
                description: 'Display tag like "Autonomous Docking", "Enterprise Drones", etc.',
              },
            },
            {
              name: 'categoryTagAr',
              type: 'text',
              label: 'Category Tag (Arabic)',
            },
            {
              name: 'keyFeatures',
              type: 'array',
              label: 'Key Features',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'featureAr',
                  type: 'text',
                  label: 'Feature (Arabic)',
                },
              ],
              admin: {
                description: 'List of key features to display on the product card',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'ctaText',
              type: 'text',
              label: 'CTA Button Text (legacy; products use Add to Quote)',
              defaultValue: 'Add to Quote',
            },
            {
              name: 'ctaTextAr',
              type: 'text',
              label: 'CTA Button Text (Arabic)',
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'seo.metaTitle',
              descriptionPath: 'seo.metaDescription',
              imagePath: 'seo.ogImage',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            {
              name: 'keywords',
              type: 'text',
              label: 'Keywords',
            },
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'seo.metaTitle',
              descriptionPath: 'seo.metaDescription',
            }),
          ],
        },
      ],
    },
    slugField({ fieldToUse: 'name' }),
  ],
  hooks: {
    afterChange: [revalidateProduct],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}

