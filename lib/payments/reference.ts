/** Payment references: PY-XXXXXXXXXXXX. Random, collision-safe. */
export function createPaymentReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  const rand = new Uint32Array(10);
  crypto.getRandomValues(rand);
  for (let i = 0; i < 12; i += 1) {
    suffix += chars[rand[i] % chars.length];
  }
  return `PY-${suffix}`;
}

/** Document numbers: RCT-YYYY-XXXXX (receipts), MEM-YYYY-XXXXX (vouchers). */
export function createDocumentNumber(prefix: 'RCT' | 'MEM'): string {
  const seq = Math.floor(10000 + Math.random() * 89999);
  return `${prefix}-${new Date().getFullYear()}-${seq}`;
}

export function isValidPaymentReference(reference: string | null | undefined): boolean {
  return Boolean(reference && /^PY-[A-Z2-9]{12}$/.test(reference));
}