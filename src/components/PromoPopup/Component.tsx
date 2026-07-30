import type { PromoPopupContent } from '../../payload-types'
import { getCachedGlobal } from '../../utilities/getGlobals'
import { mapPromoPopupContent } from './mapPromoPopupContent'
import { PromoPopupDynamic } from './PromoPopupDynamic'

/**
 * Server wrapper — loads Promo Popup content from Payload CMS.
 */
export async function PromoPopup() {
  let data
  try {
    const doc = (await getCachedGlobal('promo-popup-content', 1)()) as PromoPopupContent
    data = mapPromoPopupContent(doc)
  } catch {
    data = mapPromoPopupContent(null)
  }

  if (!data.enabled) return null

  return <PromoPopupDynamic data={data} />
}
