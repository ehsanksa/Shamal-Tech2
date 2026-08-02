import type { Metadata } from 'next'

import { getCachedGlobal } from '../../../../utilities/getGlobals'
import {
  PROCUREMENT_FORM_CLOSED_MESSAGE,
  PROCUREMENT_FORM_CLOSED_MESSAGE_AR,
} from '../../../../lib/procurement/constants'
import { ProcurementRequestPageContent } from './ProcurementRequestPageContent'

export const metadata: Metadata = {
  title: 'Procurement Request | طلب مشتريات | Shamal Technologies',
  description:
    'Submit a procurement request to Shamal Technologies. قم بتقديم طلب شراء إلى قسم المشتريات.',
}

export const revalidate = 3600

export default async function ProcurementRequestPage() {
  const formSettings = (await getCachedGlobal('procurement-form-settings', 0)()) as {
    formEnabled?: boolean | null
    closedMessage?: string | null
    closedMessageAr?: string | null
    maxAttachmentSizeMB?: number | null
  }

  return (
    <main>
      <ProcurementRequestPageContent
        formEnabled={formSettings.formEnabled !== false}
        closedMessage={formSettings.closedMessage || PROCUREMENT_FORM_CLOSED_MESSAGE}
        closedMessageAr={formSettings.closedMessageAr || PROCUREMENT_FORM_CLOSED_MESSAGE_AR}
        maxAttachmentSizeMB={formSettings.maxAttachmentSizeMB ?? undefined}
      />
    </main>
  )
}
