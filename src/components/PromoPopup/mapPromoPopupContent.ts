import type { Media, PromoPopupContent } from '../../payload-types'
import { getMediaUrl } from '../../utilities/getMediaUrl'
import {
  DEFAULT_PROMO_POPUP,
  type PromoPopupData,
  type PromoPopupSectionData,
} from './types'

type CmsSection = NonNullable<PromoPopupContent['academy']>

function resolveMediaUrl(image: string | Media | null | undefined, fallback: string): string {
  if (!image) return fallback
  if (typeof image === 'string') return fallback

  const raw = image.url
  if (!raw) return fallback

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return getMediaUrl(raw, image.updatedAt)
  }

  return raw.startsWith('/') ? raw : `/${raw}`
}

function mapSection(
  id: 'academy' | 'products',
  cms: CmsSection | null | undefined,
  fallback: PromoPopupSectionData,
): PromoPopupSectionData {
  const mediaAlt =
    typeof cms?.image === 'object' && cms.image !== null && 'alt' in cms.image
      ? cms.image.alt || undefined
      : undefined

  return {
    id,
    badge: cms?.badge?.trim() || fallback.badge,
    title: cms?.title?.trim() || fallback.title,
    subtitle: cms?.subtitle?.trim() || fallback.subtitle,
    imageSrc: resolveMediaUrl(cms?.image, fallback.imageSrc),
    imageAlt: cms?.imageAlt?.trim() || mediaAlt || fallback.imageAlt,
    imageFit: cms?.imageFit === 'contain' || cms?.imageFit === 'cover' ? cms.imageFit : fallback.imageFit,
    ctaLabel: cms?.ctaLabel?.trim() || fallback.ctaLabel,
    ctaHref: cms?.ctaHref?.trim() || fallback.ctaHref,
  }
}

export function mapPromoPopupContent(doc: PromoPopupContent | null | undefined): PromoPopupData {
  const [academyFallback, productsFallback] = DEFAULT_PROMO_POPUP.sections

  return {
    enabled: doc?.enabled !== false,
    showIntervalDays:
      typeof doc?.showIntervalDays === 'number' && doc.showIntervalDays > 0
        ? doc.showIntervalDays
        : DEFAULT_PROMO_POPUP.showIntervalDays,
    openDelayMs:
      typeof doc?.openDelayMs === 'number' && doc.openDelayMs >= 0
        ? doc.openDelayMs
        : DEFAULT_PROMO_POPUP.openDelayMs,
    sections: [
      mapSection('academy', doc?.academy, academyFallback),
      mapSection('products', doc?.products, productsFallback),
    ],
  }
}
