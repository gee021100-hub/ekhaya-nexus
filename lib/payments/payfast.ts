import { createHash } from 'node:crypto';

export type PayFastMode = 'sandbox' | 'live';

export const PAYFAST_ENDPOINTS = {
  sandbox: 'https://sandbox.payfast.co.za/eng/process',
  live: 'https://www.payfast.co.za/eng/process',
} as const;

export function getPayFastEndpoints(mode: PayFastMode) {
  return PAYFAST_ENDPOINTS[mode];
}

export type PayFastFields = Record<string, string | number | undefined>;

export function buildSignatureString(fields: PayFastFields, passphrase?: string): string {
  const parts = Object.entries(fields)
    .filter(([key, value]) => value !== undefined && value !== '' && key !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value).replace(/%20/g, '+')).replace(/%2C/g, ',')}`);
  const base = parts.join('&');
  return passphrase ? `${base}&passphrase=${encodeURIComponent(passphrase)}` : base;
}

export function computeSignature(fields: PayFastFields, passphrase?: string): string {
  return createHash('md5').update(buildSignatureString(fields, passphrase)).digest('hex');
}

export function verifySignature(
  fields: PayFastFields,
  expectedSignature: string | undefined,
  passphrase?: string,
): boolean {
  return Boolean(expectedSignature && computeSignature(fields, passphrase) === expectedSignature);
}

export type PayFastNotificationStatus = 'COMPLETE' | 'PENDING' | 'FAILED' | 'CANCELLED';

export function mapPayFastStatus(status: PayFastNotificationStatus): {
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
} {
  switch (status) {
    case 'COMPLETE':
      return { status: 'paid' };
    case 'PENDING':
      return { status: 'pending' };
    case 'FAILED':
      return { status: 'failed' };
    case 'CANCELLED':
      return { status: 'cancelled' };
  }
}

export function buildCheckoutFields(input: {
  merchantId: string;
  merchantKey: string;
  amount: number;
  itemName: string;
  reference: string;
  email?: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}): PayFastFields {
  return {
    merchant_id: input.merchantId,
    merchant_key: input.merchantKey,
    amount: input.amount.toFixed(2),
    item_name: input.itemName,
    m_payment_id: input.reference,
    custom_str1: input.reference,
    email_address: input.email,
    return_url: input.returnUrl,
    cancel_url: input.cancelUrl,
    notify_url: input.notifyUrl,
  };
}