import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectedTrackers, fireJoinSignup, resetJoinSignupGuard, type JoinWindow } from './joinEvents';
import { makeFakeWindow, runSnippet, type FakeWindow } from '@/test/layoutSnippets';

// The fake window runs the REAL pixel snippets from layout.tsx (see
// src/test/layoutSnippets.ts), so the stubs read as placed-but-not-delivered
// exactly as in a cold browser page, until the test "loads" each library.

const X_EVENT = 'tw-r8vgq-rg6ou';
let seq = 0;
const receipt = () => `pay_test${String(++seq).padStart(8, '0')}`;

type Fake = FakeWindow & JoinWindow & {
  dataLayer?: unknown[];
  fbq?: JoinWindow['fbq'];
  twq?: JoinWindow['twq'];
  whop?: JoinWindow['whop'];
};

function storage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => (m.has(k) ? m.get(k)! : null), setItem: (k: string, v: string) => void m.set(k, v) };
}

function coldWindow(opts: { tracked?: boolean; ids?: string[] } = {}): Fake {
  const win = makeFakeWindow(opts.tracked ?? true) as Fake;
  win.localStorage = storage();
  for (const id of opts.ids ?? ['google-analytics', 'whop-pixel', 'meta-pixel', 'x-pixel']) runSnippet(win, id);
  return win;
}

// Simulate the vendor libraries loading.
function loadGtag(win: Fake) {
  // gtag.js answers event_callback for our sign_up entry (the stub only pushed to dataLayer).
  const entry = (win.dataLayer ?? []).find((e) => (e as IArguments)[0] === 'event' && (e as IArguments)[1] === 'sign_up') as IArguments | undefined;
  expect(entry, 'sign_up placed into dataLayer').toBeTruthy();
  (entry![2] as { event_callback: () => void }).event_callback();
}
function loadFbevents(win: Fake, drain = true) {
  const f = win.fbq!;
  f.callMethod = () => undefined;
  if (drain) (f.queue as unknown[]).length = 0;
}
function loadUwt(win: Fake) {
  win.twq!.exe = () => undefined;
}
function loadWhopPixel(win: Fake) {
  win.whop!.started = true;
}

