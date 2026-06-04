export type StcPaymentEnvironment = 'sandbox' | 'production'

export type StcPaymentConfig = {
  merchantIdentifier: string
  accessCode: string
  shaRequestPhrase: string
  shaResponsePhrase: string
  shaType: 'sha256' | 'sha512'
  environment: StcPaymentEnvironment
  /** STCPAY restricts hosted page to STC Pay; omit to show all enabled methods (mada, cards, etc.). */
  digitalWallet?: 'STCPAY'
}

export function getStcPaymentConfig(): StcPaymentConfig | null {
  const merchantIdentifier = process.env.STC_PAYMENT_MERCHANT_IDENTIFIER?.trim()
  const accessCode = process.env.STC_PAYMENT_ACCESS_CODE?.trim()
  const shaRequestPhrase = process.env.STC_PAYMENT_SHA_REQUEST_PHRASE?.trim()
  const shaResponsePhrase = process.env.STC_PAYMENT_SHA_RESPONSE_PHRASE?.trim()

  if (!merchantIdentifier || !accessCode || !shaRequestPhrase || !shaResponsePhrase) {
    return null
  }

  const envRaw = (process.env.STC_PAYMENT_ENV || 'sandbox').toLowerCase()
  const environment: StcPaymentEnvironment = envRaw === 'production' ? 'production' : 'sandbox'

  const shaRaw = (process.env.STC_PAYMENT_SHA_TYPE || 'sha256').toLowerCase()
  const shaType: 'sha256' | 'sha512' = shaRaw === 'sha512' ? 'sha512' : 'sha256'

  const walletRaw = process.env.STC_PAYMENT_DIGITAL_WALLET?.trim().toUpperCase()
  const digitalWallet = walletRaw === 'STCPAY' ? 'STCPAY' : undefined

  return {
    merchantIdentifier,
    accessCode,
    shaRequestPhrase,
    shaResponsePhrase,
    shaType,
    environment,
    digitalWallet,
  }
}

export function getStcHostedCheckoutUrl(environment: StcPaymentEnvironment): string {
  return environment === 'production'
    ? 'https://checkout.payfort.com/FortAPI/paymentPage'
    : 'https://sbcheckout.payfort.com/FortAPI/paymentPage'
}
