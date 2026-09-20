'use client';

import { useEffect } from 'react';

/**
 * Privacy-friendly page-view tracker. Sends an anonymized hit to /api/track on
 * first render: only the device class, viewport, locale, an anonymized visitor
 * hash and the path are recorded. No IPs, no tracking of clicks or scrolls.
 * Mounted once in the root layout.
 */
export function PageViewTracker() {
  useEffect(() => {
    try {
      if (window.location.pathname.startsWith('/admin')) return;

      let visitor = localStorage.getItem('eh_visitor');
      if (!visitor) {
        visitor =
          typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : String(Date.now()) + Math.random().toString(36).slice(2);
        localStorage.setItem('eh_visitor', visitor);
      }

      const w = window.innerWidth;
      const device = w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';

      const payload = {
        path: window.location.pathname,
        referrer: document.referrer || null,
        device,
        locale: navigator.language || null,
        viewport: `${w}x${window.innerHeight}`,
        visitor,
      };

      void fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // tracking must never break rendering
    }
  }, []);

  return null;
}