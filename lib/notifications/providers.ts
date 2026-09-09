import nodemailer from 'nodemailer';
import type { SupabaseClient } from '@supabase/supabase-js';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  from?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from?: string;
  secure?: boolean;
}

export function readSmtpConfig(env: NodeJS.ProcessEnv = process.env): SmtpConfig | null {
  const host = env.SMTP_HOST;
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(env.SMTP_PORT ?? (env.SMTP_SECURE === 'true' ? 465 : 587)),
    user,
    pass,
    from: env.SMTP_FROM || `Ekhaya FC <${user}>`,
    secure: env.SMTP_SECURE === 'true',
  };
}

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(config: SmtpConfig) {
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return cachedTransport;
}

export async function sendEmail(
  supabase: SupabaseClient,
  profileId: string,
  options: EmailOptions,
): Promise<boolean> {
  const config = readSmtpConfig();
  if (!config) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, comm_email')
    .eq('id', profileId)
    .maybeSingle();
  const to = options.to || profile?.email;
  if (!to) return false;
  if (profile && profile.comm_email === false) return false;

  try {
    await getTransport(config).sendMail({
      from: options.from ?? config.from,
      to,
      subject: options.subject,
      text: options.text,
    });
    return true;
  } catch {
    return false;
  }
}

export interface AirtimeConfig {
  username: string;
  apiKey: string;
  senderId?: string;
  baseUrl?: string;
}

export function readAirtimeConfig(env: NodeJS.ProcessEnv = process.env): AirtimeConfig | null {
  const username = env.AT_USERNAME;
  const apiKey = env.AT_API_KEY;
  if (!username || !apiKey) return null;
  return {
    username,
    apiKey,
    senderId: env.AT_SENDER_ID || 'EkhayaFC',
    baseUrl: env.AT_BASE_URL || 'https://api.africastalking.com',
  };
}

export async function sendSms(
  supabase: SupabaseClient,
  profileId: string,
  message: string,
): Promise<boolean> {
  const config = readAirtimeConfig();
  if (!config) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('phone, whatsapp, comm_sms')
    .eq('id', profileId)
    .maybeSingle();
  const recipient = profile?.phone ?? profile?.whatsapp;
  if (!recipient) return false;
  if (profile && profile.comm_sms === false) return false;

  try {
    const response = await fetch(`${config.baseUrl}/version1/messaging`, {
      method: 'POST',
      headers: {
        apiKey: config.apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: config.username,
        to: recipient,
        message,
        ...(config.senderId ? { from: config.senderId } : {}),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function markNotified(
  supabase: SupabaseClient,
  notificationId: string,
  ok: boolean,
): Promise<void> {
  await supabase
    .from('notifications')
    .update({ status: ok ? 'sent' : 'failed', sent_at: ok ? new Date().toISOString() : null })
    .eq('id', notificationId);
}