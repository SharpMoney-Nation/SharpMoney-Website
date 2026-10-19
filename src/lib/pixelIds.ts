// ============================================================================
// The pixel ids, shared by layout.tsx (which renders the snippets) and the
// join completion page (which decides WHICH trackers to wait for before it
// leaves). One source so the two can never disagree about what is on.
//   GA: `||` so an empty value falls back to the site id.
//   Meta / X: `??` so an empty env value turns the pixel OFF.
// ============================================================================

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-N8L0PFJG7E';

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '2003711714365829';

export const X_PIXEL_ID = process.env.NEXT_PUBLIC_X_PIXEL_ID ?? 'r8vgq';

/** X "Sign up" event (type Lead) in X Events Manager; the id the join box has always fired. */
export const X_SIGNUP_EVENT_ID = 'tw-r8vgq-rg6ou';
