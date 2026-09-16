'use client';

import { useEffect, useState } from 'react';
import nextDynamic from 'next/dynamic';
import {
  CORE_AFFILIATE,
  CORE_PLAN_ID,
  CORE_SIGNUP_FALLBACK,
  JOIN_DONE_URL,
  JOIN_EMBED_ENABLED,
  LOGIN_URL,
} from '@/lib/whop';

// ============================================================================
// The landing-page join box: the Whop checkout embed for the FREE Core plan
// (email + terms + "Join Free"; the $0 plan collects no card), themed to the
// page. On completion we hand the visitor to the app's login door, which
// lands them on the tool. Mirrors the app's own /signup embed usage.
//
// Always rendered under the box, whatever the embed does:
//   - LOG IN (existing members — 1,400+ people already own Core)
//   - a link to the app's full signup page (ad blockers can block the iframe)
//   - the 21+ / 1-800-GAMBLER line
// ============================================================================

const WhopCheckoutEmbed = nextDynamic(
  () => import('@whop/checkout/react').then((m) => m.WhopCheckoutEmbed),
  { ssr: false }
);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const FONT_DISPLAY = 'var(--font-russo), sans-serif';
const FONT_BODY = 'var(--font-roboto-cond), sans-serif';
const FONT_MONO = 'var(--font-plex-mono), monospace';

const SLOW_EMBED_MS = 8_000;
const BOX_MIN_HEIGHT = 260;

type EmbedState = 'loading' | 'ready' | 'disabled';

function readUtmFromLocation(): Record<string, string> | undefined {
  if (typeof window === 'undefined') return undefined;
  const params: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith('utm_')) params[key] = value;
  });
  return Object.keys(params).length > 0 ? params : undefined;
}

export default function JoinCoreEmbed() {
  // utm_* passthrough. Lazy initializer: undefined on the server, read once on
  // the client. Hydration-safe because utm is never rendered into markup — it
  // only feeds the ssr:false embed, which renders nothing until it mounts.
  const [utm] = useState<Record<string, string> | undefined>(() => readUtmFromLocation());
  // Whop reports 'loading' -> 'disabled' (form on screen, Join not yet
  // clickable until email + terms are in) -> 'ready'. Anything past
  // 'loading' means the box is painted, so the skeleton must go then.
  const [embedState, setEmbedState] = useState<EmbedState>('loading');
  const loaded = embedState !== 'loading';
  const [slowEmbed, setSlowEmbed] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!JOIN_EMBED_ENABLED || loaded) return;
    const timer = setTimeout(() => setSlowEmbed(true), SLOW_EMBED_MS);
    return () => clearTimeout(timer);
  }, [loaded]);

  const handleComplete = () => {
    setDone(true);
    try {
      window.gtag?.('event', 'sign_up', { method: 'whop_embed' });
    } catch {
      // analytics is best-effort
    }
    window.location.assign(JOIN_DONE_URL);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {JOIN_EMBED_ENABLED ? (
        done ? (
          <div
            role="status"
            style={{
              minHeight: BOX_MIN_HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              textAlign: 'center',
            }}
          >
            <span
              aria-hidden="true"
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#22d3ee', animation: 'blinkDot 1.2s ease-in-out infinite' }}
            />
            <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: '#e5e7eb' }}>
              Setting up your free account&hellip; taking you to the tool.
            </span>
          </div>
        ) : (
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
            <WhopCheckoutEmbed
              planId={CORE_PLAN_ID}
              theme="dark"
              skipRedirect
              hidePrice
              environment="production"
              affiliateCode={CORE_AFFILIATE}
              utm={utm}
              themeOptions={{
                backgroundColor: '#111827',
                accentColor: '#22d3ee',
                borderRadius: 10,
                buttonText: 'Join Free',
              }}
              onStateChange={(state) => setEmbedState(state)}
              onPaymentError={(error) => {
                // Surface Whop's own words: the message is the only clue a
                // visitor (or we) get about why a $0 join was refused.
                console.warn('[JoinCoreEmbed] Whop checkout error', error);
                setPaymentError(error?.message || 'Whop could not complete the join.');
              }}
              onComplete={() => handleComplete()}
            />
            </div>
          </div>
        )
      ) : (
        <a
          href={CORE_SIGNUP_FALLBACK}
          className="sv-motion block text-center text-[15px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]"
          style={{ letterSpacing: '0.05em', padding: '16px 24px', animation: 'pulseGlow 2.5s ease-in-out infinite' }}
        >
          JOIN FREE
        </a>
      )}

      {paymentError && (
        <p role="alert" style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 14, color: '#fca5a5' }}>
          Whop said: &ldquo;{paymentError}&rdquo; Try again, or open the secure signup page below.
        </p>
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
        {slowEmbed && !loaded && !done && (
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
