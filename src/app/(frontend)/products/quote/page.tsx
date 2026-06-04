import type { Metadata } from 'next'

import { QuoteCartClient } from './QuoteCartClient'

export const metadata: Metadata = {
  title: 'Quote Cart | Products | Shamal Technologies',
  description: 'Submit a bundled request for pricing on enterprise drone and geospatial products.',
  robots: { index: false, follow: false },
}

export default function ProductQuoteCartPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <QuoteCartClient />
    </main>
  )
}
