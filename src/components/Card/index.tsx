'use client'
import { cn } from '../../utilities/ui'
import useClickableCard from '../../utilities/useClickableCard'
import { LocalizedLink as Link } from '../LocalizedLink'
import React, { Fragment } from 'react'

import type { Post } from '../../payload-types'

import { Media } from '../Media'
import { Card as ShadcnCard, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { getCommonTranslations } from '../../lib/translations/common'

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'meta' | 'title' | 'titleAr' | 'description' | 'descriptionAr' | 'featuredImage' | 'heroImage'
>

/** Prefer Featured Image, then hero, then SEO/meta image. */
function getDisplayImage(doc: CardPostData | undefined) {
  if (!doc) return null
  const { meta, featuredImage, heroImage } = doc
  const metaImage = meta && typeof meta === 'object' && 'image' in meta ? meta.image : null

  const candidates = [featuredImage, heroImage, metaImage]
  for (const img of candidates) {
    if (img != null && typeof img === 'object' && 'url' in img && img.url) return img
  }
  return null
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props
  const { language } = useLanguage()
  const t = getCommonTranslations(language)

  const { slug, categories, meta, title, titleAr, description, descriptionAr } = doc || {}
  const metaDesc = meta && typeof meta === 'object' && 'description' in meta ? meta.description : undefined
  const displayImage = getDisplayImage(doc)

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const localizedTitle = getLocalizedValue(title, titleAr, language)
  const titleToUse = titleFromProps || localizedTitle
  const excerpt = getLocalizedValue(description ?? metaDesc, descriptionAr, language)
  const sanitizedDescription = excerpt?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <ShadcnCard
      className={cn('hover:cursor-pointer hover:shadow-lg transition-shadow', className)}
      ref={card.ref as React.Ref<HTMLDivElement>}
    >
      <div className="relative w-full">
        {!displayImage && <div className="h-48 bg-muted flex items-center justify-center">{t.noImage}</div>}
        {displayImage && <Media resource={displayImage} size="33vw" />}
      </div>
      <CardHeader>
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 mb-2">
                {categories?.map((category, index) => {
                  if (typeof category === 'object') {
                    const { title: titleFromCategory, titleAr: titleArFromCategory } = category as { title?: string; titleAr?: string }
                    const categoryTitle = getLocalizedValue(titleFromCategory, titleArFromCategory, language) || t.untitledCategory
                    return (
                  <Badge key={index} variant="secondary" className="uppercase text-xs">
                        {categoryTitle}
                  </Badge>
                    )
                  }
                  return null
                })}
          </div>
        )}
        {titleToUse && (
          <CardTitle>
            <Link className="hover:underline" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
          </CardTitle>
        )}
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription>{sanitizedDescription}</CardDescription>
        </CardContent>
      )}
    </ShadcnCard>
  )
}
