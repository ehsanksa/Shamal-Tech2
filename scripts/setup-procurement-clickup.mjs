#!/usr/bin/env node
/**
 * Configures ClickUp list "Smart Procurement Requests" for the procurement form:
 * - Sets CLICKUP_PROCUREMENT_LIST_ID
 * - Creates custom fields aligned with the public form
 *
 * List: https://app.clickup.com/3846681/v/li/901220061684
 * Run: node scripts/setup-procurement-clickup.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')
const envLines = readFileSync(envPath, 'utf8').split('\n')
const env = Object.fromEntries(
  envLines
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    }),
)

const TOKEN = env.CLICKUP_API_TOKEN
if (!TOKEN) throw new Error('CLICKUP_API_TOKEN missing in .env')

const API = 'https://api.clickup.com/api/v2'
const LIST_ID = env.CLICKUP_PROCUREMENT_LIST_ID?.trim() || '901220061684'

async function cu(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: TOKEN,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${path}: ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : {}
}

function upsertEnv(key, value) {
  const line = `${key}=${value}`
  const idx = envLines.findIndex((l) => l.startsWith(`${key}=`) || l.startsWith(`# ${key}=`))
  if (idx >= 0 && envLines[idx].startsWith(`${key}=`)) {
    envLines[idx] = line
  } else if (idx >= 0) {
    envLines[idx] = line
  } else {
    envLines.push(line)
  }
  writeFileSync(envPath, envLines.join('\n').replace(/\n*$/, '\n'))
}

function dropdown(options) {
  return {
    sorting: 'manual',
    options: options.map((name, orderindex) => ({
      name,
      color: null,
      orderindex,
    })),
  }
}

const FIELDS = [
  { name: 'Request ID', type: 'short_text', type_config: {} },
  { name: 'Requester Name', type: 'short_text', type_config: {} },
  { name: 'Email', type: 'email', type_config: {} },
  { name: 'Phone', type: 'phone', type_config: {} },
  { name: 'Company', type: 'short_text', type_config: {} },
  { name: 'Department', type: 'short_text', type_config: {} },
  { name: 'Project', type: 'short_text', type_config: {} },
  {
    name: 'Item Category',
    type: 'drop_down',
    type_config: dropdown([
      'Stationery',
      'Electronics',
      'Software / License',
      'Office Furniture',
      'Safety Equipment',
      'Drone Equipment',
      'Survey Equipment',
      'Vehicle Related',
      'Services',
      'Other',
    ]),
  },
  {
    name: 'Priority',
    type: 'drop_down',
    type_config: dropdown(['Low', 'Medium', 'High', 'Urgent']),
  },
  { name: 'Item / Service Name', type: 'short_text', type_config: {} },
  { name: 'Detailed Description', type: 'text', type_config: {} },
  { name: 'Product URL', type: 'url', type_config: {} },
  { name: 'Quantity', type: 'number', type_config: {} },
  { name: 'Vendor', type: 'short_text', type_config: {} },
  {
    name: 'Estimated Unit Cost',
    type: 'currency',
    type_config: { precision: 2, currency_type: 'SAR' },
  },
  {
    name: 'Estimated Cost',
    type: 'currency',
    type_config: { precision: 2, currency_type: 'SAR' },
  },
  { name: 'Required Date', type: 'date', type_config: {} },
  { name: 'Business Justification', type: 'text', type_config: {} },
  { name: 'Submission Date', type: 'date', type_config: {} },
  { name: 'Purchase Order', type: 'short_text', type_config: {} },
]

async function main() {
  const list = await cu(`/list/${LIST_ID}`)
  console.log(`List: ${list.name} (${list.id})`)
  console.log(`Statuses: ${(list.statuses || []).map((s) => s.status).join(', ')}`)

  const existing = await cu(`/list/${LIST_ID}/field`)
  const byName = new Map((existing.fields || []).map((f) => [f.name.trim().toLowerCase(), f]))

  for (const field of FIELDS) {
    const key = field.name.trim().toLowerCase()
    if (byName.has(key)) {
      console.log(`Field exists: ${field.name}`)
      continue
    }
    console.log(`Creating field: ${field.name} (${field.type})`)
    const created = await cu(`/list/${LIST_ID}/field`, {
      method: 'POST',
      body: JSON.stringify({
        name: field.name,
        type: field.type,
        type_config: field.type_config,
      }),
    })
    const createdField = created.field || created
    byName.set(key, createdField)
    console.log(`  -> ${createdField.id}`)
  }

  upsertEnv('CLICKUP_PROCUREMENT_LIST_ID', LIST_ID)
  upsertEnv('CLICKUP_ASSIGNEE_PROCUREMENT_EMAIL', 'm.aljahdali@shamal.sa')

  console.log('\nUpdated .env:')
  console.log(`  CLICKUP_PROCUREMENT_LIST_ID=${LIST_ID}`)
  console.log('  CLICKUP_ASSIGNEE_PROCUREMENT_EMAIL=m.aljahdali@shamal.sa')
  console.log(`\nOpen list: https://app.clickup.com/3846681/v/li/${LIST_ID}`)
  console.log('Note: List uses space statuses (Open / in progress / Closed).')
  console.log('New submissions will start in status "Open".')
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
