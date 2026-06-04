'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  QUOTE_CART_STORAGE_KEY,
  type QuoteLineItem,
  parseQuoteCartFromStorage,
} from '@/lib/products/quote-cart'

type QuoteCartContextValue = {
  items: QuoteLineItem[]
  itemCount: number
  addItem: (item: Omit<QuoteLineItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  hasProduct: (productId: string) => boolean
}

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null)

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteLineItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(parseQuoteCartFromStorage(localStorage.getItem(QUOTE_CART_STORAGE_KEY)))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(QUOTE_CART_STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback(
    (item: Omit<QuoteLineItem, 'quantity'> & { quantity?: number }) => {
      const qty = item.quantity ?? 1
      setItems((prev) => {
        const existing = prev.find((p) => p.productId === item.productId)
        if (existing) {
          return prev.map((p) =>
            p.productId === item.productId ? { ...p, quantity: p.quantity + qty } : p,
          )
        }
        return [...prev, { ...item, quantity: qty }]
      })
    },
    [],
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((p) => p.productId !== productId))
      return
    }
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity } : p)))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const hasProduct = useCallback(
    (productId: string) => items.some((p) => p.productId === productId),
    [items],
  )

  const value = useMemo<QuoteCartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      hasProduct,
    }),
    [items, addItem, removeItem, setQuantity, clearCart, hasProduct],
  )

  return <QuoteCartContext.Provider value={value}>{children}</QuoteCartContext.Provider>
}

export function useQuoteCart(): QuoteCartContextValue {
  const ctx = useContext(QuoteCartContext)
  if (!ctx) {
    throw new Error('useQuoteCart must be used within QuoteCartProvider')
  }
  return ctx
}
