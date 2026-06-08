import { headers } from 'next/headers'
import React from 'react'

import { Footer } from '../../Footer/Component'
import { Header } from '../../Header/Component'
import { Chatbot } from '../Chatbot/ChatbotDynamic'
import { ProfileHeader } from '../ProfileHeader'

function getLayoutFlags(pathname: string) {
  const isMinimalLayout = pathname.startsWith('/profile/') || pathname.startsWith('/employee/')
  const isCompanyProfile = pathname === '/company-profile'
  return {
    isMinimalLayout,
    hideFooter: isMinimalLayout || isCompanyProfile,
    hideSiteHeader: isCompanyProfile,
    hideChatbot: isMinimalLayout || pathname.startsWith('/training') || isCompanyProfile,
  }
}

/**
 * Renders site chrome only when needed. Avoids Header/Footer CMS fetches on
 * routes that hide them (company profile, employee cards, etc.).
 */
export async function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname') ?? ''
  const { isMinimalLayout, hideFooter, hideSiteHeader, hideChatbot } = getLayoutFlags(pathname)

  return (
    <>
      {isMinimalLayout ? <ProfileHeader /> : !hideSiteHeader ? <Header /> : null}
      {children}
      {!hideFooter ? <Footer /> : null}
      {!hideChatbot ? <Chatbot /> : null}
    </>
  )
}
