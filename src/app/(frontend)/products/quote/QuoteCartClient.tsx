'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Minus, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { trackPublicEvent } from '@/lib/analytics/client'
import { useLanguage } from '@/providers/Language/LanguageContext'
import { useQuoteCart } from '@/providers/QuoteCart/QuoteCartContext'
import { getCommonTranslations } from '@/lib/translations/common'

const BUDGET_OPTIONS = [
  { value: 'under-100k', labelKey: 'budgetUnder100k' as const },
  { value: '100k-500k', labelKey: 'budget100k500k' as const },
  { value: '500k-1m', labelKey: 'budget500k1m' as const },
  { value: '1m-plus', labelKey: 'budget1mPlus' as const },
  { value: 'unsure', labelKey: 'budgetUnsure' as const },
]

const INDUSTRY_OPTIONS = [
  'construction',
  'mining',
  'oil-gas',
  'telecom',
  'government',
  'agriculture',
  'surveying',
  'other',
] as const

export function QuoteCartClient() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const { items, setQuantity, removeItem, clearCart } = useQuoteCart()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('')
  const [projectLocation, setProjectLocation] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  const [projectRequirement, setProjectRequirement] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submitRfq() {
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch('/api/products/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          name,
          company,
          email,
          phone,
          industry: industry || undefined,
          projectLocation: projectLocation || undefined,
          budgetRange: budgetRange || undefined,
          projectRequirement,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data?.error || t.quoteSubmitFailed)
        setLoading(false)
        return
      }
      trackPublicEvent({
        eventType: 'CONTACT_SUBMITTED',
        pageUrl: '/products/quote',
        metaData: { source: 'product-quote-cart', itemCount: items.length },
      })
      clearCart()
      setSubmitted(true)
      router.push('/products/quote/success')
    } catch {
      setErr(t.quoteSubmitFailed)
      setLoading(false)
    }
  }

  if (submitted) {
    return null
  }

  if (!items.length) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{t.quoteCartEmpty}</CardTitle>
          <CardDescription>{t.quoteCartEmptyDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/products">{t.browseProducts}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl md:text-4xl font-bold text-foreground">
          {t.quoteCartTitle}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t.quoteCartSubtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t.requestedProducts}</CardTitle>
            <CardDescription>{t.requestedProductsHint}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.category && (
                    <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t.decreaseQuantity}
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t.increaseQuantity}
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t.removeFromCart}
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">{t.addMoreProducts}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>{t.yourDetails}</CardTitle>
            <CardDescription>{t.quoteFormHint}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quote-name">{t.name} *</Label>
              <Input id="quote-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-company">{t.company} *</Label>
              <Input
                id="quote-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-email">{t.email} *</Label>
              <Input
                id="quote-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-phone">{t.phoneWhatsApp} *</Label>
              <Input
                id="quote-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t.industry}</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectIndustry} />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t.industries[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-location">{t.projectLocation}</Label>
              <Input
                id="quote-location"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                placeholder={t.projectLocationPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.budgetRange}</Label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectBudget} />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t[opt.labelKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-req">{t.projectRequirement} *</Label>
              <Textarea
                id="quote-req"
                value={projectRequirement}
                onChange={(e) => setProjectRequirement(e.target.value)}
                rows={4}
                required
              />
            </div>
            {err && (
              <Alert variant="destructive">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" size="lg" disabled={loading} onClick={() => void submitRfq()}>
              {loading ? t.submittingQuote : t.submitQuoteRequest}
            </Button>
            <p className="text-xs text-muted-foreground text-center">{t.quoteNoPaymentNote}</p>
          </CardContent>
        </Card>
      </div>

      <ul className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground max-w-3xl mx-auto">
        <li className="flex items-start gap-2">
          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          {t.quoteStepSales}
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          {t.quoteStepProposal}
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          {t.quoteStepPayment}
        </li>
      </ul>
    </div>
  )
}
