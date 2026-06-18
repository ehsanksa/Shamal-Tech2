#!/usr/bin/env node
/**
 * One-time setup for Etimad Tender - Pro in ClickUp via API.
 * Run: node scripts/setup-etimad-tender-pro.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    }),
)
const TOKEN = env.CLICKUP_API_TOKEN
if (!TOKEN) throw new Error('CLICKUP_API_TOKEN missing in .env')

const API = 'https://api.clickup.com/api/v2'
const FOLDER_ID = '901211836329'
const LIBRARY_LIST_ID = '901218897307'
const TEAM_ID = '3846681'

const TENDER_STATUSES = [
  { status: 'Not Started', type: 'open', color: '#d3d3d3', orderindex: 0 },
  { status: 'In Progress', type: 'custom', color: '#4194f6', orderindex: 1 },
  { status: 'Waiting Input', type: 'custom', color: '#f8ae00', orderindex: 2 },
  { status: 'Internal Review', type: 'custom', color: '#a875ff', orderindex: 3 },
  { status: 'Ready for Submission', type: 'custom', color: '#6bc950', orderindex: 4 },
  { status: 'Submitted', type: 'closed', color: '#008844', orderindex: 5 },
  { status: 'Not Required', type: 'done', color: '#87909e', orderindex: 6 },
]

const ELIGIBILITY_DESC =
  'This tender requires this compliance document. Use the linked Company Compliance Library task as the single source of truth. Do not upload duplicate files here unless a tender-specific version is required.'

const ELIGIBILITY_CHECKLIST = [
  'Confirm document is available',
  'Confirm document is valid',
  'Confirm expiry date is acceptable for tender deadline',
  'Confirm document is included in final package if required',
]

const TECH_FIN_CHECKLIST = [
  'Review tender requirement',
  'Prepare draft',
  'Internal technical review',
  'Finalize document',
  'Include in final package',
]

const FIN_CHECKLIST = [
  'Review financial requirement',
  'Prepare draft',
  'Finance review',
  'Management approval',
  'Finalize for Etimad submission',
]

const FINAL_PACKAGE_CHECKLIST = [
  'Technical documents completed',
  'Financial documents completed',
  'Compliance documents checked',
  'Required library documents linked',
  'Tender-specific documents added',
  'Internal review completed',
  'Management approval received',
  'Submitted on Etimad',
]

const COMPLIANCE_TASKS = [
  'Commercial Registration (السجل التجاري)',
  'National Address (العنوان الوطني)',
  'VAT Certificate (ضريبة القيمة المضافة)',
  'Zakat & Income (الزكاة والدخل)',
  'GOSI (التأمينات الاجتماعية)',
  'Saudization / Nitaqat (نطاقات)',
  'Chamber of Commerce membership (الغرفة التجارية)',
  'Classification Certificate (التصنيف)',
  'Local Content (المحتوى المحلي)',
  'GACA drone operation permits / licenses',
  'Company Profile',
]

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text}`)
  }
  return data
}

async function getListTasks(listId) {
  const data = await api('GET', `/list/${listId}/task?archived=false&include_closed=true`)
  return data.tasks || []
}

async function ensureList(name) {
  const folder = await api('GET', `/folder/${FOLDER_ID}/list?archived=false`)
  const existing = (folder.lists || []).find((l) => l.name === name)
  if (existing) return existing.id
  const created = await api('POST', `/folder/${FOLDER_ID}/list`, { name })
  return created.id
}

async function setTenderStatuses(listId) {
  await api('PUT', `/list/${listId}`, { override_statuses: true, statuses: TENDER_STATUSES })
}

async function createField(listId, field) {
  const fields = await api('GET', `/list/${listId}/field`)
  const existing = (fields.fields || []).find((f) => f.name === field.name)
  if (existing) return existing.id
  const created = await api('POST', `/list/${listId}/field`, field)
  return created.field.id
}

function dropDownOptions(names) {
  return {
    sorting: 'manual',
    options: names.map((name, i) => ({ name, color: '#87909e', orderindex: String(i) })),
  }
}

async function setupOverviewFields(listId) {
  const fields = [
    { name: 'Tender Title', type: 'short_text' },
    { name: 'Tender Number', type: 'short_text' },
    { name: 'Client / Government Entity', type: 'short_text' },
    { name: 'Etimad Link', type: 'url' },
    { name: 'Submission Deadline', type: 'date' },
    { name: 'Tender Value', type: 'currency', type_config: { precision: 2, currency_type: 'SAR' } },
    {
      name: 'Bid Decision',
      type: 'drop_down',
      type_config: dropDownOptions(['Go', 'No-Go', 'Pending Review']),
    },
    {
      name: 'Priority',
      type: 'drop_down',
      type_config: dropDownOptions(['Low', 'Medium', 'High', 'Critical']),
    },
    { name: 'Assigned BD Owner', type: 'users' },
    { name: 'Notes', type: 'text' },
  ]
  for (const f of fields) await createField(listId, f)
}

async function setupWorkflowFields(listId) {
  const fields = [
    { name: 'Responsible Owner', type: 'users' },
    { name: 'Due Date / Internal Deadline', type: 'date' },
    { name: 'Submission Required', type: 'checkbox' },
    { name: 'Tender Specific', type: 'checkbox' },
    {
      name: 'Review Status',
      type: 'drop_down',
      type_config: dropDownOptions(['Not Reviewed', 'Needs Changes', 'Approved']),
    },
    {
      name: 'Risk Level',
      type: 'drop_down',
      type_config: dropDownOptions(['Low', 'Medium', 'High']),
    },
    { name: 'Notes', type: 'text' },
  ]
  for (const f of fields) await createField(listId, f)
}

async function ensureTask(listId, name, description) {
  const tasks = await getListTasks(listId)
  const existing = tasks.find((t) => t.name === name)
  if (existing) return existing.id
  const created = await api('POST', `/list/${listId}/task`, {
    name,
    description,
    status: 'not started',
  })
  return created.id
}

async function addChecklist(taskId, items) {
  const task = await api('GET', `/task/${taskId}`)
  let checklistId = task.checklists?.[0]?.id
  if (!checklistId) {
    const cl = await api('POST', `/task/${taskId}/checklist`, { name: 'Checklist' })
    checklistId = cl.checklist.id
  }
  const existing = new Set((task.checklists?.[0]?.items || []).map((i) => i.name))
  for (const item of items) {
    if (existing.has(item)) continue
    await api('POST', `/checklist/${checklistId}/checklist_item`, { name: item })
  }
}

async function linkTasks(fromId, toId) {
  try {
    await api('POST', `/task/${fromId}/link/${toId}`)
  } catch (e) {
    if (!String(e.message).includes('already')) throw e
  }
}

async function main() {
  const summary = { lists: {}, links: 0, fields: {} }

  const overviewId = await ensureList('Tender Overview & Go/No-Go')
  const eligibilityId = await ensureList('Eligibility & Compliance')
  const technicalId = await ensureList('Technical Submission')
  const financialId = await ensureList('Financial Submission')
  const finalId = await ensureList('Final Package')

  const listIds = {
    'Tender Overview & Go/No-Go': overviewId,
    'Eligibility & Compliance': eligibilityId,
    'Technical Submission': technicalId,
    'Financial Submission': financialId,
    'Final Package': finalId,
  }

  for (const [name, id] of Object.entries(listIds)) {
    await setTenderStatuses(id)
    if (name === 'Tender Overview & Go/No-Go') await setupOverviewFields(id)
    else await setupWorkflowFields(id)
    const fields = await api('GET', `/list/${id}/field`)
    summary.fields[name] = (fields.fields || []).map((f) => `${f.name} (${f.type})`)
  }

  const overviewTasks = [
    ['Tender Summary', 'Capture the tender title, Etimad reference number, client/government entity, scope summary, submission deadline, and Etimad link.'],
    ['Scope Review', 'Review the tender scope and confirm whether it matches Shamal Technologies services such as drone operations, geospatial surveying, GIS, remote sensing, asset inspection, environmental monitoring, construction monitoring, or security surveillance.'],
    ['Eligibility Check', 'Confirm whether Shamal meets the tender eligibility requirements, required licenses, classifications, Saudization/Nitaqat, GACA drone operation permits, and other compliance items.'],
    ['Internal Go / No-Go Decision', 'Record the internal decision before investing time in the full submission. Include the reason for Go or No-Go.'],
    ['Submission Timeline & Deadlines', 'Track all important tender dates including Q&A deadline, clarification deadline, internal review deadline, financial submission deadline, and final Etimad submission deadline.'],
  ]
  for (const [name, desc] of overviewTasks) await ensureTask(overviewId, name, desc)
  summary.lists['Tender Overview & Go/No-Go'] = overviewTasks.length

  const libraryTasks = await getListTasks(LIBRARY_LIST_ID)
  const libraryByName = Object.fromEntries(libraryTasks.map((t) => [t.name, t.id]))

  for (const name of COMPLIANCE_TASKS) {
    const taskId = await ensureTask(eligibilityId, name, ELIGIBILITY_DESC)
    await addChecklist(taskId, ELIGIBILITY_CHECKLIST)
    const libId = libraryByName[name]
    if (libId) {
      await linkTasks(taskId, libId)
      summary.links++
    }
  }
  summary.lists['Eligibility & Compliance'] = COMPLIANCE_TASKS.length

  const technicalTasks = [
    ['Technical Proposal', 'Prepare the main technical proposal according to the Etimad tender requirements. Include company understanding, technical approach, deliverables, timeline, team structure, quality control, and Shamal\'s relevant drone/geospatial capabilities.'],
    ['Methodology + Gantt Chart', 'Prepare the execution methodology and project timeline. Include phases, deliverables, dependencies, mobilization, field operations, data processing, reporting, and final delivery.'],
    ['Equipment / Drone Fleet List', 'Prepare the required drone fleet, sensors, software, survey equipment, vehicles, and operational tools relevant to the tender scope. Include only available and approved equipment.'],
    ['Key Personnel CVs', 'Prepare CVs of the proposed project team. Include project manager, drone pilots, GIS specialists, surveyors, HSE staff, data processing team, and any other required personnel.'],
    ['Past Projects & Reference Letters', 'Collect relevant past project experience, completion certificates, client references, or reference letters aligned with the tender scope.'],
    ['HSE Plan', 'Prepare the Health, Safety, and Environment plan. Include site safety, drone operation safety, risk assessments, emergency procedures, permits, PPE, and compliance with client requirements.'],
  ]
  for (const [name, desc] of technicalTasks) {
    const id = await ensureTask(technicalId, name, desc)
    await addChecklist(id, TECH_FIN_CHECKLIST)
  }
  summary.lists['Technical Submission'] = technicalTasks.length

  const financialTasks = [
    ['Priced BOQ / Financial Offer (Etimad Format)', 'Prepare the financial offer exactly according to Etimad and tender requirements. Confirm all line items, quantities, unit prices, VAT, totals, and required financial format.'],
    ['Initial Guarantee / Bid Bond (الضمان الابتدائي)', 'Prepare or request the initial guarantee / bid bond if required by the tender. This is tender-specific and should not be stored in the Company Compliance Library.'],
    ['Pricing Assumptions', 'Document the pricing assumptions, exclusions, inclusions, validity period, payment terms, mobilization cost, manpower assumptions, equipment assumptions, and risk-based pricing notes.'],
  ]
  for (const [name, desc] of financialTasks) {
    const id = await ensureTask(financialId, name, desc)
    await addChecklist(id, FIN_CHECKLIST)
  }
  summary.lists['Financial Submission'] = financialTasks.length

  const finalTasks = [
    ['Assembled Submission Package', 'Prepare the complete final tender submission package. Confirm technical, financial, compliance, and supporting documents are included according to Etimad requirements.'],
    ['Etimad Submission Reference', 'Record the final Etimad submission reference number, date/time of submission, submitted by, and confirmation details. Do not fabricate this information.'],
    ['Q&A / Clarifications Log', 'Track all clarification questions, Etimad Q&A responses, client clarifications, internal notes, and final decisions affecting the submission.'],
  ]
  for (const [name, desc] of finalTasks) {
    const id = await ensureTask(finalId, name, desc)
    if (name === 'Assembled Submission Package') await addChecklist(id, FINAL_PACKAGE_CHECKLIST)
  }
  summary.lists['Final Package'] = finalTasks.length

  console.log(JSON.stringify({ folderId: FOLDER_ID, listIds, summary }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
