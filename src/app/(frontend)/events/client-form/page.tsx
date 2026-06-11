import type { Metadata } from 'next'

import { EventClientForm } from '../../../../components/EventClientForm'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { ScrollSection } from '../../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../../components/sections/ParallaxElement'
import { getCachedGlobal } from '../../../../utilities/getGlobals'
import { getCachedPublishedServicesSelect } from '../../../../lib/cms/cached-queries'

export const metadata: Metadata = {
  title: 'Event Client Form | Shamal Technologies',
  description:
    'Submit client information collected at events. Client Name, Company, Job Title, Contact Details, Sector, Service, and more.',
}

export const revalidate = 3600

interface PageProps {
  searchParams: Promise<{ event?: string }>
}

export default async function EventClientFormPage({ searchParams }: PageProps) {
  const { event: eventName } = await searchParams

  const [sectorsContent, services] = await Promise.all([
    getCachedGlobal('sectors-content', 0)(),
    getCachedPublishedServicesSelect(),
  ])

  const sectors = (
    (sectorsContent as { sectors?: Array<{ slug?: string; name?: string; nameAr?: string }> })
      .sectors ?? []
  ).filter((s) => s.slug)

  return (
    <main>
      <ScrollSection className="py-20">
        <div className="container mx-auto px-4">
          <ParallaxElement className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Event Client Information</h1>
            <p className="text-2xl font-medium mb-4" dir="rtl" lang="ar">
              معلومات عميل الحدث
            </p> 
          </ParallaxElement>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>
                <span className="block">Visitors form</span>
                <span className="block text-lg font-normal text-muted-foreground" dir="rtl" lang="ar">
                  نموذج تسجيل العملاء
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventClientForm
                sectors={sectors.map((s) => ({
                  slug: s.slug!,
                  name: s.name,
                  nameAr: s.nameAr,
                }))}
                services={services.docs.map((s) => ({
                  id: String(s.id),
                  title: s.title,
                  titleAr: (s as { titleAr?: string }).titleAr,
                }))}
                defaultEventName={eventName ?? ''}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollSection>
    </main>
  )
}
