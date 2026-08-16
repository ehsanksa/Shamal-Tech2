'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { DRONE_COMPANY_FAQS } from '../../lib/seo/structuredData'

export function HomeSeoIntro() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language).seoIntro
  const isRtl = language === 'ar'

  return (
    <section
      id="drone-company"
      className="relative py-16 md:py-24 bg-background"
      aria-labelledby="drone-company-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge
            variant="outline"
            className="border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
          >
            {t.badge}
          </Badge>
          <h2
            id="drone-company-heading"
            className="text-display-large font-display font-bold tracking-tight text-foreground"
          >
            <span className="text-gradient">{t.heading}</span>
          </h2>
          <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium leading-relaxed">
            {t.body}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild className="min-h-11">
              <Link href="/products">
                {t.productsCta}
                <ArrowRight className={isRtl ? 'mr-2 h-4 w-4 rotate-180' : 'ml-2 h-4 w-4'} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/services">{t.servicesCta}</Link>
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-14 space-y-4">
          <h3 className="text-xl md:text-2xl font-display font-bold text-logo-navy text-center mb-8">
            {t.faqHeading}
          </h3>
          <dl className="space-y-4">
            {DRONE_COMPANY_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="border-2 border-logo-blue/30 px-6 py-5 rounded-xl bg-background/95"
              >
                <dt className="font-display font-bold text-lg text-logo-navy">
                  {language === 'ar' ? faq.questionAr : faq.question}
                </dt>
                <dd className="mt-2 text-logo-navy/90 font-medium leading-relaxed">
                  {language === 'ar' ? faq.answerAr : faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
