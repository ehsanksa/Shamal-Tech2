'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import { Popup, PopupList, useAuth, useConfig } from '@payloadcms/ui'

import './index.scss'

type ProfileMedia = {
  url?: string | null
  alt?: string | null
}

function getInitials(name?: string | null, email?: string | null): string {
  const fromName = (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

  if (fromName) return fromName
  return (email?.[0] || '?').toUpperCase()
}

function getProfileImageUrl(profilePicture: unknown): string | null {
  if (!profilePicture || typeof profilePicture !== 'object') return null
  const url = (profilePicture as ProfileMedia).url
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return url
  return `/${url}`
}

function AdminProfileMenu() {
  const { user, logOut, fetchFullUser } = useAuth()
  const { config } = useConfig()
  const pathname = usePathname()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadAvatar = async () => {
      const fromSession = getProfileImageUrl(user?.profilePicture)
      if (fromSession) {
        setAvatarUrl(fromSession)
        return
      }

      try {
        const fullUser = await fetchFullUser()
        if (!cancelled) {
          setAvatarUrl(getProfileImageUrl(fullUser?.profilePicture))
        }
      } catch {
        if (!cancelled) {
          setAvatarUrl(null)
        }
      }
    }

    void loadAvatar()

    return () => {
      cancelled = true
    }
  }, [fetchFullUser, user?.id, user?.profilePicture])

  const accountUrl = useMemo(
    () =>
      formatAdminURL({
        adminRoute: config.routes.admin,
        path: config.admin.routes.account,
      }),
    [config.admin.routes.account, config.routes.admin],
  )

  const loginUrl = useMemo(
    () =>
      formatAdminURL({
        adminRoute: config.routes.admin,
        path: '/login',
      }),
    [config.routes.admin],
  )

  const isOnAccountPage = pathname === accountUrl

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      window.location.href = loginUrl
    }
  }

  const handleSwitchAccount = async () => {
    await handleSignOut()
  }

  if (!user) {
    return null
  }

  const profileImageUrl = avatarUrl
  const initials = getInitials(user.name, user.email)

  return (
    <div
      className="admin-profile-menu"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.stopPropagation()
        }
      }}
    >
      <Popup
        buttonType="custom"
        horizontalAlign="right"
        verticalAlign="bottom"
        size="medium"
        id="admin-profile-menu"
        button={
          <button
            type="button"
            className={[
              'admin-profile-menu__trigger',
              isOnAccountPage ? 'admin-profile-menu__trigger--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label="Open account menu"
            aria-haspopup="menu"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={user.name || 'Profile'}
                className="admin-profile-menu__avatar-image"
                width={32}
                height={32}
              />
            ) : (
              <span className="admin-profile-menu__avatar-initials" aria-hidden="true">
                {initials}
              </span>
            )}
          </button>
        }
      >
        <div className="admin-profile-menu__card">
          <div className="admin-profile-menu__name">{user.name}</div>
          <div className="admin-profile-menu__email">{user.email}</div>
        </div>
        <PopupList.ButtonGroup>
          <PopupList.Button href={accountUrl}>Account settings</PopupList.Button>
          <PopupList.Button onClick={() => void handleSwitchAccount()}>
            Switch account
          </PopupList.Button>
          <PopupList.Divider />
          <PopupList.Button onClick={() => void handleSignOut()}>Sign out</PopupList.Button>
        </PopupList.ButtonGroup>
      </Popup>
    </div>
  )
}

export default AdminProfileMenu
