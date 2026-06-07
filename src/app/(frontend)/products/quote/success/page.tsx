import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Quote submitted | Shamal Technologies',
  robots: { index: false, follow: false },
}

export default async function QuoteSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await searchParams
  const ref = params.ref?.trim()

  return (
    <main className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto text-center border-2 border-primary/20">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quote request received</CardTitle>
          {ref ? (
            <p className="text-lg font-semibold text-primary font-mono">{ref}</p>
          ) : null}
          <CardDescription className="text-base">
            Our sales team will review your bundled RFQ and contact you shortly to discuss requirements,
            technical scope, and commercial proposal. Payment is arranged only after proposal approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/products">Back to products</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/contact">Contact us</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
