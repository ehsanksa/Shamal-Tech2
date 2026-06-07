'use client'

import dynamic from 'next/dynamic'

export const Chatbot = dynamic(
  () => import('./Chatbot.client').then((mod) => mod.Chatbot),
  { ssr: false, loading: () => null },
)
