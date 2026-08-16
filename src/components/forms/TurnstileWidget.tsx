'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact' | 'flexible'
          appearance?: 'always' | 'execute' | 'interaction-only'
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

const TurnstileSiteKeyContext = createContext('')

export function TurnstileSiteKeyProvider({
  siteKey,
  children,
}: {
  siteKey: string
  children: ReactNode
}) {
  return (
    <TurnstileSiteKeyContext.Provider value={siteKey.trim()}>{children}</TurnstileSiteKeyContext.Provider>
  )
}

export function useTurnstileSiteKey(): string {
  const fromServer = useContext(TurnstileSiteKeyContext)
  if (fromServer) return fromServer
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ''
}

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.turnstile) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Turnstile script failed'))
    document.head.appendChild(script)
  })
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void
  size?: 'normal' | 'compact' | 'flexible'
}

export function TurnstileWidget({ onToken, size = 'normal' }: TurnstileWidgetProps) {
  const siteKey = useTurnstileSiteKey()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    if (!siteKey) return

    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        size,
        appearance: 'always',
        callback: (token) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      })
    }

    void loadTurnstileScript()
      .then(() => {
        if (!cancelled) renderWidget()
      })
      .catch(() => {
        onTokenRef.current('')
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, size])

  if (!siteKey) return null

  return <div ref={containerRef} className="mt-2 flex justify-start overflow-hidden" />
}
