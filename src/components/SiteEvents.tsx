'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { APP_URL } from '@/lib/app-url';
import { classifyLink, sendSiteEvent, toolSlugFromPath } from '@/lib/siteEvents';

// Sends click and engagement events (see src/lib/siteEvents.ts). One delegated
// click listener for links; observers for the pricing table and join box; the
// first input on a tool page; the first play of each video. "Once" resets on
// every page view (pathname change).
export default function SiteEvents() {
  const pathname = usePathname();

  // Link clicks (left, middle and cmd-click).
  useEffect(() => {
    const onClick = (event: Event) => {
      try {
        const el = (event.target as Element | null)?.closest?.('a[href], [data-cta-id]') as HTMLElement | null;
        if (!el) return;
        const override = el.getAttribute('data-cta-id');
        const href = el instanceof HTMLAnchorElement ? el.href : window.location.href;
        const ev = classifyLink(href, window.location.href, APP_URL, override);
        if (ev) sendSiteEvent(ev);
      } catch {
        // never block navigation
      }
    };
    const opts = { capture: true, passive: true } as const;
    document.addEventListener('click', onClick, opts);
    document.addEventListener('auxclick', onClick, opts);
    return () => {
      document.removeEventListener('click', onClick, opts);
      document.removeEventListener('auxclick', onClick, opts);
    };
  }, []);

  // Pricing table and join box seen (half on screen), once per page view.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const seen = new Set<string>();
    const targets: [string, 'pricing_view' | 'join_box_view'][] = [
      ['pricing', 'pricing_view'],
      ['join', 'join_box_view'],
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const hit = targets.find(([id]) => id === entry.target.id);
          if (!hit || !entry.isIntersecting || seen.has(hit[0])) continue;
          seen.add(hit[0]);
          sendSiteEvent({ name: hit[1], params: { page: window.location.pathname } });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    // Sections can render after first paint; look again briefly.
    const attach = () => targets.forEach(([id]) => { const el = document.getElementById(id); if (el && !seen.has(id)) observer.observe(el); });
    attach();
    const retry = window.setTimeout(attach, 1500);
    return () => {
      window.clearTimeout(retry);
      observer.disconnect();
    };
  }, [pathname]);

  // First input on a tool page.
  useEffect(() => {
    const tool = toolSlugFromPath(pathname || '');
    if (!tool) return;
    let sent = false;
    const onInput = () => {
      if (sent) return;
      sent = true;
      sendSiteEvent({ name: 'tool_use', params: { tool, page: window.location.pathname } });
    };
    document.addEventListener('input', onInput, true);
    document.addEventListener('change', onInput, true);
    return () => {
      document.removeEventListener('input', onInput, true);
      document.removeEventListener('change', onInput, true);
    };
  }, [pathname]);

  // First play of each video.
  useEffect(() => {
    const played = new Set<string>();
    const onPlay = (event: Event) => {
      const media = event.target as HTMLMediaElement | null;
      const src = media?.currentSrc || media?.getAttribute?.('src') || '';
      if (!src || played.has(src)) return;
      played.add(src);
      const video = (src.split('/').pop() || 'video').split('?')[0].slice(0, 60);
      sendSiteEvent({ name: 'video_play', params: { video, page: window.location.pathname } });
    };
    document.addEventListener('play', onPlay, true);
    return () => document.removeEventListener('play', onPlay, true);
  }, [pathname]);

  return null;
}
