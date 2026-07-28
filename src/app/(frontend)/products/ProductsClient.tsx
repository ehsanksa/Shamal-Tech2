'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../providers/Language/LanguageContext'
import { getCommonTranslations } from '../../../lib/translations/common'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { ArrowRight, Check, ClipboardList, Plus } from 'lucide-react'
import { cn } from '../../../utilities/ui'
import { trackPublicEvent } from '@/lib/analytics/client'
import { QuoteCartBar } from '@/components/products/QuoteCartBar'
import { useQuoteCart } from '@/providers/QuoteCart/QuoteCartContext'

type ProductCategory = 'drones' | 'payloads' | 'other'

type Product = {
  id: string
  name: string
  category?: ProductCategory
  categoryTag?: string | null
  description?: string | any | null
  images?: Array<{ url?: string | null } | string | null> | null
  keyFeatures?: Array<{ feature?: string | null }> | null
  price?: number | null
  ctaText?: string | null
}

function formatProductPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

type ProductsByCategory = {
  drones: Product[]
  payloads: Product[]
  other: Product[]
}

interface ProductsClientProps {
  productsByCategory: ProductsByCategory
  allProducts: Product[]
}

export function ProductsClient({ productsByCategory }: ProductsClientProps) {
  const { language } = useLanguage()
  const t = getCommonTranslations(language)
  const { addItem, hasProduct } = useQuoteCart()
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('drones')
  const [addedFlash, setAddedFlash] = useState<string | null>(null)
  const viewedProducts = useRef(new Set<string>())

  const activeProducts = productsByCategory[activeCategory]

  useEffect(() => {
    for (const product of activeProducts) {
      if (viewedProducts.current.has(product.id)) continue
      viewedProducts.current.add(product.id)
      trackPublicEvent({
        eventType: 'PRODUCT_VIEW',
        pageUrl: '/products',
        productId: product.id,
      })
    }
  }, [activeProducts])

  useEffect(() => {
    if (!addedFlash) return
    const tmr = window.setTimeout(() => setAddedFlash(null), 2000)
    return () => clearTimeout(tmr)
  }, [addedFlash])

  const categories = [
    { id: 'drones' as const, label: t.drones, count: productsByCategory.drones.length },
    { id: 'payloads' as const, label: t.payloads, count: productsByCategory.payloads.length },
    { id: 'other' as const, label: t.other, count: productsByCategory.other.length },
  ]

  const extractTextFromRichText = (richText: any): string => {
    if (typeof richText === 'string') {
      return richText
    }
    if (richText && typeof richText === 'object') {
      if (richText.root?.children) {
        return richText.root.children
          .map((child: any) => {
            if (child.children) {
              return child.children
                .map((textNode: any) => textNode.text || '')
                .join('')
            }
            return ''
          })
          .join(' ')
      }
    }
    return t.noDescriptionAvailable
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const imageUrl =
      product.images &&
      Array.isArray(product.images) &&
      product.images[0] &&
      typeof product.images[0] === 'object' &&
      'url' in product.images[0]
        ? (product.images[0].url as string)
        : null

    const inCart = hasProduct(product.id)
    const justAdded = addedFlash === product.id

    function handleAddToQuote() {
      addItem({
        productId: product.id,
        name: product.name,
        category: product.category,
        quantity: 1,
      })
      setAddedFlash(product.id)
      trackPublicEvent({
        eventType: 'ADD_TO_CART',
        pageUrl: '/products',
        productId: product.id,
        metaData: { intent: 'quote_cart' },
      })
    }

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden flex flex-col">
        {imageUrl && (
          <div className="relative h-64 overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        <CardHeader className="flex-1">
          {product.categoryTag && (
            <Badge variant="secondary" className="w-fit mb-2">
              {product.categoryTag}
            </Badge>
          )}
          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          {product.description && (
            <CardDescription className="line-clamp-3 mt-2">
              {extractTextFromRichText(product.description)}
            </CardDescription>
          )}
          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">{t.keyFeatures}</h4>
              <ul className="space-y-1.5">
                {product.keyFeatures.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature.feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {typeof product.price === 'number' && product.price > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.startingFrom}
              </p>
              <p
                className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground"
                aria-label={`${t.startingFrom} ${formatProductPrice(product.price, language)}`}
              >
                {formatProductPrice(product.price, language)}
              </p>
            </div>
          )}
          <Button
            className="w-full"
            variant={inCart ? 'secondary' : 'default'}
            onClick={handleAddToQuote}
          >
            {justAdded ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t.addedToQuote}
              </>
            ) : inCart ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {t.addAnotherToQuote}
              </>
            ) : (
              <>
                <ClipboardList className="mr-2 h-4 w-4" />
                {t.addToQuote}
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/products/quote">
              {t.viewQuoteCart}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-wrap justify-center gap-4 border-b border-border pb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              'px-6 py-3 text-base font-medium transition-all duration-200 relative',
              'hover:text-primary',
              activeCategory === category.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground',
            )}
          >
            {category.label}
            {category.count > 0 && (
              <span className="ml-2 text-xs opacity-70">({category.count})</span>
            )}
          </button>
        ))}
      </div>

      {activeProducts.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>{t.noProductsAvailable}</CardTitle>
            <CardDescription>{t.noProductsDescription}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <QuoteCartBar />
    </div>
  )
}
