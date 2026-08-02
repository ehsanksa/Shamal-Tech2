import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import {
  PROCUREMENT_ITEM_CATEGORIES,
  PROCUREMENT_PRIORITIES,
} from '../../lib/procurement/constants'

export const ProcurementRequests: CollectionConfig = {
  slug: 'procurement-requests',
  labels: {
    singular: 'Procurement Request',
    plural: 'Procurement Requests',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    group: 'Procurement',
    useAsTitle: 'requestId',
    defaultColumns: [
      'requestId',
      'requesterName',
      'companyName',
      'project',
      'itemCategory',
      'priority',
      'status',
      'submittedAt',
    ],
    description:
      'Submissions from /procurement/request. Form availability and domain access are controlled under Procurement Form.',
  },
  fields: [
    {
      name: 'requestId',
      type: 'text',
      label: 'Request ID',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      type: 'collapsible',
      label: 'Requester Information',
      fields: [
        {
          name: 'requesterName',
          type: 'text',
          label: 'Requester Name',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: true,
        },
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'companyName',
          type: 'text',
          label: 'Company Name',
        },
        {
          name: 'department',
          type: 'text',
          label: 'Department',
          required: true,
        },
        {
          name: 'emailDomain',
          type: 'text',
          label: 'Email Domain',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Project Information',
      fields: [
        {
          name: 'project',
          type: 'text',
          label: 'Associated Project',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Procurement Details',
      fields: [
        {
          name: 'itemCategory',
          type: 'select',
          label: 'Item Category',
          required: true,
          options: [...PROCUREMENT_ITEM_CATEGORIES],
        },
        {
          name: 'itemCategoryOther',
          type: 'text',
          label: 'Please Specify',
          admin: {
            condition: (_, siblingData) => siblingData?.itemCategory === 'other',
          },
        },
        {
          name: 'priority',
          type: 'select',
          label: 'Priority',
          required: true,
          defaultValue: 'medium',
          options: [...PROCUREMENT_PRIORITIES],
          admin: {
            components: {
              Cell: '/collections/ProcurementRequests/PriorityBadgeCell#default',
            },
          },
        },
        {
          name: 'itemName',
          type: 'text',
          label: 'Item / Service Name',
          required: true,
        },
        {
          name: 'detailedDescription',
          type: 'textarea',
          label: 'Detailed Description',
          required: true,
        },
        {
          name: 'productUrl',
          type: 'text',
          label: 'Product URL / Reference Link',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Quantity',
          required: true,
          min: 1,
        },
        {
          name: 'preferredVendor',
          type: 'text',
          label: 'Preferred Vendor / Supplier',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'estimatedUnitCost',
              type: 'number',
              label: 'Estimated Unit Cost',
              min: 0,
              admin: { width: '50%' },
            },
            {
              name: 'estimatedTotalCost',
              type: 'number',
              label: 'Estimated Total Cost',
              min: 0,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'requiredByDate',
          type: 'date',
          label: 'Required By Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd-MMM-yyyy',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Business Justification',
      fields: [
        {
          name: 'businessJustification',
          type: 'textarea',
          label: 'Purpose / Business Justification',
          required: true,
        },
      ],
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Attachments',
    },
    {
      name: 'approvedDomain',
      type: 'relationship',
      relationTo: 'procurement-approved-domains',
      label: 'Matched Approved Domain',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ operation, value }) => {
            if (operation === 'create' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'clickupTaskId',
      type: 'text',
      label: 'ClickUp Task ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'clickupTaskUrl',
      type: 'text',
      label: 'ClickUp Task URL',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'pushedToClickUp',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
