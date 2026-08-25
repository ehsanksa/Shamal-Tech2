'use client'

import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MapPin, Calendar, Mail, ExternalLink, CheckCircle2 } from 'lucide-react'
import RichText from '../RichText'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue, translateUiString } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'

type Career = {
  id: string
  title?: string | null
  titleAr?: string | null
  slug?: string | null
  department?: string | null
  employmentType?: string | null
  location?: string | null
  locationAr?: string | null
  applicationDeadline?: string | null
  description?: any
  descriptionAr?: any
  responsibilities?: Array<{ responsibility?: string; responsibilityAr?: string }>
  qualifications?: Array<{ qualification?: string; qualificationAr?: string }>
  requirements?: Array<{ requirement?: string; requirementAr?: string }>
  salaryRange?: string | null
  applicationEmail?: string | null
  applicationUrl?: string | null
  featuredImage?: { url?: string } | string | null
}

interface CareerDetailContentProps {
  career: Career
}

export function CareerDetailContent({ career }: CareerDetailContentProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayTitle = getLocalizedValue(career.title, career.titleAr, language)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        {career.featuredImage &&
          typeof career.featuredImage === 'object' &&
          'url' in career.featuredImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={career.featuredImage.url as string}
                alt={displayTitle || 'Career image'}
                fill
                className="object-cover opacity-30"
                priority
              />
            </div>
          )}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {career.department && (
              <Badge variant="secondary" className="text-sm">
                {translateUiString(career.department, language)}
              </Badge>
            )}
            {career.employmentType && (
              <Badge variant="outline" className="text-sm">
                {translateUiString(career.employmentType, language)}
              </Badge>
            )}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{displayTitle}</h1>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {career.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{getLocalizedValue(career.location, career.locationAr, language)}</span>
              </div>
            )}
            {career.applicationDeadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {t.applyBy}:{' '}
                  {new Date(career.applicationDeadline as string).toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Job Details Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {career.description && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{t.jobDescription}</h2>
                    <div className="prose prose-lg max-w-none">
                      {language === 'ar' && career.descriptionAr ? (
                        typeof career.descriptionAr === 'object' && 'root' in career.descriptionAr ? (
                          <RichText data={career.descriptionAr} enableProse={true} enableGutter={false} />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: career.descriptionAr as string }} />
                        )
                      ) : typeof career.description === 'object' && 'root' in career.description ? (
                        <RichText data={career.description} enableProse={true} enableGutter={false} />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: career.description as string }} />
                      )}
                    </div>
                  </div>
                )}

                {career.responsibilities && career.responsibilities.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{t.keyResponsibilities}</h2>
                    <ul className="space-y-3">
                      {career.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {getLocalizedValue(item.responsibility, item.responsibilityAr, language)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {career.qualifications && career.qualifications.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{t.requiredQualifications}</h2>
                    <ul className="space-y-3">
                      {career.qualifications.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {getLocalizedValue(item.qualification, item.qualificationAr, language)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {career.requirements && career.requirements.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{t.requirements}</h2>
                    <ul className="space-y-3">
                      {career.requirements.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {getLocalizedValue(item.requirement, (item as { requirementAr?: string }).requirementAr, language)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{t.applyNow}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {career.salaryRange && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{t.salaryRange}</p>
                        <p className="font-semibold">{career.salaryRange}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t.employmentType}</p>
                      <p className="font-semibold capitalize">{career.employmentType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t.location}</p>
                      <p className="font-semibold">
                        {getLocalizedValue(career.location, career.locationAr, language) || 'N/A'}
                      </p>
                    </div>
                    {career.applicationUrl ? (
                      <Button asChild className="w-full" size="lg">
                        <Link href={career.applicationUrl} target="_blank" rel="noopener noreferrer">
                          {t.applyOnline}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : career.applicationEmail ? (
                      <Button asChild className="w-full" size="lg">
                        <Link href={`mailto:${career.applicationEmail}?subject=Application for ${displayTitle}`}>
                          {t.applyViaEmail}
                          <Mail className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/careers">{t.viewAllPositions}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex space-x-2 text-sm">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              {t.nav.home}
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/careers" className="text-blue-600 hover:underline">
              {t.nav.careers}
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">{displayTitle}</li>
        </ol>
      </nav>
    </main>
  )
}
