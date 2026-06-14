import type { Metadata } from 'next'
import Image from 'next/image'

import { EventClientForm } from '../../../../components/EventClientForm'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { ScrollSection } from '../../../../components/sections/ScrollSection'
import { ParallaxElement } from '../../../../components/sections/ParallaxElement'
import { getCachedGlobal } from '../../../../utilities/getGlobals'
import { getCachedPublishedServicesSelect } from '../../../../lib/cms/cached-queries'
import { getMediaUrl } from '../../../../utilities/getMediaUrl'

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

  const [sectorsContent, services, formSettings] = await Promise.all([
    getCachedGlobal('sectors-content', 0)(),
    getCachedPublishedServicesSelect(),
    getCachedGlobal('visitors-form-settings', 1)(),
  ])

  const settings = formSettings as {
    collectionEnabled?: boolean | null
    closedMessage?: string | null
    closedMessageAr?: string | null
    eventImage?: { url?: string | null; alt?: string | null; updatedAt?: string | null } | string | null
    eventImageAlt?: string | null
    eventImageAltAr?: string | null
  }

  const eventImageMedia =
    settings.eventImage && typeof settings.eventImage === 'object' ? settings.eventImage : null
  const eventImageSrc = eventImageMedia?.url
    ? getMediaUrl(eventImageMedia.url, eventImageMedia.updatedAt)
    : null
  const eventImageAlt =
    settings.eventImageAlt ||
    eventImageMedia?.alt ||
    'Ongoing event'

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

          {eventImageSrc && (
            <div className="max-w-4xl mx-auto mb-8 flex justify-center">
              <div className="flex h-[150px] max-w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 px-6 py-2 shadow-sm">
                <Image
                  src={eventImageSrc}
                  alt={eventImageAlt}
                  width={400}
                  height={150}
                  className="h-[150px] w-auto max-w-full object-contain"
                  priority
                  sizes="(max-width: 768px) 80vw, 400px"
                />
              </div>
            </div>
          )}

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
                collectionEnabled={settings.collectionEnabled !== false}
                closedMessage={settings.closedMessage ?? undefined}
                closedMessageAr={settings.closedMessageAr ?? undefined}
              />
            </CardContent>
          </Card>
        </div>
      </ScrollSection>
    </main>
  )
}
