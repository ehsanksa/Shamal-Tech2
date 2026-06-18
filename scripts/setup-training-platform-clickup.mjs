#!/usr/bin/env node
/**
 * Creates BD → Training Platform folder + Interest Registrations list in ClickUp.
 * Run: node scripts/setup-training-platform-clickup.mjs
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
const BD_SPACE_ID = '90121349032'
const FOLDER_NAME = 'Training Platform'
const LIST_NAME = 'Interest Registrations'

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
  if (!res.ok) throw new Error(`${res.status} ${path}: ${text.slice(0, 500)}`)
  return text ? JSON.parse(text) : {}
}

function upsertEnv(key, value) {
  const line = `${key}=${value}`
  const idx = envLines.findIndex((l) => l.startsWith(`${key}=`))
  if (idx >= 0) {
    envLines[idx] = line
  } else {
    envLines.push(line)
  }
  writeFileSync(envPath, envLines.join('\n'))
}

async function main() {
  const folders = await cu(`/space/${BD_SPACE_ID}/folder?archived=false`)
  let folder = (folders.folders || []).find(
    (f) => f.name.trim().toLowerCase() === FOLDER_NAME.toLowerCase(),
  )

  if (!folder) {
    console.log(`Creating folder "${FOLDER_NAME}" in BD space...`)
    folder = await cu(`/space/${BD_SPACE_ID}/folder`, {
      method: 'POST',
      body: JSON.stringify({ name: FOLDER_NAME }),
    })
    console.log('Folder created:', folder.id, folder.name)
  } else {
    console.log('Folder exists:', folder.id, folder.name)
  }

  let list = (folder.lists || []).find(
    (l) => l.name.trim().toLowerCase() === LIST_NAME.toLowerCase(),
  )

  if (!list) {
    console.log(`Creating list "${LIST_NAME}"...`)
    list = await cu(`/folder/${folder.id}/list`, {
      method: 'POST',
      body: JSON.stringify({ name: LIST_NAME }),
    })
    console.log('List created:', list.id, list.name)
  } else {
    console.log('List exists:', list.id, list.name)
  }

  upsertEnv('CLICKUP_TRAINING_PLATFORM_LIST_ID', list.id)
  console.log('Updated .env with CLICKUP_TRAINING_PLATFORM_LIST_ID=' + list.id)
  console.log('ClickUp URL: https://app.clickup.com/' + list.id)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
