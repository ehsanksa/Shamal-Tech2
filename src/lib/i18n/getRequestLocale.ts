import { headers } from 'next/headers'

import { DEFAULT_LOCALE, isLocale, parseLocalePath, type Locale } from './locale'

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers()
  const fromHeader = headerStore.get('x-locale')
  if (isLocale(fromHeader)) return fromHeader

  const pathname = headerStore.get('x-pathname') || headerStore.get('x-internal-pathname') || '/'
  return parseLocalePath(pathname).locale
}

export async function getRequestPathname(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get('x-pathname') || headerStore.get('x-internal-pathname') || '/'
}

export async function getRequestInternalPathname(): Promise<string> {
  const headerStore = await headers()
  const internal = headerStore.get('x-internal-pathname')
  if (internal) return internal
  const original = headerStore.get('x-pathname') || '/'
  return parseLocalePath(original).pathname
}

export async function getRequestLocaleOrDefault(): Promise<Locale> {
  try {
    return await getRequestLocale()
  } catch {
    return DEFAULT_LOCALE
  }
}
