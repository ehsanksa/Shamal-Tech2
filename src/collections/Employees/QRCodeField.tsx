'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

const QRCodeField: React.FC = () => {
  const { value: slug, setValue: setSlug } = useField<string>({ path: 'slug' })
  const slugValue = slug?.trim() || ''

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const profileUrl = slugValue ? `${baseUrl}/profile/${slugValue}` : ''
  const qrUrl = slugValue ? `${baseUrl}/api/qr?slug=${encodeURIComponent(slugValue)}` : ''

  return (
    <div className="payload-field-type space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">
          Profile Slug (editable)
        </label>
        <input
          type="text"
          value={slugValue}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. dr-hesham-malak-12694035"
          className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Change this to set the exact profile URL, then click Save.
        </p>
      </div>

      {slugValue ? (
        <>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Profile URL (for QR code)
            </label>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">{profileUrl}</code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(profileUrl)}
                className="text-xs px-2 py-1 border rounded hover:bg-muted"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              QR Code (for printing)
            </label>
            <img
              src={qrUrl}
              alt={`QR code for ${slugValue}`}
              className="w-48 h-48 border rounded-lg bg-white p-2"
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Enter a slug above or save once to auto-generate the profile URL and QR code.
        </p>
      )}
    </div>
  )
}

export default QRCodeField
