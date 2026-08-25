'use client'

import Image from 'next/image'
import { LocalizedLink as Link } from '../LocalizedLink'
import { ArrowRight } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ParallaxElement } from './ParallaxElement'
import { CinematicReveal, StaggerReveal, ScrollReveal } from '../../utilities/animations'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'

interface BlogPreviewSectionProps {
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  ctaText?: string
  ctaTextAr?: string
  blogPosts: Array<{
    id?: string
    slug?: string
    title?: string
    titleAr?: string
    description?: string
    descriptionAr?: string
    date?: string
    featuredImage?: { url?: string; alt?: string } | null
    customImage?: { url?: string; alt?: string } | null
  }>
  backgroundImage?: { url?: string; alt?: string } | null
}

export function BlogPreviewSection({
  title = 'Latest Insights',
  titleAr,
  description,
  descriptionAr,
  ctaText = 'Read All Posts',
  ctaTextAr,
  blogPosts,
  backgroundImage,
}: BlogPreviewSectionProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const displayDescription = getLocalizedValue(description, descriptionAr, language)
  const displayCtaText = getLocalizedValue(ctaText, ctaTextAr, language)

  return (
    <>
      {/* Background Image */}
      {backgroundImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'Blog preview background'}
            fill
            className="object-cover opacity-20"
            priority={false}
            quality={85}
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <ParallaxElement speed={0.3} direction="up">
          <CinematicReveal delay={0.2} duration={1.2}>
            <div className="text-center mb-16 space-y-6">
              <Badge
                variant="outline"
                className="mb-6 border-logo-blue text-logo-blue bg-logo-blue/10 px-4 py-1.5 text-sm font-semibold"
              >
                {t.insights}
              </Badge>
              <h2 className="text-display-large font-display font-bold tracking-tight text-foreground">
                <span className="text-gradient">{displayTitle}</span>
              </h2>
              {displayDescription && (
                <p className="text-body-large text-logo-navy max-w-3xl mx-auto font-medium">
                  {displayDescription}
                </p>
              )}
            </div>
          </CinematicReveal>
        </ParallaxElement>
        <StaggerReveal direction="up" delay={0.3} stagger={0.1} duration={0.8}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post: any, index: number) => {
              const displayImage =
                post.customImage &&
                typeof post.customImage === 'object' &&
                'url' in post.customImage
                  ? post.customImage
                  : post.featuredImage &&
                      typeof post.featuredImage === 'object' &&
                      'url' in post.featuredImage
                    ? post.featuredImage
                    : null
              const postTitle = getLocalizedValue(
                post.title,
                post.titleAr,
                language
              )
              const postDescription = getLocalizedValue(
                post.description,
                post.descriptionAr,
                language
              )

              return (
                <Card
                  key={post.id || index}
                  className="group hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <Link href={`/posts/${post.slug}`} className="block">
                    {displayImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={displayImage.url as string}
                          alt={postTitle || 'Blog post'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardHeader>
                      {post.date && (
                        <CardDescription>
                          {new Date(post.date as string).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </CardDescription>
                      )}
                      <CardTitle className="text-xl group-hover:text-logo-blue transition-colors line-clamp-2">
                        {postTitle}
                      </CardTitle>
                    </CardHeader>
                    {postDescription && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {postDescription}
                        </p>
                      </CardContent>
                    )}
                  </Link>
                </Card>
              )
            })}
          </div>
        </StaggerReveal>
        <ScrollReveal direction="up" delay={0.4} duration={1}>
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-logo-navy text-logo-navy hover:bg-logo-navy hover:text-white"
            >
              <Link href="/posts">
                {displayCtaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </>
  )
}
