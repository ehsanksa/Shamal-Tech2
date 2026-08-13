'use client'

import { useState } from 'react'

type PublicFormHoneypotProps = {
  website: string
  onWebsiteChange: (value: string) => void
}

/**
 * Off-screen field bots fill in ("website"). Do not use display:none / type=hidden —
 * many scripts skip those and still hit the JSON API.
 */
export function PublicFormHoneypot({ website, onWebsiteChange }: PublicFormHoneypotProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
    >
      <label htmlFor="company_website">Website</label>
      <input
        id="company_website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(event) => onWebsiteChange(event.target.value)}
      />
    </div>
  )
}

export function usePublicFormProtection() {
  const [formStartedAt] = useState(() => Date.now())
  const [website, setWebsite] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  return {
    formStartedAt,
    website,
    setWebsite,
    turnstileToken,
    setTurnstileToken,
    protectionPayload: {
      website,
      formStartedAt,
      turnstileToken: turnstileToken || undefined,
    },
  }
}
