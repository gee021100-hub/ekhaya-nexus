import { createAdminClient, adminConfigured } from '@/lib/supabase/admin';

export type PaymentMethodType = 'bank_transfer' | 'mobile_money';

export interface BankTransferDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_code?: string;
  swift?: string;
}

export interface MobileMoneyDetails {
  wallet: string;
  merchant_number: string;
}

interface BasePaymentMethod {
  code: string;
  name: string;
  enabled: boolean;
  sortOrder: number;
  instructions: string;
}

export type PaymentMethod =
  | (BasePaymentMethod & { type: 'bank_transfer'; details: BankTransferDetails })
  | (BasePaymentMethod & { type: 'mobile_money'; details: MobileMoneyDetails });

export interface PaymentMethodRaw {
  code: string;
  name?: string;
  type?: PaymentMethodType;
  enabled?: boolean;
  sort?: number;
  details?: Record<string, unknown>;
  instructions?: string;
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'FDH Bank transfer',
  tnm_mpamba: 'Mpamba (TNM)',
  airtel_money: 'Airtel Money',
  payfast: 'PayFast',
  stripe: 'Card payment',
  yoco: 'Card payment',
  manual: 'Manual',
  store_credit: 'Store credit',
  other: 'Other',
};

export function paymentMethodLabel(code: string | null | undefined): string {
  if (!code) return '—';
  return PAYMENT_METHOD_LABELS[code] ?? code;
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    code: 'bank_transfer',
    name: 'FDH Bank transfer',
    type: 'bank_transfer',
    enabled: true,
    sortOrder: 10,
    details: {
      bank_name: 'FDH Bank',
      account_name: 'Ekhaya Football Club',
      account_number: '1910000195208',
      swift: '',
    },
    instructions:
      'Deposit the amount into the FDH Bank account below and use your unique PY- reference as the deposit reference. Your membership is activated once the club verifies the deposit.',
  },
  {
    code: 'tnm_mpamba',
    name: 'Mpamba (TNM)',
    type: 'mobile_money',
    enabled: true,
    sortOrder: 20,
    details: {
      wallet: 'TNM Mpamba',
      merchant_number: '432389',
    },
    instructions:
      'Dial *444# and send the exact amount to the TNM Mpamba merchant number 432389 (Ekhaya FC). Keep the confirmation on your phone - the club uses it to match your payment.',
  },
  {
    code: 'airtel_money',
    name: 'Airtel Money',
    type: 'mobile_money',
    enabled: true,
    sortOrder: 30,
    details: {
      wallet: 'Airtel Money',
      merchant_number: '10080128',
    },
    instructions:
      'Dial *333# and send the exact amount to the Airtel Money merchant number 10080128 (Ekhaya FC). Keep the confirmation on your phone - the club uses it to match your payment.',
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeMethod(raw: PaymentMethodRaw): PaymentMethod | null {
  if (!raw.code) return null;
  const type =
    raw.type === 'bank_transfer' || raw.type === 'mobile_money' ? raw.type : 'mobile_money';
  const details = (raw.details && isRecord(raw.details) ? raw.details : {}) as Record<
    string,
    unknown
  >;

  const base: BasePaymentMethod = {
    code: raw.code,
    name: raw.name ?? PAYMENT_METHOD_LABELS[raw.code] ?? raw.code,
    enabled: raw.enabled !== false,
    sortOrder: typeof raw.sort === 'number' ? raw.sort : 100,
    instructions: raw.instructions ?? '',
  };

  if (type === 'bank_transfer') {
    return {
      ...base,
      type,
      details: {
        bank_name: String(details.bank_name ?? ''),
        account_name: String(details.account_name ?? ''),
        account_number: String(details.account_number ?? ''),
        branch_code: details.branch_code ? String(details.branch_code) : undefined,
        swift: details.swift ? String(details.swift) : undefined,
      },
    };
  }
  return {
    ...base,
    type,
    details: {
      wallet: String(details.wallet ?? PAYMENT_METHOD_LABELS[raw.code] ?? ''),
      merchant_number: String(details.merchant_number ?? ''),
    },
  };
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  if (adminConfigured()) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'payment_methods')
      .maybeSingle();

    if (data?.value) {
      if (isRecord(data.value) && Array.isArray(data.value.methods)) {
        const methods = (data.value.methods as PaymentMethodRaw[])
          .map(normalizeMethod)
          .filter((m): m is PaymentMethod => m !== null);
        if (methods.length) return sortMethods(methods);
      }
      if (Array.isArray(data.value)) {
        const methods = (data.value as PaymentMethodRaw[])
          .map(normalizeMethod)
          .filter((m): m is PaymentMethod => m !== null);
        if (methods.length) return sortMethods(methods);
      }
    }
  }
  return sortMethods([...DEFAULT_PAYMENT_METHODS]);
}

export async function getPaymentMethod(code: string): Promise<PaymentMethod | undefined> {
  const methods = await listPaymentMethods();
  return methods.find((m) => m.code === code && m.enabled);
}

function sortMethods(methods: PaymentMethod[]): PaymentMethod[] {
  return methods
    .filter((m) => m.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}