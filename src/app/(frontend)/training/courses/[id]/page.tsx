'use client'

import React, { Suspense } from 'react'

import { TrainingCourseClient } from '@/components/training/TrainingCourseClient'

export default function TrainingCoursePage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading course…</p>}>
      <TrainingCourseClient />
    </Suspense>
  )
}
