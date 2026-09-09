export type PaymentGateway = 'payfast' | 'stripe' | 'yoco';

export interface PaymentProvider {
  readonly gateway: PaymentGateway;

  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  verifyNotification(request: VerifyRequest): Promise<VerifiedPaymentEvent>;
}

export interface CheckoutParams {
  amount: number;
  currency: string;
  reference: string;
  itemName: string;
  customerEmail?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  url?: string;
  formFields?: Record<string, string>;
  action?: string;
}

export interface VerifyRequest {
  headers: Record<string, string | string[] | undefined>;
  body: Record<string, unknown>;
  rawBody: string;
  ip: string;
}

export interface VerifiedPaymentEvent {
  gateway: PaymentGateway;
  trusted: boolean;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  transactionId?: string;
  amount?: number;
  currency?: string;
  reference?: string;
  raw: Record<string, unknown>;
}