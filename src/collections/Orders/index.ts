import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    defaultColumns: ['orderNumber', 'status', 'customerEmail', 'totalAmount', 'createdAt'],
    useAsTitle: 'orderNumber',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending payment', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'SAR',
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Total in SAR (major units)',
      },
    },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        {
          name: 'provider',
          type: 'text',
          defaultValue: 'stc-pay',
        },
        {
          name: 'merchantReference',
          type: 'text',
        },
        {
          name: 'fortId',
          type: 'text',
        },
        {
          name: 'responseCode',
          type: 'text',
        },
        {
          name: 'responseMessage',
          type: 'text',
        },
        {
          name: 'paymentOption',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}
