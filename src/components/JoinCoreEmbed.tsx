'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { preconnect } from 'react-dom';
import {
  CORE_SIGNUP_FALLBACK,
  JOIN_CHECKOUT_CONFIG,
  LOGIN_URL,
  joinBoxEnabled,
} from '@/lib/whop';
import { FIRST_TOUCH_COOKIE, readFirstTouchCookie, utmFromFirstTouch } from '@/lib/firstTouch';

// ============================================================================
// The landing-page join box: the Whop Elements checkout for the FREE Core
// plan (email + terms + join; the $0 plan collects no card), themed to the
// page. The Elements tree lives in JoinElementsBox.tsx and is loaded here with
// ssr:false (this component is prerendered inside the client home page).
//
// Completion is a redirect to /join/complete (the Core checkout
// configuration's redirect_url), which fires the sign-up events and hands the
// visitor to the app's login door. Plan: sharpmoney-whop-app
// tasks/plans/website-join-elements-plan.md.
//
// Always rendered under the box, whatever the box does:
//   - LOG IN (existing members)
//   - a link to the app's full signup page (ad blockers can block the box)
//   - the 21+ / 1-800-GAMBLER line
// When the box cannot render (lever off, no configuration, load failure) the
// plain JOIN FREE link to the app's signup page takes its place.
// ============================================================================

const JoinElementsBox = nextDynamic(() => import('./JoinElementsBox'), { ssr: false });

const FONT_DISPLAY = 'var(--font-russo), sans-serif';
const FONT_BODY = 'var(--font-roboto-cond), sans-serif';
const FONT_MONO = 'var(--font-plex-mono), monospace';

const SLOW_EMBED_MS = 8_000;
const BOX_MIN_HEIGHT = 260;

// Origins the hosted Elements SDK is served from (preloadHints() of
// @whop/elements 1.0.0, read at authoring time; origins only, never a pinned
// script URL, which goes stale with Whop's CDN builds).
const ELEMENTS_ORIGINS = ['https://cdn.whop.com'];

type EmbedState = 'loading' | 'ready' | 'disabled';

function readUtmFromLocation(): Record<string, string> | undefined {
  if (typeof window === 'undefined') return undefined;
  const params: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith('utm_')) params[key] = value;
  });
  if (Object.keys(params).length > 0) return params;
  // No tags on this page: use where the visitor first came from (sm_ft cookie).
  const fromFirstTouch = utmFromFirstTouch(readFirstTouchCookie(document.cookie));
  return Object.keys(fromFirstTouch).length > 0 ? fromFirstTouch : undefined;
}

/** The raw sm_ft cookie value (a primitive memo key for the box's metadata). */
function readFirstTouchRaw(): string {
  if (typeof document === 'undefined') return '';
  for (const part of document.cookie.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === FIRST_TOUCH_COOKIE) return rest.join('=');
  }
  return '';
}

export default function JoinCoreEmbed() {
  // utm_* passthrough. Lazy initializers: undefined/empty on the server, read
  // once on the client. Hydration-safe because neither is rendered into
  // markup — they only feed the ssr:false box, which renders nothing until it
  // mounts.
  const [utm] = useState<Record<string, string> | undefined>(() => readUtmFromLocation());
  const [firstTouchRaw] = useState<string>(() => readFirstTouchRaw());
  const utmKey = utm ? new URLSearchParams(utm).toString() : '';
  const enabled = joinBoxEnabled();
  // 'loading' -> 'ready' (box painted) or 'disabled' (SDK failed twice or the
  // element errored: the JOIN FREE link takes the box's place).
  const [embedState, setEmbedState] = useState<EmbedState>('loading');
  const loaded = embedState !== 'loading';
  const [slowEmbed, setSlowEmbed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    for (const origin of ELEMENTS_ORIGINS) preconnect(origin, { crossOrigin: 'anonymous' });
  }, [enabled]);

  useEffect(() => {
    if (!enabled || loaded) return;
    const timer = setTimeout(() => setSlowEmbed(true), SLOW_EMBED_MS);
    return () => clearTimeout(timer);
  }, [enabled, loaded]);

  const showBox = enabled && embedState !== 'disabled';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showBox ? (
        <div style={{ position: 'relative', minHeight: loaded ? undefined : BOX_MIN_HEIGHT }}>
          {!loaded && (
            <div
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0', pointerEvents: 'none' }}
            >
              <div style={{ height: 12, width: 44, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ height: 44, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ height: 14, width: 180, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ height: 48, borderRadius: 10, background: 'rgba(34,211,238,0.25)' }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: '#6b7280' }}>Loading the join box&hellip;</span>
            </div>
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <JoinElementsBox
              configId={JOIN_CHECKOUT_CONFIG}
              utm={utm}
              utmKey={utmKey}
              firstTouchRaw={firstTouchRaw}
              onStateChange={(state) => setEmbedState(state)}
            />
          </div>
        </div>
      ) : (
        <a
          href={CORE_SIGNUP_FALLBACK}
          className="sv-motion block text-center text-[15px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]"
          style={{ letterSpacing: '0.05em', padding: '16px 24px', animation: 'pulseGlow 2.5s ease-in-out infinite' }}
        >
          JOIN FREE
        </a>
      )}
      <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: '#9ca3af', textAlign: 'center' }}>
        $0 today &middot; no card on file
      </div>
      <a
        href={LOGIN_URL}
        className="block text-center text-[14px] font-semibold text-[#d1d5db] hover:text-[#22d3ee] hover:border-[#22d3ee] transition-colors rounded-[10px]"
        style={{ fontFamily: FONT_DISPLAY, border: '1px solid #374151', letterSpacing: '0.04em', padding: '12px 20px' }}
      >
        LOG IN
      </a>
      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 1.5 }}>
        {showBox && slowEmbed && !loaded && (
          <>Join box not loading? (ad blockers can block it) </>
        )}
        Prefer the full signup page?{' '}
        <a
          href={CORE_SIGNUP_FALLBACK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9ca3af] hover:text-[#22d3ee] transition-colors"
          style={{ textDecoration: 'underline' }}
        >
          Open secure signup
        </a>
      </p>
      <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 11.5, color: '#4b5563', textAlign: 'center' }}>
        21+. Gambling problem? Call 1-800-GAMBLER.
      </p>
    </div>
  );
}
