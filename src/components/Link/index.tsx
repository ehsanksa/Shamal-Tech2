'use client'

import { Button, type ButtonProps } from '../ui/button'
import { cn } from '../../utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '../../payload-types'
import { useLanguage } from '../../providers/Language/LanguageContext'
import { getLocalizedValue } from '../../lib/localization'
import { localizeHref } from '../../lib/i18n/locale'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  labelAr?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    labelAr,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const { language } = useLanguage()
  const localizedLabel = getLocalizedValue(label ?? '', labelAr ?? '', language)
  const displayLabel = localizedLabel === 'Posts' ? 'Blogs' : localizedLabel

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo === 'posts' ? 'blog' : reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const localizedHref = localizeHref(href, language)
  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={localizedHref || url || ''} {...newTabProps}>
        {displayLabel && displayLabel}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={localizedHref || url || ''} {...newTabProps}>
        {displayLabel && displayLabel}
        {children && children}
      </Link>
    </Button>
  )
}
