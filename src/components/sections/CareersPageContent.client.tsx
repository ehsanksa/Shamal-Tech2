'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
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
  featuredImage?: { url?: string } | string | null
}

interface CareersPageContentProps {
  careers: Career[]
}

export function CareersPageContent({ careers }: CareersPageContentProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  return (
    <>
      {careers.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>{t.noOpenPositions}</CardTitle>
            <CardDescription>{t.noOpenPositionsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/contact">{t.contactUs}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => {
            const displayTitle = getLocalizedValue(career.title, career.titleAr, language)
            const displayLocation = getLocalizedValue(career.location, career.locationAr, language)
            return (
              <Card
                key={career.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden flex flex-col"
              >
                <Link href={`/careers/${career.slug}`} className="block flex flex-col flex-1">
                  {career.featuredImage &&
                    typeof career.featuredImage === 'object' &&
                    'url' in career.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={career.featuredImage.url as string}
                          alt={displayTitle || 'Career image'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>
                    )}
                  <CardHeader className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {career.department && (
                        <Badge variant="secondary" className="text-xs">
                          {career.department}
                        </Badge>
                      )}
                      {career.employmentType && (
                        <Badge variant="outline" className="text-xs">
                          {career.employmentType}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {displayTitle}
                    </CardTitle>
                    <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                      {displayLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{displayLocation}</span>
                        </div>
                      )}
                      {career.applicationDeadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {t.deadline}:{' '}
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
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary text-sm font-medium">
                      {t.viewDetails}
                      <ArrowRight
                        className={language === 'ar' ? 'mr-2 h-4 w-4 group-hover:-translate-x-1' : 'ml-2 h-4 w-4 group-hover:translate-x-1'}
                      />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      )}

      {/* CTA Section */}
      <section className="mt-16 md:mt-24 py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2">
            <CardHeader className="text-center space-y-4">
              <Badge variant="default" className="w-fit mx-auto">
                {t.joinUs}
              </Badge>
              <CardTitle className="text-4xl md:text-5xl">
                {t.dontSeeRoleFits}
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                {t.dontSeeRoleDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/contact">
                  {t.contactUs}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
