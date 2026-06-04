import { getStcHostedCheckoutUrl, type StcPaymentConfig } from './env'
import { signStcPaymentRequest } from './signature'

export type StcHostedCheckoutInput = {
  merchantReference: string
  amountHalalas: number
  customerEmail: string
  customerIp: string
  phoneNumber: string
  orderDescription: string
  returnUrl: string
  language?: 'en' | 'ar'
}

/** Build signed POST fields for STC Pay hosted checkout (Amazon Payment Services). */
export function buildStcHostedCheckoutFields(
  config: StcPaymentConfig,
  input: StcHostedCheckoutInput,
): Record<string, string> {
  const params: Record<string, string> = {
    command: 'PURCHASE',
    access_code: config.accessCode,
    merchant_identifier: config.merchantIdentifier,
    merchant_reference: input.merchantReference,
    amount: String(input.amountHalalas),
    currency: 'SAR',
    language: input.language || 'en',
    customer_email: input.customerEmail,
    customer_ip: input.customerIp,
    phone_number: input.phoneNumber,
    order_description: input.orderDescription.slice(0, 150),
    return_url: input.returnUrl,
  }

  if (config.digitalWallet) {
    params.digital_wallet = config.digitalWallet
  }

  params.signature = signStcPaymentRequest(params, config)
  return params
}

export function getStcCheckoutAction(config: StcPaymentConfig): string {
  return getStcHostedCheckoutUrl(config.environment)
}

/** APS success: response_code 14000 and status 20 (purchase success). */
export function isStcPaymentSuccess(params: Record<string, string>): boolean {
  return params.response_code === '14000' && params.status === '20'
}

/** Convert SAR decimal price to halalas (minor units). */
export function sarToHalalas(amountSar: number): number {
  return Math.round(amountSar * 100)
}
