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

        {/* Newsletter Popup — shows after 30s, once per visitor */}
        <NewsletterPopup />

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
