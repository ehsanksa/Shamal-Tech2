import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { authenticated } from '../access/authenticated'
import { replicateMediaLocally } from './Media/hooks/replicateMediaLocally'
import { setS3MediaCacheControl } from './Media/hooks/setS3MediaCacheControl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  // Disabled to fix payload-folders 403 errors and slow media loading in admin.
  // Re-enable with folders: true if folder organization is needed.
  folders: false,
  access: {
    // Public read access - allow frontend to access media files
    read: () => true,
    // Restrict create/update/delete to authenticated users only
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [replicateMediaLocally, setS3MediaCacheControl],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Using S3 cloud storage for production (Vercel) or local storage for development
    // staticDir is only used when S3 is not configured (local development)
    ...(process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_REGION
      ? {}
      : {
          staticDir: path.resolve(dirname, '../../public/media'),
        }),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Lambda has a 6MB request body limit - set maxFileSize accordingly
    // For larger files, we'll need to implement client-side uploads (presigned URLs)
    maxFileSize: 5 * 1024 * 1024, // 5MB to stay under Lambda's 6MB limit
    // MIME type validation removed temporarily due to detection issues
    // Files are being incorrectly detected as text/plain with certain configurations
    // Will re-enable with proper MIME type validation once issue is resolved
    // mimeTypes: [
    //   'image/*', // All image types
    //   'video/*', // All video types (mp4, webm, etc.)
    //   'application/pdf', // PDF files
    // ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
