import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getRequestLocale } from '../lib/i18n/getRequestLocale'
import { buildLanguageAlternates } from '../lib/seo/alternates'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/media/hero-banners/hero-products.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const locale = await getRequestLocale()

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Shamal Technologies'
    : 'Shamal Technologies'

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const path = !slug || slug === 'home' ? '/' : `/${slug}`

  return {
    description: doc?.meta?.description,
    alternates: buildLanguageAlternates(path, locale),
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
    title,
  }
}
