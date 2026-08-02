import type { Metadata } from 'next'

import { ProcurementRequestForm } from '../../../../components/ProcurementRequestForm'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { ScrollSection } from '../../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../../components/sections/ParallaxElement'
import { getCachedGlobal } from '../../../../utilities/getGlobals'
import {
  PROCUREMENT_FORM_CLOSED_MESSAGE,
  PROCUREMENT_FORM_CLOSED_MESSAGE_AR,
} from '../../../../lib/procurement/constants'

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
      <ScrollSection className="py-20">
        <div className="container mx-auto px-4">
          <ParallaxElement className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Procurement Request</h1>
            <p className="text-2xl font-medium mb-4" dir="rtl" lang="ar">
              طلب مشتريات
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit a procurement request to the Procurement Department.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2" dir="rtl" lang="ar">
              قم بتقديم طلب شراء إلى قسم المشتريات.
            </p>
          </ParallaxElement>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>
                <span className="block">Procurement Form</span>
                <span
                  className="block text-lg font-normal text-muted-foreground"
                  dir="rtl"
                  lang="ar"
                >
                  نموذج طلب المشتريات
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProcurementRequestForm
                formEnabled={formSettings.formEnabled !== false}
                closedMessage={formSettings.closedMessage || PROCUREMENT_FORM_CLOSED_MESSAGE}
                closedMessageAr={
                  formSettings.closedMessageAr || PROCUREMENT_FORM_CLOSED_MESSAGE_AR
                }
                maxAttachmentSizeMB={formSettings.maxAttachmentSizeMB ?? undefined}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollSection>
    </main>
  )
}
