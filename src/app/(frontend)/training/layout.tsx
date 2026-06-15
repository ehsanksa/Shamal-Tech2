import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Training | Shamal Technologies',
  description:
    'Professional drone and UAS training from Shamal Technologies — structured courses, progress tracking, and completion certificates.',
}

/**
 * Layout shell for the /training product surface (content width; main site header from root layout).
 */
export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[75vh] bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">{children}</div>
    </div>
  )
}
