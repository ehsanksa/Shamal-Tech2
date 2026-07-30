import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePromoPopup: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating promo-popup-content`)

    revalidateTag('global_promo-popup-content')
    revalidatePath('/', 'layout')
  }

  return doc
}
