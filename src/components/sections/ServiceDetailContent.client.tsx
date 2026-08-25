'use client'

import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { ScrollSection } from './ScrollSection'
import { ParallaxElement } from './ParallaxElement'
import { ScrollReveal, StaggerReveal, CinematicReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'
import RichText from '../RichText'

interface ServiceDetailContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any
}

function ServiceDetailContentInner({
  service,
}: {
  service: {
    title?: string
    benefits?: Array<{
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      icon?: { url?: string } | null
    }>
    applications?: Array<{
      title?: string
      titleAr?: string
      description?: string
      descriptionAr?: string
      image?: { url?: string } | null
    }>
    technologies?: Array<{
      name?: string
      nameAr?: string
      description?: string
      descriptionAr?: string
      icon?: { url?: string } | null
    }>
    faqs?: Array<{
      question?: string
      questionAr?: string
      answer?: unknown
      answerAr?: unknown
    }>
    ctaTitle?: string
    ctaTitleAr?: string
    ctaDescription?: string
    ctaDescriptionAr?: string
    ctaButtonText?: string
    ctaButtonTextAr?: string
  }
}) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  return (
    <>
      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <ScrollSection id="benefits" flexible bgVariant="1" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    {language === 'ar' ? 'المزايا' : 'Benefits'}
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">
                      {language === 'ar' ? 'مزايا الخدمة' : 'Service Benefits'}
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    {language === 'ar'
                      ? 'اكتشف مزايا اختيار خدمتنا'
                      : 'Discover the advantages of choosing our service'}
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {service.benefits.map((benefit: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {benefit.icon &&
                          typeof benefit.icon === 'object' &&
                          'url' in benefit.icon && (
                            <div className="relative h-20 w-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={benefit.icon.url as string}
                                alt={getLocalizedValue(benefit.title, benefit.titleAr, language)}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                            {getLocalizedValue(benefit.title, benefit.titleAr, language)}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    {(benefit.description || benefit.descriptionAr) && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {getLocalizedValue(
                            benefit.description,
                            benefit.descriptionAr,
                            language
                          )}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Applications Section */}
      {service.applications && service.applications.length > 0 && (
        <ScrollSection id="applications" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    {language === 'ar' ? 'حالات الاستخدام' : 'Use Cases'}
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">
                      {language === 'ar' ? 'التطبيقات' : 'Applications'}
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    {language === 'ar'
                      ? 'التطبيقات العملية لخدمتنا'
                      : 'Real-world applications of our service'}
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.15} duration={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {service.applications.map((app: any, index: number) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    {app.image &&
                      typeof app.image === 'object' &&
                      'url' in app.image && (
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={app.image.url as string}
                            alt={getLocalizedValue(app.title, app.titleAr, language)}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        </div>
                      )}
                    <CardHeader>
                      <CardTitle className="text-2xl font-display font-bold text-logo-navy">
                        {getLocalizedValue(app.title, app.titleAr, language)}
                      </CardTitle>
                    </CardHeader>
                    {(app.description || app.descriptionAr) && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium leading-relaxed">
                          {getLocalizedValue(
                            app.description,
                            app.descriptionAr,
                            language
                          )}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* Technologies Section */}
      {service.technologies && service.technologies.length > 0 && (
        <ScrollSection id="technologies" fullViewport bgVariant="3" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    {language === 'ar' ? 'التقنية' : 'Technology'}
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">
                      {language === 'ar' ? 'التقنيات المستخدمة' : 'Technologies Used'}
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    {language === 'ar'
                      ? 'أدوات ومنصات حديثة نستخدمها'
                      : 'Cutting-edge tools and platforms we utilize'}
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.6}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {service.technologies.map((tech: any, index: number) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-2xl transition-all duration-300 border-2 border-logo-blue/20 bg-background/95 backdrop-blur-sm group"
                  >
                    <CardHeader>
                      {tech.icon &&
                        typeof tech.icon === 'object' &&
                        'url' in tech.icon && (
                          <div className="relative h-28 w-28 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Image
                              src={tech.icon.url as string}
                              alt={getLocalizedValue(tech.name, tech.nameAr, language)}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      <CardTitle className="text-xl font-display font-bold text-logo-navy">
                        {getLocalizedValue(tech.name, tech.nameAr, language)}
                      </CardTitle>
                    </CardHeader>
                    {(tech.description || tech.descriptionAr) && (
                      <CardContent>
                        <CardDescription className="text-base text-logo-blue font-medium">
                          {getLocalizedValue(
                            tech.description,
                            tech.descriptionAr,
                            language
                          )}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </StaggerReveal>
          </div>
        </ScrollSection>
      )}

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <ScrollSection id="faqs" flexible bgVariant="2" parallax>
          <div className="container mx-auto px-4 w-full">
            <ParallaxElement speed={0.3} direction="up">
              <CinematicReveal delay={0.2} duration={1.2}>
                <div className="text-center mb-16 space-y-6">
                  <Badge
                    variant="outline"
                    className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
                  >
                    {t.faq}
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold tracking-tight">
                    <span className="text-gradient">
                      {language === 'ar'
                        ? 'الأسئلة الشائعة'
                        : 'Frequently Asked Questions'}
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                    {language === 'ar'
                      ? 'أسئلة شائعة حول خدمتنا'
                      : 'Common questions about our service'}
                  </p>
                </div>
              </CinematicReveal>
            </ParallaxElement>
            <ScrollReveal direction="up" delay={0.3} duration={1}>
              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {service.faqs.map((faq: any, index: number) => {
                    const displayQuestion = getLocalizedValue(
                      faq.question,
                      faq.questionAr,
                      language
                    )
                    const answerContent =
                      language === 'ar' && faq.answerAr
                        ? faq.answerAr
                        : faq.answer
                    return (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-2 border-logo-blue/30 px-6 rounded-xl bg-background/95 backdrop-blur-sm"
                      >
                        <AccordionTrigger className="text-left font-display font-bold text-xl text-logo-navy hover:no-underline py-6">
                          {displayQuestion}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose prose-lg max-w-none text-logo-blue font-medium pt-2 pb-4">
                            {answerContent && (
                              <RichText data={answerContent} enableGutter={false} />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            </ScrollReveal>
          </div>
        </ScrollSection>
      )}

      {/* CTA Section */}
      <ScrollSection id="cta" fullViewport bgVariant="gradient" parallax>
        <div className="container mx-auto px-4 w-full">
          <ParallaxElement speed={0.2} direction="up">
            <CinematicReveal delay={0.2} duration={1.2} scale>
              <Card className="max-w-4xl mx-auto border-2 border-white/30 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-6">
                  <Badge
                    variant="outline"
                    className="w-fit mx-auto border-logo-blue/60 text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold shadow-sm"
                  >
                    {t.getStarted}
                  </Badge>
                  <CardTitle className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
                    <span className="text-gradient">
                      {getLocalizedValue(
                        service.ctaTitle || 'Ready to Get Started?',
                        service.ctaTitleAr,
                        language
                      )}
                    </span>
                  </CardTitle>
                  {(service.ctaDescription || service.ctaDescriptionAr) && (
                    <CardDescription className="text-xl md:text-2xl text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
                      {getLocalizedValue(
                        service.ctaDescription,
                        service.ctaDescriptionAr,
                        language
                      )}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90"
                  >
                    <Link href="/contact">
                      {getLocalizedValue(
                        service.ctaButtonText || 'Contact Us Today',
                        service.ctaButtonTextAr,
                        language
                      )}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </CinematicReveal>
          </ParallaxElement>
        </div>
      </ScrollSection>
    </>
  )
}

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  if (!service) return null
  return <ServiceDetailContentInner service={service} />
}
