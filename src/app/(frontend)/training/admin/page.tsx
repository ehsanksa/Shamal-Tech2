'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useTrainingUser } from '@/hooks/useTrainingUser'

type Overview = {
  rows: Array<{
    studentName: string
    studentEmail: string
    courseSlug: string
    courseTitle: string
    enrollmentStatus: string
    progressPercent: number
    assignmentStatus: string
    assignmentRemarks?: string
    certificateStatus: string
    completionDate?: string | null
  }>
  totalRows: number
}

/**
 * Admin dashboard — enrollment, assignment, progress, and certificate reporting.
 */
export default function TrainingAdminPage() {
  const router = useRouter()
  const { user, loading } = useTrainingUser()
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/training/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    fetch('/api/training/admin/overview', { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 403) {
          setError('Admin only')
          return
        }
        if (!res.ok) {
          setError('Failed to load')
          return
        }
        setData(await res.json())
      })
      .catch(() => setError('Failed to load'))
  }, [user])

  if (loading || !user) {
    return <p className="text-muted-foreground">Loading…</p>
  }
  if (user.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-foreground">You don’t have access to this area.</p>
      </div>
    )
  }
  if (error) {
    return <p className="text-destructive">{error}</p>
  }
  if (!data) {
    return <p className="text-muted-foreground">Loading admin data…</p>
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-foreground">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enrollment report ({data.totalRows} records).
        </p>
      </div>

      <section>
        <h2 className="font-semibold text-foreground">Student training report</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Course</th>
                <th className="px-3 py-2">Enrollment</th>
                <th className="px-3 py-2">Progress</th>
                <th className="px-3 py-2">Assignment</th>
                <th className="px-3 py-2">Certificate</th>
                <th className="px-3 py-2">Completion date</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={`${row.studentEmail}-${row.courseSlug}`} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">{row.studentName}</td>
                  <td className="px-3 py-2">{row.studentEmail}</td>
                  <td className="px-3 py-2">{row.courseTitle}</td>
                  <td className="px-3 py-2 capitalize">{row.enrollmentStatus}</td>
                  <td className="px-3 py-2">{row.progressPercent}%</td>
                  <td className="px-3 py-2 capitalize">
                    {row.assignmentStatus}
                    {row.assignmentRemarks ? ` — ${row.assignmentRemarks}` : ''}
                  </td>
                  <td className="px-3 py-2 capitalize">{row.certificateStatus}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {row.completionDate ? new Date(row.completionDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
