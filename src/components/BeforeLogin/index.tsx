'use client'

import React, { useEffect } from 'react'

import AdminLogo from '../AdminLogo'

const BeforeLogin: React.FC = () => {
  useEffect(() => {
    const setupPasswordToggle = () => {
      const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]')

      if (!passwordInput || passwordInput.dataset.passwordToggleReady === 'true') {
        return
      }

      passwordInput.dataset.passwordToggleReady = 'true'
      passwordInput.style.paddingRight = '2.5rem'

      const currentParent = passwordInput.parentElement
      if (!currentParent) return

      const wrapper = document.createElement('div')
      wrapper.style.position = 'relative'
      wrapper.style.width = '100%'

      currentParent.insertBefore(wrapper, passwordInput)
      wrapper.appendChild(passwordInput)

      const toggleButton = document.createElement('button')
      toggleButton.type = 'button'
      toggleButton.setAttribute('aria-label', 'Show password')
      toggleButton.setAttribute('aria-pressed', 'false')
      toggleButton.style.position = 'absolute'
      toggleButton.style.right = '0.75rem'
      toggleButton.style.top = '50%'
      toggleButton.style.transform = 'translateY(-50%)'
      toggleButton.style.display = 'inline-flex'
      toggleButton.style.alignItems = 'center'
      toggleButton.style.justifyContent = 'center'
      toggleButton.style.padding = '0'
      toggleButton.style.margin = '0'
      toggleButton.style.width = '1.25rem'
      toggleButton.style.height = '1.25rem'
      toggleButton.style.background = 'transparent'
      toggleButton.style.border = '0'
      toggleButton.style.color = 'var(--theme-elevation-500)'
      toggleButton.style.cursor = 'pointer'
      toggleButton.innerHTML =
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>'

      const closedEyeIcon =
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94C16.14 19.2 14.15 20 12 20 5 20 1 12 1 12a21.76 21.76 0 0 1 5.08-6.17"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a22.73 22.73 0 0 1-3.08 4.63"/><path d="m1 1 22 22"/></svg>'

      const openEyeIcon =
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>'

      toggleButton.addEventListener('click', () => {
        const isShowingPassword = passwordInput.type === 'text'
        passwordInput.type = isShowingPassword ? 'password' : 'text'
        toggleButton.setAttribute('aria-label', isShowingPassword ? 'Show password' : 'Hide password')
        toggleButton.setAttribute('aria-pressed', String(!isShowingPassword))
        toggleButton.innerHTML = isShowingPassword ? openEyeIcon : closedEyeIcon
      })

      wrapper.appendChild(toggleButton)
    }

    setupPasswordToggle()

    const observer = new MutationObserver(() => {
      setupPasswordToggle()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <AdminLogo />
      </div>
      <p>
        <b>Welcome to your dashboard!</b>
        {' This is where site admins will log in to manage your website.'}
      </p>
    </div>
  )
}

export default BeforeLogin
