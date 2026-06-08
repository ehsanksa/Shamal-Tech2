'use client'

import dynamic from 'next/dynamic'
import type { PayloadAdminBarProps } from '@payloadcms/admin-bar'

const AdminBarLazy = dynamic(
  () => import('./index').then((mod) => mod.AdminBar),
  { ssr: false, loading: () => null },
)

export function AdminBar({ adminBarProps }: { adminBarProps?: PayloadAdminBarProps }) {
  return <AdminBarLazy adminBarProps={adminBarProps} />
}
