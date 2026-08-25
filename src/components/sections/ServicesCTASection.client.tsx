'use client'

import { LocalizedLink as Link } from '../LocalizedLink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'

export function ServicesCTASection() {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  return (
    <div className="container mx-auto px-4 w-full">
      <ParallaxElement speed={0.2} direction="up">
        <CinematicReveal delay={0.2} duration={1.2} scale>
          <Card className="max-w-4xl mx-auto border-2 border-white/30 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6">
              <Badge
                variant="outline"
                className="w-fit mx-auto border-logo-blue/60 text-logo-blue bg-white/90 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold shadow-md"
              >
                {t.getStarted}
              </Badge>
              <CardTitle className="text-display-large font-display font-bold text-foreground">
                <span className="text-gradient">{t.readyToTransform}</span>
              </CardTitle>
              <CardDescription className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                {t.contactTodayDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                size="lg"
                className="text-base px-8 h-14 bg-logo-blue hover:bg-logo-blue/90"
              >
                <Link href="/contact">
                  {t.contactUs}
                  <ArrowRight className={language === 'ar' ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </CinematicReveal>
      </ParallaxElement>
    </div>
  )
}
