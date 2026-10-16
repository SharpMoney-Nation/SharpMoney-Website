// ============================================================================
// The sign-up events after an Elements join (plan: sharpmoney-whop-app
// tasks/plans/website-join-elements-plan.md, Phase 2).
//
// The old embed fired these from the home page, where every tracker library
// had loaded long before. The completion page is a COLD load: the Meta and X
// stubs are injected after the page's own effects, and gtag.js, fbevents.js,
// uwt.js and Whop's s.js are async downloads. So this module separates a call
// being PLACED (into a stub's queue, which the library replays) from the event
// being DELIVERED (the library is live and has taken it), waits for every
// EXPECTED tracker up to a cap, then leaves exactly once.
//
// Delivered markers (read from the real snippets and vendor scripts, 2026-10-16):
//   GA   the event_callback of our own sign_up event (gtag.js answers it only once loaded)
//   Meta typeof fbq.callMethod === 'function' AND fbq.queue drained: fbevents.js locks the
//        pixel config while it fetches it and re-queues every call until unlocked; the
//        stub's own `loaded = true` means nothing
//   X    typeof twq.exe === 'function' (uwt.js), its first send waits up to 200 ms + visibility
//   Whop whop.started === true (s.js replays the queue, replaces track, sends keepalive)
// The expected set comes from fixed facts (tracked host + configured ids), never from
// "which globals exist right now": a late stub is waited for, not skipped.
// ============================================================================

export type TrackerName = 'ga' | 'meta' | 'x' | 'whop';

type AnyFn = (...args: unknown[]) => unknown;

export interface JoinWindow {
  __smTrack?: boolean;
  gtag?: AnyFn;
  fbq?: AnyFn & { callMethod?: unknown; queue?: unknown; loaded?: unknown };
  twq?: AnyFn & { exe?: unknown };
  whop?: { track?: AnyFn; started?: unknown };
  localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void };
}

export interface JoinEventsDeps {
  /** Trackers this page must wait for (see expectedTrackers). */
  expected: TrackerName[];
  navigate: (url: string) => void;
  doneUrl: string;
  now?: () => number;
  setTimeout?: (fn: () => void, ms: number) => unknown;
  clearTimeout?: (handle: unknown) => void;
  /** Hard cap on the wait; navigation always happens by then. */
  capMs?: number;
  pollMs?: number;
  /** Grace after the last delivery for the libraries' own sends. */
  graceMs?: number;
  /** Meta's send is a cancellable Image GET: its own, longer grace. */
  metaGraceMs?: number;
  xEventId: string;
}

export interface JoinSummary {
  placed: TrackerName[];
  delivered: TrackerName[];
  left: 'delivered' | 'cap' | 'none';
}

export const JOIN_FIRED_KEY_PREFIX = 'sm_join_fired:';
const DEFAULT_CAP_MS = 3000;
const DEFAULT_POLL_MS = 50;
const DEFAULT_GRACE_MS = 300;
const DEFAULT_META_GRACE_MS = 400;

/** The trackers a tracked page is expected to deliver, from fixed facts only. */
export function expectedTrackers(
  win: Pick<JoinWindow, '__smTrack'>,
  ids: { ga: string; meta: string; x: string },
): TrackerName[] {
  if (win.__smTrack !== true) return [];
  const out: TrackerName[] = ['whop'];
  if (ids.ga) out.push('ga');
  if (ids.meta) out.push('meta');
  if (ids.x) out.push('x');
  return out;
}

/** In-memory once-guard: a second call in the same page run (StrictMode, re-render) never touches the first. */
const startedReceipts = new Set<string>();

function storageHas(win: JoinWindow, key: string): boolean {
  try {
    return win.localStorage?.getItem(key) !== null && win.localStorage?.getItem(key) !== undefined;
  } catch {
    return false; // blocked storage counts as first-time; the ids dedupe on Meta/X/Whop
  }
}

function storageSet(win: JoinWindow, key: string): void {
  try {
    win.localStorage?.setItem(key, String(Date.now()));
  } catch {
    // best effort
  }
}

