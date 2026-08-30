import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { anyone } from '../../access/anyone'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { ensureMetaExists, ensureMetaOnSave, sanitizeCategories } from './hooks/sanitizeForRead'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: anyone,
    delete: anyone,
    read: authenticatedOrPublished,
    update: anyone,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'date', 'category', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'titleAr',
      type: 'text',
      label: 'Title (Arabic)',
      admin: {
        description: 'Arabic title displayed when Arabic language is selected',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'author',
              type: 'text',
              label: 'Author Name',
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Image',
            },
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Media (Images/Videos)',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description/Excerpt',
              maxLength: 5000,
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: 'Description/Excerpt (Arabic)',
              maxLength: 5000,
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
            {
              name: 'contentAr',
              type: 'richText',
              label: 'Content (Arabic)',
              admin: {
                description: 'Arabic content displayed when Arabic language is selected',
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'category',
              type: 'select',
              label: 'Blog Category',
              options: [
                {
                  label: 'News',
                  value: 'news',
                },
                {
                  label: 'Technology',
                  value: 'technology',
                },
                {
                  label: 'Industry Insights',
                  value: 'industry-insights',
                },
                {
                  label: 'Case Studies',
                  value: 'case-studies',
                },
                {
                  label: 'Updates',
                  value: 'updates',
                },
              ],
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              label: 'Tags',
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    beforeRead: [ensureMetaExists],
    beforeChange: [ensureMetaOnSave],
    afterChange: [revalidatePost],
    afterRead: [sanitizeCategories],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
