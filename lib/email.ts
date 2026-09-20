import { formatMoney } from '@/lib/utils';

export type EmailResult = { ok: boolean; error?: string };

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'Ekhaya FC <fans@ekhayafc.app>';

export function emailConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

/**
 * Transactional email gateway. Currently speaks the Resend REST API
 * (postmark/sendgrid can be added behind this same function). When no API key
 * is configured this is a no-op that returns an error — callers treat emails
 * as best-effort and never fail a booking because an email didn't send.
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'EMAIL_NOT_CONFIGURED' };
  }
  if (!to || !to.includes('@')) {
    return { ok: false, error: 'INVALID_RECIPIENT' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject: subject.slice(0, 200),
        text,
        ...(html ? { html } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, error: `resend:${res.status}:${body.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'email_failed' };
  }
}

/** Fan-facing email templates (plain text + simple HTML). */

function wrapHtml(title: string, bodyHtml: string): string {
  return `<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#161616;">
  <div style="background:#161616;padding:20px;text-align:center;">
    <span style="color:#C9A227;font-size:20px;font-weight:bold;letter-spacing:2px;">EKHAYA FC</span>
  </div>
  <div style="padding:24px;background:#F7F5F0;">
    <h1 style="font-size:18px;margin:0 0 12px;">${title}</h1>
    ${bodyHtml}
    <p style="margin-top:24px;color:#8A8A8A;font-size:12px;">Ekhaya FC — the digital home of Ekhaya Football Club.</p>
  </div>
</div>`;
}

function textLines(rows: [string, string][]): string {
  return rows.map(([k, v]) => `${k}: ${v}`).join('\n');
}

export function ticketBookingEmail(opts: {
  email: string;
  fullName: string;
  reference: string;
  amount: number | null;
  category: string;
  quantity: number;
}): { subject: string; text: string; html: string } {
  const rows: [string, string][] = [
    ['Booking reference', opts.reference],
    ['Stand', opts.category],
    ['Tickets', String(opts.quantity)],
    ['Total', opts.amount != null && opts.amount > 0 ? formatMoney(opts.amount) : 'To be confirmed at the office'],
  ];
  return {
    subject: `Your Ekhaya FC ticket booking — ${opts.reference}`,
    text: `Thanks ${opts.fullName},\n\n${textLines(rows)}\n\nBring your booking reference and a photo ID to the stadium on match day.`,
    html: wrapHtml(
      `Your booking is confirmed, ${opts.fullName}`,
      rows
        .map(([k, v]) => `<p style="margin:4px 0;"><strong>${k}:</strong> ${v}</p>`)
        .join(''),
    ),
  };
}

export function membershipEmail(opts: {
  email: string;
  fullName: string;
  tierName: string;
  amount: number | null;
  reference: string;
}): { subject: string; text: string; html: string } {
  const rows: [string, string][] = [
    ['Membership type', opts.tierName],
    ['Payment reference', opts.reference],
    ['Amount', opts.amount != null && opts.amount > 0 ? formatMoney(opts.amount) : 'Free / to be arranged with the club'],
  ];
  return {
    subject: `Welcome to Ekhaya FC — ${opts.tierName} membership`,
    text: `Hi ${opts.fullName},\n\n${textLines(rows)}\n\nYour membership is being processed. We will confirm once your payment is verified.`,
    html: wrapHtml(
      `Welcome to Ekhaya FC, ${opts.fullName}`,
      rows
        .map(([k, v]) => `<p style="margin:4px 0;"><strong>${k}:</strong> ${v}</p>`)
        .join(''),
    ),
  };
}