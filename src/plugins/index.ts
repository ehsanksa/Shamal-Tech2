import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects } from '../hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '../search/fieldOverrides'
import { beforeSyncWithSearch } from '../search/beforeSync'

import { Page, Post } from '../payload-types'
import { getServerSideURL } from '../utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Shamal Technologies` : 'Shamal Technologies'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

// Helper function to check if S3 is properly configured
const isS3Configured = (): boolean => {
  const hasBucket = !!process.env.S3_BUCKET
  const hasAccessKey = !!process.env.S3_ACCESS_KEY_ID
  const hasSecretKey = !!process.env.S3_SECRET_ACCESS_KEY
  const hasRegion = !!process.env.S3_REGION

  const isConfigured = hasBucket && hasAccessKey && hasSecretKey && hasRegion

  if (process.env.NODE_ENV !== 'production') {
    if (isConfigured) {
      console.log('✅ S3 Storage configured:', {
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        prefix: process.env.S3_PREFIX ?? '(bucket root)',
      })
    } else {
      console.warn('⚠️  S3 Storage not configured. Using local storage for development.')
      if (!hasBucket) console.warn('   Missing: S3_BUCKET')
      if (!hasAccessKey) console.warn('   Missing: S3_ACCESS_KEY_ID')
      if (!hasSecretKey) console.warn('   Missing: S3_SECRET_ACCESS_KEY')
      if (!hasRegion) console.warn('   Missing: S3_REGION')
    }
  }

  return isConfigured
}

export const plugins: Plugin[] = [
  // S3 Storage adapter for cloud storage (required for Vercel deployment)
  // Only configure if S3 environment variables are provided
  // 
  // IMPORTANT: Ensure your S3 bucket policy allows public read access (GetObject) for media files.
  // Example bucket policy:
  // {
  //   "Version": "2012-10-17",
  //   "Statement": [
  //     {
  //       "Sid": "PublicReadGetObject",
  //       "Effect": "Allow",
  //       "Principal": "*",
  //       "Action": "s3:GetObject",
  //       "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/media/*"
  //     }
  //   ]
  // }
  ...(isS3Configured()
    ? [
        s3Storage({
          collections: {
            media: true,
          },
          bucket: process.env.S3_BUCKET!,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            region: process.env.S3_REGION!,
          },
          prefix: process.env.S3_PREFIX ?? '',
        }),
      ]
    : []),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
