/**
 * Leads afterChange hook: Push website interest form submissions to ClickUp.
 */

import type { CollectionAfterChangeHook } from 'payload'
import { pushTrainingInterestToClickUp } from '../../../lib/clickup/pushTrainingInterestToClickUp'

export const pushTrainingInterestToClickUpHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') {
    return doc
  }

  if (req.context?.skipClickUpHook === true) {
    return doc
  }

  if (doc.pushedToClickUp === true) {
    return doc
  }

  const result = await pushTrainingInterestToClickUp(doc)

  if (!result) {
    return doc
  }

  try {
    await req.payload.update({
      collection: 'training-interest-submissions',
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
    console.error('[TrainingInterest] Failed to update with ClickUp task ID:', err)
    try {
      await new Promise((r) => setTimeout(r, 250))
      await req.payload.update({
        collection: 'training-interest-submissions',
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
      console.error('[TrainingInterest] Retry update with ClickUp task ID failed:', retryErr)
    }
  }

  return doc
}
