'use client'

import Image from 'next/image'
import { cn } from '../../utilities/ui'
import type { CompanyProfileOrgChart } from '../../lib/company-profile/slides'

type CompanyProfileOrgChartProps = {
  chart: CompanyProfileOrgChart
  className?: string
}

type OrgMember = CompanyProfileOrgChart['executives'][number]

const TILE_WIDTH = 'w-[132px] sm:w-[148px]'
const EXEC_GAP = 'gap-6 sm:gap-10'
const MGR_GAP = 'gap-3 sm:gap-5'
/** Width spanning both executive tiles + gap (for top horizontal connector). */
const EXEC_SPAN = 'w-[calc(132px*2+1.5rem)] sm:w-[calc(148px*2+2.5rem)]'
const MGR_SPAN = 'w-[calc(132px*3+0.75rem*2)] sm:w-[calc(148px*3+1.25rem*2)]'

function OrgTile({ member }: { member: OrgMember }) {
  const initials = member.name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn(
        'org-tile shrink-0 overflow-hidden rounded-lg border border-white/25 bg-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.25)]',
        TILE_WIDTH,
      )}
    >
      <div className="flex min-h-[3.25rem] items-stretch bg-white/15">
        <div className="relative h-[3.25rem] w-[3.25rem] shrink-0 border-r border-white/10 bg-white/10">
          {member.photo ? (
            <Image src={member.photo} alt="" fill sizes="52px" className="object-cover object-top" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white/60">
              {initials}
            </span>
          )}
        </div>
        <div className="flex flex-1 items-center px-2 py-1">
          <p className="text-[9px] font-semibold leading-tight text-white sm:text-[10px]">{member.role}</p>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#002F56] px-2 py-1.5 text-center">
        <p className="text-[10px] font-display font-bold leading-tight text-white sm:text-[11px]">
          {member.name}
        </p>
      </div>
    </div>
  )
}

function ConnectorDown({ className }: { className?: string }) {
  return <div className={cn('h-6 w-px shrink-0 bg-white/35', className)} aria-hidden />
}

/** Vertical stems from each executive + horizontal bridge + center drop. */
function ConnectorExecutivesMerge() {
  return (
    <div className={cn('flex flex-col items-center', EXEC_SPAN)} aria-hidden>
      <div className={cn('flex w-full justify-center', EXEC_GAP)}>
        <div className="flex flex-1 justify-center">
          <div className="h-5 w-px bg-white/35" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="h-5 w-px bg-white/35" />
        </div>
      </div>
      <div className="h-px w-full bg-white/35" />
      <ConnectorDown />
    </div>
  )
}

/** Drop from department head, branch to three managers. */
function ConnectorManagersBranch() {
  return (
    <div className={cn('flex flex-col items-center', MGR_SPAN)} aria-hidden>
      <ConnectorDown />
      <div className="relative h-5 w-full">
        <div className="absolute left-[16.67%] right-[16.67%] top-1/2 h-px -translate-y-1/2 bg-white/35" />
        <div className="absolute left-[16.67%] top-1/2 h-1/2 w-px bg-white/35" />
        <div className="absolute left-1/2 top-1/2 h-1/2 w-px -translate-x-1/2 bg-white/35" />
        <div className="absolute right-[16.67%] top-1/2 h-1/2 w-px bg-white/35" />
      </div>
    </div>
  )
}

export function CompanyProfileOrgChart({ chart, className }: CompanyProfileOrgChartProps) {
  const [execLeft, execRight] = chart.executives
  const [mgrLeft, mgrCenter, mgrRight] = chart.managers

  return (
    <div className={cn('team-structure mx-auto w-full max-w-4xl overflow-x-auto pb-1', className)}>
      <div className="flex flex-col items-center">
        <div className={cn('flex justify-center', EXEC_GAP)}>
          <OrgTile member={execLeft} />
          <OrgTile member={execRight} />
        </div>

        <ConnectorExecutivesMerge />

        <OrgTile member={chart.deputy} />

        <ConnectorDown />

        <OrgTile member={chart.departmentHead} />

        <ConnectorManagersBranch />

        <div className={cn('flex justify-center', MGR_GAP)}>
          <OrgTile member={mgrLeft} />
          <OrgTile member={mgrCenter} />
          <OrgTile member={mgrRight} />
        </div>
      </div>
    </div>
  )
}
