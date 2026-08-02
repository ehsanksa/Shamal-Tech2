'use client'

import { ProcurementRequestForm } from '../../../../components/ProcurementRequestForm'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { ScrollSection } from '../../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../../components/sections/ParallaxElement'
import { useLanguage } from '../../../../providers/Language/LanguageContext'
import {
  getProcurementFormTranslations,
  type ProcurementFormLanguage,
} from '../../../../lib/translations/procurementForm'

type Props = {
  formEnabled: boolean
  closedMessage?: string
  closedMessageAr?: string
  maxAttachmentSizeMB?: number
}

export function ProcurementRequestPageContent({
  formEnabled,
  closedMessage,
  closedMessageAr,
  maxAttachmentSizeMB,
}: Props) {
  const { language } = useLanguage()
  const isAr = language === 'ar'
  const t = getProcurementFormTranslations(language as ProcurementFormLanguage)

  return (
    <ScrollSection className="py-20">
      <div className="container mx-auto px-4" dir={isAr ? 'rtl' : 'ltr'} lang={language}>
        <ParallaxElement className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{t.pageTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.pageDescription}</p>
        </ParallaxElement>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t.formTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProcurementRequestForm
              formEnabled={formEnabled}
              closedMessage={closedMessage}
              closedMessageAr={closedMessageAr}
              maxAttachmentSizeMB={maxAttachmentSizeMB}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollSection>
  )
}
