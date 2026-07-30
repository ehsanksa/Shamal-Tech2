'use client'

import dynamic from 'next/dynamic'

import type { PromoPopupData } from './types'

const PromoPopupClient = dynamic(
  () => import('./PromoPopup.client').then((mod) => mod.PromoPopupClient),
  { ssr: false, loading: () => null },
)

export function PromoPopupDynamic({ data }: { data: PromoPopupData }) {
  return <PromoPopupClient data={data} />
}
