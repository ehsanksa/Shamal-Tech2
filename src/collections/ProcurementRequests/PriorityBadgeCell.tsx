'use client'

import React from 'react'

import {
  PROCUREMENT_PRIORITY_COLORS,
  type ProcurementPriority,
} from '../../lib/procurement/constants'

type Props = {
  cellData?: string | null
}

export default function PriorityBadgeCell({ cellData }: Props) {
  const key = (cellData || 'medium') as ProcurementPriority
  const colors = PROCUREMENT_PRIORITY_COLORS[key] || PROCUREMENT_PRIORITY_COLORS.medium

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
      }}
    >
      {colors.label}
    </span>
  )
}
