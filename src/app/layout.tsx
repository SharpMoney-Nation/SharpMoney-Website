import type { Metadata } from "next";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Russo_One,
  Roboto_Condensed,
  IBM_Plex_Mono,
} from "next/font/google";
import Script from "next/script";
import NewsletterPopup from "@/components/NewsletterPopup";
import { GATE_SCRIPT } from "@/lib/trackingGate";
import "./globals.css";

// ============================================================================
// Google Analytics - Replace with your Measurement ID
// Get yours at: https://analytics.google.com
// ============================================================================
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-N8L0PFJG7E";

// Meta Pixel (Meta ads). `??` so an empty env value turns it off.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2003711714365829";

// X Pixel (X ads). Same `??` off switch.
const X_PIXEL_ID = process.env.NEXT_PUBLIC_X_PIXEL_ID ?? "r8vgq";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Landing v2 typefaces (applied on the homepage; inner pages keep Space Grotesk)
const russoOne = Russo_One({
  variable: "--font-russo",
  subsets: ["latin"],
  weight: ["400"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-cond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.betsharpmoney.com"),
  title: {
    default: "SharpMoney | +EV Sports Betting Tools & Calculators",
    template: "%s | SharpMoney",
  },
  description:
    "SharpMoney Core is free. Join with your email, no credit card, and get live +EV bets across 20+ sportsbooks.",
  keywords: [
    "sports betting",
    "+EV betting",
    "sharp betting",
    "betting tools",
    "odds comparison",
    "line movement",
    "EV calculator",
    "no vig calculator",
    "odds converter",
    "kelly criterion calculator",
    "hedge calculator",
    "arbitrage calculator",
    "parlay calculator",
    "bankroll simulator",
    "sports betting calculators",
    "plus EV betting",
    "sharp money",
    "sharpmoney",
  ],
  authors: [{ name: "SharpMoney" }],
  creator: "SharpMoney",
  publisher: "SharpMoney",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "SharpMoney | +EV Sports Betting Tools & Calculators",
    description:
      "SharpMoney Core is free. Join with your email, no credit card, and get live +EV bets across 20+ sportsbooks.",
    type: "website",
    url: "https://www.betsharpmoney.com",
    siteName: "SharpMoney",
    images: [
      {
        url: "/logo.jpg",
        width: 200,
        height: 200,
        alt: "SharpMoney Logo",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "SharpMoney | +EV Sports Betting Tools",
    description:
      "SharpMoney Core is free. Join with your email, no credit card, and get live +EV bets across 20+ sportsbooks.",
    site: "@BetSharpMoney",
    creator: "@BetSharpMoney",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.betsharpmoney.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${russoOne.variable} ${robotoCondensed.variable} ${ibmPlexMono.variable} antialiased bg-black text-white`}
      >
        {children}

        {/* Newsletter Popup — after 10s delay; see NewsletterPopup.tsx (SendX may add separate widgets in dashboard). */}
        <NewsletterPopup />

        {/* Tracking gate — must stay the first script. Sets window.__smTrack;
            every pixel below loads only when it is true (real site, public
            page, real browser). See src/lib/trackingGate.ts. */}
        <Script id="tracking-gate" strategy="beforeInteractive">
          {GATE_SCRIPT}
        </Script>

        {/* SendX Tracking & Email */}
        <Script id="sendx-tracking" strategy="afterInteractive">
          {`
            if (window.__smTrack) {
            var _scq = window._scq || [];
            var _scs = window._scs || {};
            _scs.teamId = "jR3BXCsQyZ0ivw5WbkbFUH";
            window._scq = _scq;
            window._scs = _scs;

            (function() {
              var dc = document.createElement('script');
              dc.type = 'text/javascript';
              dc.async = true;
              dc.src = '//cdn.sendx.io/prod/jR3BXCsQyZ0ivw5WbkbFUH.js';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(dc, s);
            })();
            }
          `}
        </Script>

        {/* Whop Pixel — ties page visits to purchases made in the app's
            embedded checkout (app.betsharpmoney.com /signup). Snippet verbatim
            from https://docs.whop.com/developer/guides/pixel; biz id is the
            public SharpMoney company id. */}
        <Script id="whop-pixel" strategy="beforeInteractive">
          {`
            if (window.__smTrack) {
            !function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");
            whop.setScope("biz_lbUgwQ0bQ8BxtD");
            whop.track("page");
            }
          `}
        </Script>

        {/* Meta Pixel — page views for Meta ads. Snippet verbatim from Meta
            Events Manager. Set NEXT_PUBLIC_META_PIXEL_ID="" to turn it off. */}
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                if (window.__smTrack) {
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
                }
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}

        {/* X Pixel — page visits for X ads. Base code verbatim from X Ads
            Manager, plus the "Page view" event (tw-r8vgq-rg6om).
            Set NEXT_PUBLIC_X_PIXEL_ID="" to turn it off. */}
        {X_PIXEL_ID && (
          <Script id="x-pixel" strategy="afterInteractive">
            {`
              if (window.__smTrack) {
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('config','${X_PIXEL_ID}');
              twq('event', 'tw-r8vgq-rg6om', {});
              }
            `}
          </Script>
        )}

        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            {/* gtag.js is injected by the snippet (not a src <Script>) so
                it never loads on untracked pages. */}
            <Script id="google-analytics" strategy="beforeInteractive">
              {`
                if (!window.__smTrack) {
                  window['ga-disable-${GA_MEASUREMENT_ID}'] = true;
                } else {
                (function(d){var g=d.createElement('script');g.async=true;
                g.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
                d.head.appendChild(g);})(document);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('consent', 'default', {
                  analytics_storage: 'granted'
                });
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_title: document.title,
                  send_page_view: true
                });
                }
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
