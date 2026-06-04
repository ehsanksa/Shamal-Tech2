'use client'

import { usePathname } from 'next/navigation'

import { ProfileHeader } from '../ProfileHeader'

interface ConditionalLayoutProps {
  children: React.ReactNode
  fullHeader: React.ReactNode
  footer: React.ReactNode
  chatbot?: React.ReactNode
}

export function ConditionalLayout({ children, fullHeader, footer, chatbot }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isMinimalLayout = pathname?.startsWith('/profile/') || pathname?.startsWith('/employee/')
  const isCompanyProfile = pathname === '/company-profile'
  const hideFooter = isMinimalLayout || isCompanyProfile
  const hideSiteHeader = isCompanyProfile
  const hideChatbotOnTraining = pathname?.startsWith('/training')

  return (
    <>
      {isMinimalLayout ? (
        <ProfileHeader />
      ) : hideSiteHeader ? null : (
        fullHeader
      )}
      {children}
      {!hideFooter && footer}
      {!isMinimalLayout && !hideChatbotOnTraining && chatbot}
    </>
  )
}
