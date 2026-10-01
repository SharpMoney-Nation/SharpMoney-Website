'use client';

import { useEffect } from 'react';
import { APP_URL } from '@/lib/app-url';
import { appendFirstTouchUtm, isCheckoutLink, readFirstTouchCookie } from '@/lib/firstTouch';

// Adds the visitor's first-touch source (sm_ft cookie) as utm_* tags to
// checkout links (whop.com/c/... and the app's /signup) at the moment they are
// used. Pages stay static: nothing is rewritten at render time. pointerdown
// and auxclick cover middle-click and cmd-click, which open a new tab without
// a normal click event. Links that already carry utm_* tags are left alone.
export default function CheckoutLinkSource() {
  useEffect(() => {
    const tag = (event: Event) => {
      try {
        const target = event.target as Element | null;
        const a = target?.closest?.('a[href]') as HTMLAnchorElement | null;
        if (!a || !isCheckoutLink(a.href, APP_URL)) return;
        const next = appendFirstTouchUtm(a.href, readFirstTouchCookie(document.cookie));
        if (next !== a.href) a.href = next;
      } catch {
        // never block navigation
      }
    };
    const opts = { capture: true, passive: true } as const;
    document.addEventListener('pointerdown', tag, opts);
    document.addEventListener('click', tag, opts);
    document.addEventListener('auxclick', tag, opts);
    return () => {
      document.removeEventListener('pointerdown', tag, opts);
      document.removeEventListener('click', tag, opts);
      document.removeEventListener('auxclick', tag, opts);
    };
  }, []);
  return null;
}
