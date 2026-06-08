import { getCachedGlobal } from '../../utilities/getGlobals'
import { safePayloadFindCached } from '../../utilities/safePayloadQuery'

export const CMS_REVALIDATE_SECONDS = 3600

/** Site-wide settings — depth 1 is enough for contact info, logo, social links. */
export function getCachedSiteSettings() {
  return getCachedGlobal('site-settings', 1)()
}

/** Footer nav links (6 services, minimal fields). */
export function getCachedFooterServices() {
  return safePayloadFindCached({
    cacheKeyParts: ['layout', 'footer-services', 'limit:6', 'sort:order'],
    tags: ['collection_services'],
    revalidate: CMS_REVALIDATE_SECONDS,
    options: {
      collection: 'services',
      limit: 6,
      where: { _status: { equals: 'published' } },
      sort: 'order',
      depth: 0,
      draft: false,
      overrideAccess: false,
      select: { id: true, title: true, titleAr: true, slug: true },
    },
  })
}

/** Published services for forms and pickers (title/slug only). */
export function getCachedPublishedServicesSelect() {
  return safePayloadFindCached({
    cacheKeyParts: ['published-services', 'select', 'limit:50', 'sort:order'],
    tags: ['collection_services'],
    revalidate: CMS_REVALIDATE_SECONDS,
    options: {
      collection: 'services',
      limit: 50,
      where: { _status: { equals: 'published' } },
      sort: 'order',
      depth: 0,
      draft: false,
      overrideAccess: false,
      select: { id: true, title: true, titleAr: true, slug: true },
    },
  })
}

/** Published services for listing pages (carousel, showcase). */
export function getCachedPublishedServicesList(depth = 1) {
  return safePayloadFindCached({
    cacheKeyParts: ['published-services', 'list', 'limit:50', `depth:${depth}`],
    tags: ['collection_services'],
    revalidate: CMS_REVALIDATE_SECONDS,
    options: {
      collection: 'services',
      limit: 50,
      where: { _status: { equals: 'published' } },
      sort: 'order',
      depth,
      draft: false,
      overrideAccess: false,
    },
  })
}

/** Published products for the products listing page. */
export function getCachedPublishedProducts() {
  return safePayloadFindCached({
    cacheKeyParts: ['published-products', 'limit:100', 'depth:1'],
    tags: ['collection_products', 'products-sitemap'],
    revalidate: CMS_REVALIDATE_SECONDS,
    options: {
      collection: 'products',
      limit: 100,
      where: { _status: { equals: 'published' } },
      sort: '-featured',
      depth: 1,
      draft: false,
      overrideAccess: false,
    },
  })
}
