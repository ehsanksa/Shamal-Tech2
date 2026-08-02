import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { writeProcurementAuditLog } from '../../lib/procurement/audit'
import { normalizeDomain } from '../../lib/procurement/domains'
import { PERMANENT_INTERNAL_DOMAIN } from '../../lib/procurement/constants'

export const ProcurementApprovedDomains: CollectionConfig = {
  slug: 'procurement-approved-domains',
  labels: {
    singular: 'Approved Domain',
    plural: 'Approved Domains',
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    group: 'Procurement',
    useAsTitle: 'domain',
    defaultColumns: ['domain', 'companyName', 'project', 'expiryDate', 'status', 'domainType'],
    description:
      'Manage email domains allowed to submit the Procurement Form. shamal.sa is permanent and cannot be removed.',
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Domain Name',
      required: true,
      unique: true,
      admin: {
        description: 'Example: neom.com (without @)',
      },
    },
    {
      name: 'project',
      type: 'text',
      label: 'Associated Project',
      required: true,
    },
    {
      name: 'contactPerson',
      type: 'text',
      label: 'Contact Person',
    },
    {
      name: 'expiryDate',
      type: 'date',
      label: 'Expiry Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd-MMM-yyyy',
        },
        condition: (_, siblingData) => !siblingData?.isPermanent,
        description: 'When reached, the domain becomes Inactive automatically.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
    {
      name: 'domainType',
      type: 'select',
      label: 'Type',
      defaultValue: 'external',
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'External', value: 'external' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isPermanent',
      type: 'checkbox',
      label: 'Permanent (not editable/removable)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Internal domains such as shamal.sa cannot be removed.',
      },
    },
    {
      name: 'notified30Days',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (_, siblingData) => !siblingData?.isPermanent,
      },
    },
    {
      name: 'notified7Days',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (_, siblingData) => !siblingData?.isPermanent,
      },
    },
    {
      name: 'notifiedExpired',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (_, siblingData) => !siblingData?.isPermanent,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation, originalDoc, context }) => {
        if (!data || context?.skipDomainProtection) return data

        if (data.domain) {
          data.domain = normalizeDomain(data.domain)
        }

        const isPermanent =
          Boolean(originalDoc?.isPermanent) ||
          data.isPermanent === true ||
          data.domain === PERMANENT_INTERNAL_DOMAIN

        if (isPermanent) {
          data.domain = PERMANENT_INTERNAL_DOMAIN
          data.isPermanent = true
          data.domainType = 'internal'
          data.status = 'active'
          data.expiryDate = null
          if (operation === 'create') {
            data.companyName = data.companyName || 'Shamal Technologies'
            data.project = data.project || 'Internal'
          }
        } else {
          data.isPermanent = false
          data.domainType = 'external'
          if (!data.expiryDate && operation === 'create') {
            throw new APIError('Expiry date is required for external project domains.', 400)
          }
        }

        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc, context, operation }) => {
        if (!data || context?.skipDomainProtection) return data

        if (originalDoc?.isPermanent) {
          if (operation === 'update') {
            throw new APIError(
              'Permanent internal domains cannot be edited by administrators.',
              403,
            )
          }
          data.domain = PERMANENT_INTERNAL_DOMAIN
          data.isPermanent = true
          data.domainType = 'internal'
          data.status = 'active'
          data.expiryDate = null
        }

        // Reset expiry notification flags when expiry date changes
        if (
          originalDoc &&
          data.expiryDate &&
          originalDoc.expiryDate &&
          String(data.expiryDate) !== String(originalDoc.expiryDate)
        ) {
          data.notified30Days = false
          data.notified7Days = false
          data.notifiedExpired = false
        }

        return data
      },
    ],
    beforeDelete: [
      async ({ id, req, context }) => {
        if (context?.skipDomainProtection) return

        const doc = await req.payload.findByID({
          collection: 'procurement-approved-domains',
          id,
          depth: 0,
          overrideAccess: true,
        })

        if (doc?.isPermanent || doc?.domain === PERMANENT_INTERNAL_DOMAIN) {
          throw new APIError(
            'Permanent internal domains cannot be deleted.',
            403,
          )
        }
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req, context }) => {
        if (context?.skipProcurementAudit) return doc

        if (operation === 'create') {
          await writeProcurementAuditLog(req.payload, {
            action: 'domain_added',
            previousValue: null,
            newValue: {
              domain: doc.domain,
              companyName: doc.companyName,
              project: doc.project,
              expiryDate: doc.expiryDate,
              status: doc.status,
            },
            relatedDomain: doc.domain,
            summary: `Added approved domain ${doc.domain}`,
            req,
          })
          return doc
        }

        if (context?.procurementAuditAction === 'domain_disabled' || (previousDoc?.status === 'active' && doc.status === 'inactive')) {
          await writeProcurementAuditLog(req.payload, {
            action: 'domain_disabled',
            previousValue: previousDoc,
            newValue: doc,
            relatedDomain: doc.domain,
            summary: `Disabled domain ${doc.domain}`,
            req,
          })
          return doc
        }

        await writeProcurementAuditLog(req.payload, {
          action: 'domain_edited',
          previousValue: previousDoc,
          newValue: {
            domain: doc.domain,
            companyName: doc.companyName,
            project: doc.project,
            contactPerson: doc.contactPerson,
            expiryDate: doc.expiryDate,
            status: doc.status,
            notes: doc.notes,
          },
          relatedDomain: doc.domain,
          summary: `Edited approved domain ${doc.domain}`,
          req,
        })

        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req, context }) => {
        if (context?.skipProcurementAudit) return
        await writeProcurementAuditLog(req.payload, {
          action: 'domain_deleted',
          previousValue: {
            domain: doc.domain,
            companyName: doc.companyName,
            project: doc.project,
            status: doc.status,
          },
          newValue: null,
          relatedDomain: doc.domain,
          summary: `Deleted approved domain ${doc.domain}`,
          req,
        })
      },
    ],
  },
  timestamps: true,
}
