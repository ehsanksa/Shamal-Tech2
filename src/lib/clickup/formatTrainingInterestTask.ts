export type TrainingInterestClickUpFields = {
  referenceNumber?: string | null
  fullName?: string | null
  mobile?: string | null
  email?: string | null
  city?: string | null
  nationality?: string | null
  organization?: string | null
  jobTitle?: string | null
  registeringAs?: string | null
  droneExperience?: string | null
  trainingPurpose?: string | null
  expectedOutcomes?: string | null
  certificateInterest?: string | null
  additionalInfo?: string | null
  referralSource?: string | null
  submittedAt?: string | null
  createdAt?: string | null
}

const REGISTERING_AS_LABELS: Record<string, string> = {
  individual: 'Individual',
  'company-employee': 'Company Employee',
  student: 'Student',
  government: 'Government Entity',
  other: 'Other',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  beginner: 'Beginner level',
  intermediate: 'Intermediate level',
  advanced: 'Advanced level',
}

const CERTIFICATE_LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  maybe: 'Maybe',
}

const REFERRAL_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  website: 'Website',
  google: 'Google Search',
  referral: 'Referral',
  event: 'Event / Exhibition',
  other: 'Other',
}

function line(label: string, value: string | null | undefined): string {
  return `${label}: ${value?.trim() || '—'}`
}

function labelFrom(map: Record<string, string>, value: string | null | undefined): string {
  if (!value) return '—'
  return map[value] ?? value
}

export function clickUpTaskTitleForTrainingInterest(fullName: string): string {
  return fullName.trim() || 'Unknown'
}

function formatSubmissionDateTime(doc: TrainingInterestClickUpFields): string {
  const raw = doc.submittedAt || doc.createdAt
  if (!raw) return '—'
  const ms = Date.parse(String(raw))
  if (Number.isNaN(ms)) return String(raw)
  return new Date(ms).toLocaleString('en-GB', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatTrainingInterestClickUpDescription(
  doc: TrainingInterestClickUpFields,
): string {
  const messageParts = [doc.trainingPurpose?.trim(), doc.additionalInfo?.trim()].filter(Boolean)

  const parts = [
    'Source: Training Platform Interest Form',
    '',
    line('Training reference', doc.referenceNumber),
    line('Submission date/time', formatSubmissionDateTime(doc)),
    '',
    '--- Applicant ---',
    line('Full Name', doc.fullName),
    line('Email', doc.email),
    line('Phone', doc.mobile),
    line('City / Location', doc.city),
    line('Nationality', doc.nationality),
    '',
    '--- Professional Details ---',
    line('Company', doc.organization),
    line('Job Title', doc.jobTitle),
    line('Registering as', labelFrom(REGISTERING_AS_LABELS, doc.registeringAs)),
    '',
    '--- Training Interest ---',
    line('Previous drone/GIS experience', labelFrom(EXPERIENCE_LABELS, doc.droneExperience)),
    line('Certificate interest', labelFrom(CERTIFICATE_LABELS, doc.certificateInterest)),
    '',
    '--- Message ---',
    messageParts.length > 0 ? messageParts.join('\n\n') : '—',
    '',
    'Expected outcomes:',
    doc.expectedOutcomes?.trim() || '—',
    '',
    line('How they heard about us', labelFrom(REFERRAL_LABELS, doc.referralSource)),
  ]
  return parts.join('\n')
}

export function mapTrainingInterestRow(doc: TrainingInterestClickUpFields & {
  submittedAt?: string | null
  createdAt?: string | null
  status?: string | null
  pushedToClickUp?: boolean | null
  clickupTaskUrl?: string | null
}) {
  return {
    'Reference Number': doc.referenceNumber ?? '',
    'Full Name': doc.fullName ?? '',
    'Mobile / WhatsApp': doc.mobile ?? '',
    Email: doc.email ?? '',
    'City / Location': doc.city ?? '',
    Nationality: doc.nationality ?? '',
    Organization: doc.organization ?? '',
    'Job Title': doc.jobTitle ?? '',
    'Registering As': labelFrom(REGISTERING_AS_LABELS, doc.registeringAs),
    'Drone / GIS Experience': labelFrom(EXPERIENCE_LABELS, doc.droneExperience),
    'Purpose of Training': doc.trainingPurpose ?? '',
    'Expected Outcomes': doc.expectedOutcomes ?? '',
    'Certificate Interest': labelFrom(CERTIFICATE_LABELS, doc.certificateInterest),
    'Additional Info': doc.additionalInfo ?? '',
    'Referral Source': labelFrom(REFERRAL_LABELS, doc.referralSource),
    Status: doc.status ?? '',
    'Pushed to ClickUp': doc.pushedToClickUp ? 'Yes' : 'No',
    'ClickUp Task URL': doc.clickupTaskUrl ?? '',
    'Submitted At': doc.submittedAt ?? '',
    'Created At': doc.createdAt ?? '',
  }
}
