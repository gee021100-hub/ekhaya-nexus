import { createHash, randomBytes } from 'node:crypto';

export const QR_TOKEN_VERSION = 'v1';

export interface QrTokenData {
  v: string;
  token: string;
  member: string;
}

export function generateQrToken(): string {
  return randomBytes(24).toString('base64url');
}

/** Store only the hash (never the raw token) so scans can be matched safely. */
export function qrTokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Payload encoded as a simple JSON string for QR scanning. */
export function encodeQrPayload(token: string, memberNumber: string): string {
  const data: QrTokenData = { v: QR_TOKEN_VERSION, token, member: memberNumber };
  return JSON.stringify(data);
}

export function decodeQrPayload(raw: string): QrTokenData | null {
  try {
    const data = JSON.parse(raw) as QrTokenData;
    if (data.v === QR_TOKEN_VERSION && data.token && data.member) return data;
    return null;
  } catch {
    return null;
  }
}
