/**
 * Leads afterChange hook: Push website-originated leads to ClickUp.
 *
 * SAFETY GUARANTEES:
 * - Runs ONLY on operation === 'create' (admin edits never trigger)
 * - Runs ONLY if leadOrigin === 'website' (admin-created leads are skipped)
 * - Skips if pushedToClickUp === true (idempotent, no duplicates)
 * - NEVER throws - ClickUp failures are logged but never block lead creation
 *
 * LOOP PREVENTION:
 * - Our payload.update() triggers afterChange with operation === 'update'
 * - We only act when operation === 'create', so we exit immediately on update
 */

import type { CollectionAfterChangeHook } from 'payload'
import { pushLeadToClickUp } from '../../../lib/clickup/pushLeadToClickUp'

export const pushToClickUp: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // 1. Only run on create - admin edits never trigger ClickUp sync
  if (operation !== 'create') {
    return doc
  }

  // 2. Only push leads from website form - admin-created leads stay in Payload only
  if (doc.leadOrigin !== 'website') {
    return doc
  }

  // 3. Quote API pushes ClickUp + WhatsApp in one orchestrated call
  if (req.context?.skipClickUpHook === true) {
    return doc
  }

  // 4. Idempotency - skip if already pushed (safety for retries)
  if (doc.pushedToClickUp === true) {
    return doc
  }

  const result = await pushLeadToClickUp(req.payload, doc)

  if (!result) {
    return doc
  }

  try {
    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      overrideAccess: true,
      data: {
        pushedToClickUp: true,
        clickupTaskId: result.id,
        clickupTaskUrl: result.url,
      },
      context: {
        disableRevalidate: true,
      },
    })
  } catch (err) {
    console.error('[Leads] Failed to update lead with ClickUp task ID:', err)
    // Retry once after create transaction settles (avoids intermittent 404 in afterChange)
    try {
      await new Promise((r) => setTimeout(r, 250))
      await req.payload.update({
        collection: 'leads',
        id: doc.id,
        overrideAccess: true,
        data: {
          pushedToClickUp: true,
          clickupTaskId: result.id,
          clickupTaskUrl: result.url,
        },
        context: {
          disableRevalidate: true,
        },
      })
    } catch (retryErr) {
      console.error('[Leads] Retry update lead with ClickUp task ID failed:', retryErr)
    }
  }

  return doc
}
