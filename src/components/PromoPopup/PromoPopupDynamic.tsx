'use client'

import dynamic from 'next/dynamic'

export const PromoPopup = dynamic(
  () => import('./PromoPopup.client').then((mod) => mod.PromoPopup),
  { ssr: false, loading: () => null },
)