function deps(win: Fake, over: Partial<Parameters<typeof fireJoinSignup>[2]> = {}) {
  const navigate = vi.fn();
  return {
    navigate,
    d: {
      expected: expectedTrackers(win, { ga: 'G-TEST1234', meta: '1234567890', x: 'r8vgq' }),
      navigate,
      doneUrl: 'https://app.example/door',
      xEventId: X_EVENT,
      ...over,
    },
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  resetJoinSignupGuard();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('the real stubs are placed-but-not-delivered on a cold page', () => {
  it('evaluates all four snippets onto the fake window', () => {
    const win = coldWindow();
    expect(typeof win.gtag).toBe('function');
    expect(typeof win.fbq).toBe('function');
    expect(typeof win.twq).toBe('function');
    expect(typeof win.whop?.track).toBe('function');
    expect((win.fbq as { loaded?: boolean }).loaded).toBe(true); // the stub sets this ITSELF: never a delivery marker
    expect(win.fbq!.callMethod).toBeUndefined();
    expect(win.twq!.exe).toBeUndefined();
    expect(win.whop!.started).toBeUndefined();
    expect(win.injected.some((s) => s.includes('googletagmanager.com/gtag/js'))).toBe(true);
    expect(win.injected.some((s) => s.includes('t.whop.tw/s.js'))).toBe(true);
  });
});

describe('fireJoinSignup', () => {
  it('places all four calls with the right ids and no email, then leaves once after delivery + grace', async () => {
    const win = coldWindow();
    const id = receipt();
    const { d, navigate } = deps(win);
    const p = fireJoinSignup(win, id, d);
    await vi.advanceTimersByTimeAsync(0);
    const meta = (win.fbq!.queue as IArguments[]).find((a) => a[0] === 'track' && a[1] === 'CompleteRegistration');
    expect(meta && [...meta]).toEqual(['track', 'CompleteRegistration', { content_name: 'core_free' }, { eventID: id }]);
    // the layout's own snippet queues a page-view event too; find OUR sign-up entry
    const x = (win.twq as unknown as { queue: IArguments[] }).queue.find((a) => a[0] === 'event' && a[1] === X_EVENT);
    expect(x && [...x]).toEqual(['event', X_EVENT, { conversion_id: id }]);
    const w = (win.whop as unknown as { q: unknown[][] }).q.find((a) => a[1] === 'complete_registration');
    expect(w && w.slice(1)).toEqual(['complete_registration', { event_id: id }]);
    const ga = (win.dataLayer as IArguments[]).find((a) => a[0] === 'event' && a[1] === 'sign_up');
    expect(ga![2]).toMatchObject({ method: 'whop_embed', transport_type: 'beacon' });
    expect(JSON.stringify([...(win.whop as unknown as { q: unknown[][] }).q])).not.toMatch(/email/);
    // libraries arrive late (400 ms), then delivery; leave after the Meta grace (400 ms), before the 3 s cap
    await vi.advanceTimersByTimeAsync(400);
    expect(navigate).not.toHaveBeenCalled();
    loadGtag(win); loadFbevents(win); loadUwt(win); loadWhopPixel(win);
    await vi.advanceTimersByTimeAsync(350);
    expect(navigate).not.toHaveBeenCalled(); // inside the grace
    await vi.advanceTimersByTimeAsync(150);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('https://app.example/door');
    const summary = await p;
    expect(summary).toMatchObject({ left: 'delivered' });
    expect((summary as { delivered: string[] }).delivered.sort()).toEqual(['ga', 'meta', 'whop', 'x']);
  });

  it('leaves at the cap when a library never loads, exactly once', async () => {
    const win = coldWindow();
    const { d, navigate } = deps(win);
    const p = fireJoinSignup(win, receipt(), d);
    await vi.advanceTimersByTimeAsync(0);
    loadGtag(win); loadUwt(win); loadWhopPixel(win); // Meta never loads
    await vi.advanceTimersByTimeAsync(2990);
    expect(navigate).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(20);
    expect(navigate).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(5000);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(await p).toMatchObject({ left: 'cap' });
  });

  it("Meta: the stub's own loaded=true never counts; callMethod with a non-empty queue is not delivered until the queue drains", async () => {
    const win = coldWindow();
    const { d, navigate } = deps(win);
    const p = fireJoinSignup(win, receipt(), d);
    await vi.advanceTimersByTimeAsync(0);
    loadGtag(win); loadUwt(win); loadWhopPixel(win);
    loadFbevents(win, false); // config lock: callMethod set, queue still holds our call
    await vi.advanceTimersByTimeAsync(1500);
    expect(navigate).not.toHaveBeenCalled();
    (win.fbq!.queue as unknown[]).length = 0; // unlock + drain
    await vi.advanceTimersByTimeAsync(450);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(await p).toMatchObject({ left: 'delivered' });
  });

  it('waits for Meta and X stubs that are injected AFTER the run starts (expected set from fixed facts)', async () => {
    const win = coldWindow({ ids: ['google-analytics', 'whop-pixel'] });
    const { d, navigate } = deps(win);
    const p = fireJoinSignup(win, receipt(), d);
    await vi.advanceTimersByTimeAsync(0);
    loadGtag(win); loadWhopPixel(win);
    await vi.advanceTimersByTimeAsync(100);
    expect(navigate).not.toHaveBeenCalled();
    runSnippet(win, 'meta-pixel'); runSnippet(win, 'x-pixel'); // late inline scripts
    await vi.advanceTimersByTimeAsync(100);
    expect((win.fbq!.queue as IArguments[]).some((a) => a[1] === 'CompleteRegistration')).toBe(true);
    loadFbevents(win); loadUwt(win);
    await vi.advanceTimersByTimeAsync(450);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect((await p) as { placed: string[] }).toMatchObject({ left: 'delivered' });
  });

  it('untracked host: nothing placed, leaves at once', async () => {
    const win = coldWindow({ tracked: false, ids: [] });
    const { d, navigate } = deps(win);
    expect(d.expected).toEqual([]);
    const p = fireJoinSignup(win, receipt(), d);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(await p).toEqual({ placed: [], delivered: [], left: 'none' });
  });

  it('second call with the same receipt is "already" and never touches the first run', async () => {
    const win = coldWindow();
    const id = receipt();
    const { d, navigate } = deps(win);
    const first = fireJoinSignup(win, id, d);
    const second = await fireJoinSignup(win, id, d);
    expect(second).toBe('already');
    await vi.advanceTimersByTimeAsync(0);
    loadGtag(win); loadFbevents(win); loadUwt(win); loadWhopPixel(win);
    await vi.advanceTimersByTimeAsync(600);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect((win.fbq!.queue as unknown[]).length).toBe(0);
    await first;
    // a fresh page run (new module memory) still sees the storage key
    resetJoinSignupGuard();
    expect(await fireJoinSignup(win, id, d)).toBe('already');
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('storage that throws counts as first-time: events placed, navigate exactly once', async () => {
    const win = coldWindow();
    win.localStorage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    const { d, navigate } = deps(win);
    const p = fireJoinSignup(win, receipt(), d);
    await vi.advanceTimersByTimeAsync(0);
    expect((win.fbq!.queue as IArguments[]).some((a) => a[1] === 'CompleteRegistration')).toBe(true);
    loadGtag(win); loadFbevents(win); loadUwt(win); loadWhopPixel(win);
    await vi.advanceTimersByTimeAsync(600);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(await p).toMatchObject({ left: 'delivered' });
  });

  it('GA not expected (no GA id) with the others expected: leaves when the others are delivered', async () => {
    const win = coldWindow({ ids: ['whop-pixel', 'meta-pixel', 'x-pixel'] });
    const expected = expectedTrackers(win, { ga: '', meta: '1234567890', x: 'r8vgq' });
    expect(expected.sort()).toEqual(['meta', 'whop', 'x']);
    const { d, navigate } = deps(win, { expected });
    const p = fireJoinSignup(win, receipt(), d);
    await vi.advanceTimersByTimeAsync(0);
    loadFbevents(win); loadUwt(win); loadWhopPixel(win);
    await vi.advanceTimersByTimeAsync(450);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(await p).toMatchObject({ left: 'delivered' });
  });
});

describe('expectedTrackers', () => {
  it('needs the tracked-host flag and the configured ids', () => {
    expect(expectedTrackers({ __smTrack: true }, { ga: 'G', meta: '', x: 'r' }).sort()).toEqual(['ga', 'whop', 'x']);
    expect(expectedTrackers({ __smTrack: undefined }, { ga: 'G', meta: 'M', x: 'r' })).toEqual([]);
    expect(expectedTrackers({ __smTrack: false }, { ga: 'G', meta: 'M', x: 'r' })).toEqual([]);
  });
});
