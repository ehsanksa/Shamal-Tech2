'use client'

import React from 'react'

export default function ManageDomainsLink() {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: '0 0 8px', opacity: 0.8 }}>
        Manage permanent internal domains and external project domains (add, edit, disable, delete)
        from Approved Domains.
      </p>
      <a
        href="/admin/collections/procurement-approved-domains"
        style={{
          display: 'inline-block',
          border: '1px solid var(--theme-elevation-250)',
          background: 'var(--theme-elevation-100)',
          borderRadius: 4,
          padding: '8px 12px',
          textDecoration: 'none',
          color: 'inherit',
          fontWeight: 500,
        }}
      >
        Open Approved Domains
      </a>
      <a
        href="/admin/collections/procurement-audit-logs"
        style={{
          display: 'inline-block',
          marginLeft: 8,
          border: '1px solid var(--theme-elevation-250)',
          background: 'var(--theme-elevation-0)',
          borderRadius: 4,
          padding: '8px 12px',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        View Audit Logs
      </a>
    </div>
  )
}
