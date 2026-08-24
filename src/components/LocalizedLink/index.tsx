'use client'

import Link from 'next/link'
import React from 'react'
import type { ComponentProps } from 'react'

import { localizeHref } from '../../lib/i18n/locale'
import { useLanguage } from '../../providers/Language/LanguageContext'

type LocalizedLinkProps = ComponentProps<typeof Link>

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { language } = useLanguage()
  const localizedHref =
    typeof href === 'string'
      ? localizeHref(href, language)
      : href && typeof href === 'object' && 'pathname' in href && typeof href.pathname === 'string'
        ? { ...href, pathname: localizeHref(href.pathname, language) }
        : href

  return <Link href={localizedHref} {...props} />
}
