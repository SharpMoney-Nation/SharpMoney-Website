import type { Metadata } from 'next';
import JoinCompleteLoader from './JoinCompleteLoader';

// ============================================================================
// /join/complete — where a finished Elements join lands (the Core checkout
// configuration's redirect_url). The browser-only client (parse the landing,
// fire the sign-up events, hop to the app) is loaded with ssr:false by the
// loader, so this static page is only the skeleton. Never indexed, never in
// the sitemap (src/app/sitemap.ts lists pages explicitly).
// ============================================================================

export const metadata: Metadata = {
  title: 'Setting up your account | SharpMoney',
  robots: { index: false, follow: false },
};

// The trackers' send hosts: connect early so the cold page delivers its
// sign-up events inside the wait (src/lib/joinEvents.ts).
const PRECONNECT = [
  'https://www.googletagmanager.com',
  'https://region1.google-analytics.com',
  'https://connect.facebook.net',
  'https://www.facebook.com',
  'https://static.ads-twitter.com',
  'https://analytics.twitter.com',
  'https://t.co',
  'https://t.whop.tw',
];

export default function JoinCompletePage() {
  return (
    <>
      {PRECONNECT.map((href) => (
        <link key={href} rel="preconnect" href={href} />
      ))}
      <JoinCompleteLoader />
    </>
  );
}
