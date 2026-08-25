'use client'

import React from 'react'

import type { Post } from '../../payload-types'

import { Media } from '../../components/Media'
import { formatDateTime } from '../../utilities/formatDateTime'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../lib/translations/common'
import { getLocalizedValue } from '../../lib/localization'

export const PostHeroClient: React.FC<{
  post: Post
}> = ({ post }) => {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const { author, categories, heroImage, publishedAt, title, titleAr } = post
  const displayTitle = getLocalizedValue(title, titleAr, language)
  const hasAuthor = Boolean(author?.trim())

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle, titleAr: categoryTitleAr } = category as {
                  title?: string
                  titleAr?: string
                }
                const titleToUse =
                  getLocalizedValue(categoryTitle, categoryTitleAr, language) || t.untitledCategory

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{displayTitle}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {hasAuthor && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">{t.author}</p>

                  <p>{author}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">{t.datePublished}</p>

                <time dateTime={publishedAt}>
                  {language === 'ar'
                    ? new Date(publishedAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : formatDateTime(publishedAt)}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
