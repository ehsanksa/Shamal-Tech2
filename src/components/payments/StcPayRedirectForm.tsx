'use client'

import { useEffect, useRef } from 'react'

type Props = {
  action: string
  fields: Record<string, string>
}

/** Auto-submit POST form to STC Pay / Amazon Payment Services hosted checkout. */
export function StcPayRedirectForm({ action, fields }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formRef.current?.submit()
  }, [])

  return (
    <form ref={formRef} method="post" action={action} className="sr-only" aria-hidden>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </form>
  )
}
