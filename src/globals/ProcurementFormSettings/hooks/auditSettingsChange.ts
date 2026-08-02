import type { GlobalAfterChangeHook } from 'payload'

import { writeProcurementAuditLog } from '../../../lib/procurement/audit'

export const auditSettingsChange: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipProcurementAudit) return doc

  const prevEnabled = previousDoc?.formEnabled !== false
  const nextEnabled = doc?.formEnabled !== false

  if (prevEnabled !== nextEnabled) {
    await writeProcurementAuditLog(req.payload, {
      action: nextEnabled ? 'form_enabled' : 'form_disabled',
      previousValue: prevEnabled ? 'Enabled' : 'Disabled',
      newValue: nextEnabled ? 'Enabled' : 'Disabled',
      summary: nextEnabled
        ? 'Procurement Form enabled'
        : 'Procurement Form disabled',
      req,
    })
  }

  const prevRestriction = previousDoc?.domainRestrictionEnabled === true
  const nextRestriction = doc?.domainRestrictionEnabled === true

  if (prevRestriction !== nextRestriction) {
    await writeProcurementAuditLog(req.payload, {
      action: nextRestriction ? 'domain_restriction_enabled' : 'domain_restriction_disabled',
      previousValue: prevRestriction ? 'ON' : 'OFF',
      newValue: nextRestriction ? 'ON' : 'OFF',
      summary: nextRestriction
        ? 'Domain restriction enabled'
        : 'Domain restriction disabled',
      req,
    })
  }

  return doc
}
