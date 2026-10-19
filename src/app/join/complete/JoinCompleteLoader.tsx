'use client';

import nextDynamic from 'next/dynamic';
import { JoinSkeleton } from './JoinSkeleton';

// The client reads window.location and localStorage, so it must never run at
// build time: ssr:false keeps the static prerender as the skeleton and avoids
// a hydration mismatch (plan Phase 4; pinned by src/lib/legacyEmbedGone.test.ts).
const JoinCompleteClient = nextDynamic(() => import('./JoinCompleteClient'), {
  ssr: false,
  loading: () => <JoinSkeleton />,
});

export default function JoinCompleteLoader() {
  return <JoinCompleteClient />;
}
