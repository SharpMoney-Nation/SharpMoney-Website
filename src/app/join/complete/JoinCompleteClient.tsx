'use client';

import { useEffect, useRef, useState } from 'react';
import { expectedTrackers, fireJoinSignup, type JoinWindow } from '@/lib/joinEvents';
import { readJoinReturn, type JoinReturn } from '@/lib/joinReturn';
import { GA_MEASUREMENT_ID, META_PIXEL_ID, X_PIXEL_ID, X_SIGNUP_EVENT_ID } from '@/lib/pixelIds';
import { CORE_SIGNUP_FALLBACK, JOIN_DONE_URL, LOGIN_URL } from '@/lib/whop';
import { JoinSkeleton } from './JoinSkeleton';

// ============================================================================
// The browser half of /join/complete (plan Phase 4). Loaded with ssr:false.
//
// 1. Parse the landing ONCE from window.location.search into frozen state
//    (never from a live useSearchParams: Next syncs history.replaceState back
//    into it and would re-render this page as "unknown" mid-wait).
// 2. One effect, once (ref guard): strip Whop's query with replaceState so a
//    reload or Back never re-reads it; on success fire the sign-up events
//    through fireJoinSignup, which waits for every expected tracker (cap 3 s)
//    and then leaves with location.replace (Back skips this page). The cleanup
//    cancels nothing: StrictMode's dev double-mount must not strand the buyer
//    (the in-memory once-guard answers the second mount).
// 3. 'already' (a second landing for the same receipt): the manual LOG IN door.
//    failed: retry links. unknown: neutral copy + the LOG IN door, never
//    auto-enter.
// ============================================================================

const FONT_BODY = 'var(--font-roboto-cond), sans-serif';
const FONT_DISPLAY = 'var(--font-russo), sans-serif';

type Screen = 'wait' | 'already' | 'failed' | 'unknown';

function parseLanding(): JoinReturn {
  if (typeof window === 'undefined') return { receiptId: null, outcome: 'unknown' };
  try {
    return readJoinReturn(new URLSearchParams(window.location.search));
  } catch {
    return { receiptId: null, outcome: 'unknown' };
  }
}

export default function JoinCompleteClient() {
  const [landing] = useState<JoinReturn>(parseLanding);
  const [screen, setScreen] = useState<Screen>(() =>
    landing.outcome === 'success' && landing.receiptId ? 'wait' : landing.outcome === 'failed' ? 'failed' : 'unknown',
  );
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      if (window.location.search) window.history.replaceState(null, '', window.location.pathname);
    } catch {
      // best effort
    }
    if (landing.outcome !== 'success' || !landing.receiptId) return;
    const win = window as unknown as JoinWindow;
    void fireJoinSignup(win, landing.receiptId, {
      expected: expectedTrackers(win, { ga: GA_MEASUREMENT_ID, meta: META_PIXEL_ID, x: X_PIXEL_ID }),
      navigate: (url) => window.location.replace(url),
      doneUrl: JOIN_DONE_URL,
      xEventId: X_SIGNUP_EVENT_ID,
    }).then((result) => {
      if (result === 'already') setScreen('already');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per page load on purpose
  }, []);

  if (screen === 'wait') return <JoinSkeleton />;

  const door = (
    <a
      href={LOGIN_URL}
      className="block text-center text-[14px] font-semibold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]"
      style={{ fontFamily: FONT_DISPLAY, letterSpacing: '0.04em', padding: '14px 24px', minWidth: 220 }}
    >
      LOG IN TO SHARPMONEY
    </a>
  );

  return (
    <JoinSkeleton>
      {screen === 'failed' ? (
        <>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 17, color: '#fca5a5' }}>Whop could not complete the join.</p>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, color: '#9ca3af' }}>
            Nothing was charged. You can try again from the home page, or use the full signup page.
          </p>
          <a href="/#join" className="text-[#22d3ee] hover:text-[#67e8f9]" style={{ fontFamily: FONT_BODY, fontSize: 15, textDecoration: 'underline' }}>
            Back to the join box
          </a>
          <a href={CORE_SIGNUP_FALLBACK} className="text-[#9ca3af] hover:text-[#22d3ee]" style={{ fontFamily: FONT_BODY, fontSize: 14, textDecoration: 'underline' }}>
            Open secure signup
          </a>
        </>
      ) : (
        <>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 17, color: '#e5e7eb' }}>
            {screen === 'already' ? 'Your free account is ready.' : 'We could not confirm the join from this page.'}
          </p>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, color: '#9ca3af' }}>
            Log in with the same Whop account you just used and you land on the tool.
          </p>
          {door}
        </>
      )}
    </JoinSkeleton>
  );
}
