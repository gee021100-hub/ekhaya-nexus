'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    // Only register the service worker in production on a secure context
    // (HTTPS deployment). Local/dev servers are skipped so HMR never serves
    // stale cached assets.
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !window.isSecureContext) return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration is an enhancement; ignore failures.
    });
  }, []);

  return null;
}