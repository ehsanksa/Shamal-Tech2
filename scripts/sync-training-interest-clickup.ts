/**
 * Backfill training interest form submissions to ClickUp (BD → Training Platform list).
 * Run: pnpm exec tsx scripts/sync-training-interest-clickup.ts
 * Force re-push (e.g. after deleted tasks): add --force
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'
import { pushTrainingInterestToClickUp } from '../src/lib/clickup/pushTrainingInterestToClickUp'
import {
  getTrainingInterestClickUpAssigneeIds,
  resolveTrainingInterestClickUpAssigneeEmails,
} from '../src/lib/clickup/trainingInterestSettings'
import { syncClickUpTaskAssignees } from '../src/lib/clickup/assignees'

const force = process.argv.includes('--force')
const reassignOnly = process.argv.includes('--reassign-assignees')

async function verifyClickUpTask(taskId: string): Promise<boolean> {
  const apiToken = process.env.CLICKUP_API_TOKEN?.trim()
  if (!apiToken || !taskId) return false
  try {
    const res = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      headers: { Authorization: apiToken },
    })
    return res.ok
  } catch {
    return false
  }
}

async function main() {
  const listId = process.env.CLICKUP_TRAINING_PLATFORM_LIST_ID?.trim()
  if (!listId) {
    console.error('Missing CLICKUP_TRAINING_PLATFORM_LIST_ID in environment')
    process.exit(1)
  }
  if (!process.env.CLICKUP_API_TOKEN?.trim()) {
    console.error('Missing CLICKUP_API_TOKEN in environment')
    process.exit(1)
  }

  console.log(`ClickUp list: https://app.clickup.com/${listId}`)
  console.log(force ? 'Mode: force (re-push all)' : 'Mode: push only missing or stale tasks')

  const payload = await getPayload({ config })
  const formSettings = await payload.findGlobal({
    slug: 'form-notification-settings',
    depth: 0,
  })
  const assigneeEmails = resolveTrainingInterestClickUpAssigneeEmails(formSettings)
  const assigneeIds = await getTrainingInterestClickUpAssigneeIds(formSettings)
  console.log(`Assignees: ${assigneeEmails.join(', ')}`)

  const { docs } = await payload.find({
    collection: 'training-interest-submissions',
    limit: 500,
    sort: 'createdAt',
    depth: 0,
    overrideAccess: true,
  })

  console.log(`Found ${docs.length} submission(s) in admin`)

  let pushed = 0
  let skipped = 0
  let failed = 0

  for (const doc of docs) {
    const label = `${doc.referenceNumber || doc.id} — ${doc.fullName} <${doc.email}>`

    if (reassignOnly) {
      const taskId = doc.clickupTaskId?.trim()
      if (!taskId) {
        console.log(`SKIP (no ClickUp task id): ${label}`)
        skipped++
        continue
      }
      if (!(await verifyClickUpTask(taskId))) {
        console.log(`SKIP (task missing in ClickUp): ${label}`)
        skipped++
        continue
      }
      console.log(`REASSIGN: ${label}`)
      const ok = await syncClickUpTaskAssignees(taskId, assigneeIds)
      if (!ok) {
        console.error(`  FAILED: ${label}`)
        failed++
      } else {
        console.log(`  OK → assigned to ${assigneeEmails.join(', ')}`)
        pushed++
      }
      continue
    }

    if (doc.pushedToClickUp && doc.clickupTaskId && !force) {
      const exists = await verifyClickUpTask(doc.clickupTaskId)
      if (exists) {
        console.log(`SKIP (already in ClickUp): ${label}`)
        skipped++
        continue
      }
      console.log(`RE-PUSH (task missing in ClickUp): ${label}`)
    } else if (doc.pushedToClickUp && !force) {
      console.log(`RE-PUSH (marked pushed but no task id): ${label}`)
    } else {
      console.log(`PUSH: ${label}`)
    }

    const result = await pushTrainingInterestToClickUp(doc, { formSettings })
    if (!result) {
      console.error(`  FAILED: ${label}`)
      failed++
      continue
    }

    await payload.update({
      collection: 'training-interest-submissions',
      id: doc.id,
      overrideAccess: true,
      data: {
        pushedToClickUp: true,
        clickupTaskId: result.id,
        clickupTaskUrl: result.url,
      },
      context: { disableRevalidate: true },
    })

    console.log(`  OK → ${result.url}`)
    pushed++
  }

  console.log(`\nDone. Pushed: ${pushed}, skipped: ${skipped}, failed: ${failed}`)
  await payload.db.connection?.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
