import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

import { revalidatePromoPopup } from './hooks/revalidatePromoPopup'

const sectionFields = (defaults: {
  badge: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  imageFit: 'cover' | 'contain'
}) => [
  {
    name: 'badge',
    type: 'text' as const,
    label: 'Badge',
    defaultValue: defaults.badge,
    admin: {
      description: 'Small label above the title (e.g. Training, Products)',
    },
  },
  {
    name: 'title',
    type: 'text' as const,
    label: 'Title',
    required: true,
    defaultValue: defaults.title,
  },
  {
    name: 'subtitle',
    type: 'textarea' as const,
    label: 'Subtitle',
    defaultValue: defaults.subtitle,
  },
  {
    name: 'image',
    type: 'upload' as const,
    relationTo: 'media' as const,
    label: 'Image',
    admin: {
      description: 'Recommended ~16:10. Upload a new image anytime to update the popup.',
    },
  },
  {
    name: 'imageAlt',
    type: 'text' as const,
    label: 'Image Alt Text',
  },
  {
    name: 'imageFit',
    type: 'select' as const,
    label: 'Image Fit',
    defaultValue: defaults.imageFit,
    options: [
      { label: 'Cover (fill frame)', value: 'cover' },
      { label: 'Contain (show full image)', value: 'contain' },
    ],
  },
  {
    name: 'ctaLabel',
    type: 'text' as const,
    label: 'Button Label',
    required: true,
    defaultValue: defaults.ctaLabel,
  },
  {
    name: 'ctaHref',
    type: 'text' as const,
    label: 'Button Link',
    required: true,
    defaultValue: defaults.ctaHref,
    admin: {
      description: 'Internal path (e.g. /training) or full URL',
    },
  },
]

export const PromoPopupContent: GlobalConfig = {
  slug: 'promo-popup-content',
  label: 'Promo Popup',
  admin: {
    description: 'Homepage-style promo modal for Academy training and DJI products.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidatePromoPopup],
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Show Promo Popup',
      defaultValue: true,
      admin: {
        description: 'Turn off to hide the popup site-wide without deleting content.',
      },
    },
    {
      name: 'showIntervalDays',
      type: 'number',
      label: 'Show Again After (Days)',
      defaultValue: 7,
      min: 1,
      max: 365,
      admin: {
        description: 'How many days after closing before the popup can appear again for the same visitor.',
        width: '50%',
      },
    },
    {
      name: 'openDelayMs',
      type: 'number',
      label: 'Open Delay (ms)',
      defaultValue: 1200,
      min: 0,
      max: 10000,
      admin: {
        description: 'Delay before the popup appears after page load.',
        width: '50%',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Section 1 — Academy',
          fields: [
            {
              name: 'academy',
              type: 'group',
              label: 'Academy Section',
              fields: sectionFields({
                badge: 'Training',
                title: 'SHAMAL ACADEMY',
                subtitle: 'Learn Drone Technology, GIS, LiDAR, Mapping & Surveying',
                ctaLabel: 'Join Training Platform',
                ctaHref: '/training',
                imageFit: 'cover',
              }),
            },
          ],
        },
        {
          label: 'Section 2 — Products',
          fields: [
            {
              name: 'products',
              type: 'group',
              label: 'Products Section',
              fields: sectionFields({
                badge: 'Products',
                title: 'DJI AUTHORIZED SELLER IN KSA',
                subtitle: 'Buy Enterprise Drones, DJI Dock, Payloads & Survey Solutions',
                ctaLabel: 'Buy Products Now',
                ctaHref: '/products',
                imageFit: 'contain',
              }),
            },
          ],
        },
      ],
    },
  ],
}
