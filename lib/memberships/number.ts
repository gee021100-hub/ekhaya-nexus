/** EFC-YYYY-NNNN member number formatters (issuance is DB-side RPC). */
export function formatMemberNumber(year: number, seq: number): string {
  return `EFC-${year}-${String(seq).padStart(4, '0')}`;
}

export function parseMemberYear(memberNumber: string | null | undefined): number | null {
  const match = memberNumber?.match(/^EFC-(\d{4})-/);
  return match ? Number(match[1]) : null;
}

export function parseMemberSeq(memberNumber: string | null | undefined): number | null {
  const match = memberNumber?.match(/-(\d{4})$/);
  return match ? Number(match[1]) : null;
}

/** Digital card number derived from the member number (format: EKC-XXXX). */
export function generateCardNumber(memberNumber: string): string {
  const seq = parseMemberSeq(memberNumber);
  return `EKC-${String(seq ?? 0).padStart(4, '0')}`;
}