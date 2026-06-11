import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

import { getSmtpTransportOptions } from './smtpEnv'

let transporter: Transporter | null = null

/**
 * Get or create nodemailer transporter
 * Uses environment variables for configuration
 */
export function getTransporter(): Transporter {
  if (transporter) {
    return transporter
  }

  const transportOptions = getSmtpTransportOptions()

  if (!transportOptions) {
    throw new Error(
      'SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables.',
    )
  }

  transporter = nodemailer.createTransport(transportOptions)

  return transporter
}

/**
 * Verify SMTP connection
 */
export async function verifySMTPConnection(): Promise<boolean> {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    return true
  } catch (error) {
    console.error('SMTP connection verification failed:', error)
    return false
  }
}