export function fireJoinSignup(win: JoinWindow, receiptId: string, deps: JoinEventsDeps): Promise<JoinSummary | 'already'> {
  const key = JOIN_FIRED_KEY_PREFIX + receiptId;
  if (startedReceipts.has(receiptId) || storageHas(win, key)) return Promise.resolve('already');
  startedReceipts.add(receiptId);
  storageSet(win, key);

  const now = deps.now ?? (() => Date.now());
  const setT = deps.setTimeout ?? ((fn, ms) => setTimeout(fn, ms));
  const clearT = deps.clearTimeout ?? ((h) => clearTimeout(h as ReturnType<typeof setTimeout>));
  const capMs = deps.capMs ?? DEFAULT_CAP_MS;
  const pollMs = deps.pollMs ?? DEFAULT_POLL_MS;
  const graceMs = deps.graceMs ?? DEFAULT_GRACE_MS;
  const metaGraceMs = deps.metaGraceMs ?? DEFAULT_META_GRACE_MS;
  const expected = new Set<TrackerName>(deps.expected);

  const placed: TrackerName[] = [];
  const deliveredAt = new Map<TrackerName, number>();
  let gaCallbackFired = false;

  return new Promise<JoinSummary>((resolve) => {
    let left: JoinSummary['left'] | null = null;
    let pollHandle: unknown = null;
    const leave = (how: JoinSummary['left']) => {
      if (left) return;
      left = how;
      if (pollHandle !== null) clearT(pollHandle);
      try {
        deps.navigate(deps.doneUrl);
      } finally {
        resolve({ placed: [...placed], delivered: [...deliveredAt.keys()], left: how });
      }
    };

    if (expected.size === 0) {
      leave('none');
      return;
    }

    // The cap is armed FIRST: nothing below can cancel it, so the buyer always moves on.
    setT(() => leave('cap'), capMs);

    const place = (name: TrackerName): boolean => {
      try {
        if (name === 'ga') {
          if (typeof win.gtag !== 'function') return false;
          win.gtag('event', 'sign_up', {
            method: 'whop_embed',
            transport_type: 'beacon',
            event_timeout: capMs,
            event_callback: () => {
              gaCallbackFired = true;
            },
          });
        } else if (name === 'meta') {
          if (typeof win.fbq !== 'function') return false;
          win.fbq('track', 'CompleteRegistration', { content_name: 'core_free' }, { eventID: receiptId });
        } else if (name === 'x') {
          if (typeof win.twq !== 'function') return false;
          win.twq('event', deps.xEventId, { conversion_id: receiptId });
        } else {
          if (typeof win.whop?.track !== 'function') return false;
          win.whop.track('complete_registration', { event_id: receiptId });
        }
        return true;
      } catch {
        return true; // a throwing tracker counts as placed; its delivery marker decides the rest
      }
    };

    const delivered = (name: TrackerName): boolean => {
      if (name === 'ga') return gaCallbackFired;
      if (name === 'meta') {
        const f = win.fbq;
        return typeof f?.callMethod === 'function' && Array.isArray(f.queue) && f.queue.length === 0;
      }
      if (name === 'x') return typeof win.twq?.exe === 'function';
      return win.whop?.started === true;
    };

    const tick = () => {
      if (left) return;
      const t = now();
      for (const name of expected) {
        if (!placed.includes(name) && place(name)) placed.push(name);
        if (placed.includes(name) && !deliveredAt.has(name) && delivered(name)) deliveredAt.set(name, t);
      }
      if (deliveredAt.size === expected.size) {
        let readyAt = 0;
        for (const [name, at] of deliveredAt) readyAt = Math.max(readyAt, at + (name === 'meta' ? metaGraceMs : graceMs));
        if (t >= readyAt) {
          leave('delivered');
          return;
        }
      }
      pollHandle = setT(tick, pollMs);
    };
    tick();
  });
}

/** Test seam: forget the in-memory once-guard. */
export function resetJoinSignupGuard(): void {
  startedReceipts.clear();
}
