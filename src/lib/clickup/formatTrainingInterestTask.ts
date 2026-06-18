export type TrainingInterestClickUpFields = {
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

export function clickUpTaskTitleForTrainingInterest(fullName: string, organization?: string | null): string {
  const org = organization?.trim()
  const name = fullName.trim() || 'Unknown'
  return org ? `Training Interest — ${org} — ${name}` : `Training Interest — ${name}`
}

export function formatTrainingInterestClickUpDescription(
  doc: TrainingInterestClickUpFields,
): string {
  const parts = [
    'Shamal Training Platform — Interest Registration',
    '',
    '--- Personal Information ---',
    line('Full Name', doc.fullName),
    line('Mobile / WhatsApp', doc.mobile),
    line('Email', doc.email),
    line('City / Location', doc.city),
    line('Nationality', doc.nationality),
    '',
    '--- Professional Details ---',
    line('Organization', doc.organization),
    line('Job Title', doc.jobTitle),
    line('Registering as', labelFrom(REGISTERING_AS_LABELS, doc.registeringAs)),
    '',
    '--- Training Interest ---',
    line('Previous drone/GIS experience', labelFrom(EXPERIENCE_LABELS, doc.droneExperience)),
    '',
    '--- Purpose of Training ---',
    'Why interested:',
    doc.trainingPurpose?.trim() || '—',
    '',
    'Expected outcomes:',
    doc.expectedOutcomes?.trim() || '—',
    '',
    line('Certificate interest', labelFrom(CERTIFICATE_LABELS, doc.certificateInterest)),
    '',
    '--- Additional ---',
    'Questions / special requirements:',
    doc.additionalInfo?.trim() || '—',
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
