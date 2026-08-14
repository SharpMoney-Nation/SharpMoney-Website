import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import NewsletterPopup from "@/components/NewsletterPopup";
import "./globals.css";

// ============================================================================
// Google Analytics - Replace with your Measurement ID
// Get yours at: https://analytics.google.com
// ============================================================================
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-N8L0PFJG7E";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.betsharpmoney.com"),
  title: {
    default: "SharpMoney | +EV Sports Betting Tools & Calculators",
    template: "%s | SharpMoney",
  },
  description:
    "Professional-grade +EV betting tools. Free betting calculators, odds converter, EV calculator, no-vig calculator, and more. Find value before the market moves.",
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
      "Stop guessing. Follow the market. Professional-grade +EV betting tools and free calculators.",
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
      "Professional-grade +EV betting tools and free calculators. Find value before the market moves.",
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}
      >
        {children}

        {/* Newsletter Popup — after 10s delay; see NewsletterPopup.tsx (SendX may add separate widgets in dashboard). */}
        <NewsletterPopup />

        {/* SendX Tracking & Email */}
        <Script id="sendx-tracking" strategy="afterInteractive">
          {`
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
          `}
        </Script>

        {/* Whop Pixel — ties page visits to purchases made in the app's
            embedded checkout (sharpmoney-whop-app /signup). Snippet verbatim
            from https://docs.whop.com/developer/guides/pixel; biz id is the
            public SharpMoney company id. */}
        <Script id="whop-pixel" strategy="beforeInteractive">
          {`
            !function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");
            whop.setScope("biz_lbUgwQ0bQ8BxtD");
            whop.track("page");
          `}
        </Script>

        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="beforeInteractive"
            />
            <Script id="google-analytics" strategy="beforeInteractive">
              {`
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
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
