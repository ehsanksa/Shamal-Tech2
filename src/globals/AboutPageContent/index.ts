import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { processLeadershipWhiteBackgroundBeforeChange } from './hooks/processLeadershipWhiteBackground'
import { revalidateAbout } from './hooks/revalidateAbout'

export const AboutPageContent: GlobalConfig = {
  slug: 'about-page-content',
  access: {
    read: anyone,
    update: anyone,
  },
  hooks: {
    beforeChange: [processLeadershipWhiteBackgroundBeforeChange],
    afterChange: [revalidateAbout],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Our Story',
          admin: {
            description: 'Small label above the title (e.g. "Our Story")',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload an image for the hero background. If no image is uploaded, the video will be used as fallback.',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload a video for the hero background. Video will be used if no image is uploaded. Recommended: MP4 format, optimized for web.',
            condition: (data) => !data.image, // Only show if no image is set
          },
        },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      label: 'Vision Section',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'content',
          type: 'textarea',
        },
        {
          name: 'contentAr',
          type: 'textarea',
          label: 'Content (Arabic)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imageWhiteBg',
          type: 'upload',
          relationTo: 'media',
          admin: {
            readOnly: true,
            description: 'Auto-generated white-background version of the image via remove.bg API.',
          },
        },
        {
          name: 'imageWhiteBgSourceId',
          type: 'text',
          admin: {
            readOnly: true,
            hidden: true,
          },
        },
      ],
    },
    {
      name: 'mission',
      type: 'group',
      label: 'Mission Section',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'content',
          type: 'textarea',
        },
        {
          name: 'contentAr',
          type: 'textarea',
          label: 'Content (Arabic)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'whyChooseUs',
      type: 'group',
      label: 'Why Choose Us Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          defaultValue: 'Advantages',
          admin: {
            description: 'Small label above the main heading (e.g. "Advantages")',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge (Arabic)',
          admin: {
            description: 'Arabic text for the badge when Arabic language is selected',
          },
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Why Choose Us',
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'subtitleAr',
          type: 'text',
          label: 'Subtitle (Arabic)',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Items',
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
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: 'Description (Arabic)',
            },
            {
              name: 'content',
              type: 'textarea',
              admin: {
                description: 'Alternative to description field',
              },
            },
            {
              name: 'contentAr',
              type: 'textarea',
              label: 'Content (Arabic)',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image displayed in the sticky right column (desktop)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Certifications',
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
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Achievements/Milestones',
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
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      label: 'Company Timeline',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
      ],
    },
    {
      name: 'leadershipSection',
      type: 'group',
      label: 'Leadership Section Header',
      admin: {
        description: 'Badge, title, and description for the Leadership/Meet the Team section.',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'OUR PEOPLE',
          admin: {
            description: 'Small label above the section title (e.g. "OUR PEOPLE")',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Meet the Team Driving the Vision',
          admin: {
            description: 'Main heading for the leadership section',
          },
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Introductory text below the title',
          },
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
      ],
    },
    {
      name: 'leadership',
      type: 'array',
      label: 'Leadership Team',
      admin: {
        description: 'Team members displayed in the carousel. Each member has name, position, bio, and optional image.',
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
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'positionAr',
          type: 'text',
          label: 'Position (Arabic)',
        },
        {
          name: 'bio',
          type: 'textarea',
          admin: {
            description: 'Bio content should not exceed 700 characters. Characters remaining will be shown as you type.',
            rows: 4,
          },
          validate: (value: string | null | undefined) => {
            if (value && value.length > 700) {
              return `Bio content cannot exceed 700 characters. Current length: ${value.length} characters. Please reduce by ${value.length - 700} characters.`
            }
            return true
          },
        },
        {
          name: 'bioAr',
          type: 'textarea',
          label: 'Bio (Arabic)',
          admin: {
            description: 'Bio content should not exceed 700 characters for Arabic.',
            rows: 4,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'clientsSection',
      type: 'group',
      label: 'Clients Section Header',
      admin: {
        description: 'Badge, title, and description for the Clients/Partners section.',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Partners',
          admin: {
            description: 'Small label above the section title (e.g. "Partners")',
          },
        },
        {
          name: 'badgeAr',
          type: 'text',
          label: 'Badge Text (Arabic)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Our Clients',
          admin: {
            description: 'Main heading for the clients section',
          },
        },
        {
          name: 'titleAr',
          type: 'text',
          label: 'Title (Arabic)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Introductory text below the title',
          },
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
      ],
    },
    {
      name: 'clients',
      type: 'array',
      label: 'Clients',
      minRows: 0,
      admin: {
        description: 'Client logos displayed in the infinite logo section on the homepage and about page. Only images are needed. You can add unlimited client logos.',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      admin: {
        description: 'Client testimonials with name, image, and review text.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Client Name',
        },
        {
          name: 'nameAr',
          type: 'text',
          label: 'Client Name (Arabic)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Client Image',
        },
        {
          name: 'review',
          type: 'textarea',
          required: true,
          label: 'Testimonial Review',
          admin: {
            rows: 4,
          },
        },
        {
          name: 'reviewAr',
          type: 'textarea',
          label: 'Testimonial Review (Arabic)',
          admin: {
            rows: 4,
          },
        },
      ],
    },
    {
      name: 'strengths',
      type: 'array',
      label: 'Company Strengths',
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
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'descriptionAr',
          type: 'textarea',
          label: 'Description (Arabic)',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}

