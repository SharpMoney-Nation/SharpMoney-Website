import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Betting Calculators & Tools",
  description:
    "10 free professional-grade sports betting calculators. EV calculator, no-vig calculator, odds converter, Kelly Criterion, hedge calculator, arbitrage calculator, parlay calculator, and more. No sign-up required.",
  keywords: [
    "EV calculator",
    "expected value calculator",
    "no vig calculator",
    "devig calculator",
    "odds converter",
    "kelly criterion calculator",
    "hedge calculator",
    "arbitrage calculator",
    "parlay calculator",
    "hold calculator",
    "bankroll simulator",
    "sports betting calculator",
    "betting tools",
    "free betting calculators",
    "+EV calculator",
    "plus EV calculator",
  ],
  openGraph: {
    title: "Free Betting Calculators & Tools | SharpMoney",
    description:
      "10 free professional-grade sports betting calculators. EV, no-vig, odds converter, Kelly, hedge, arbitrage, parlay, and more.",
    url: "https://www.betsharpmoney.com/tools",
  },
  twitter: {
    title: "Free Betting Calculators & Tools | SharpMoney",
    description:
      "10 free sports betting calculators — EV, no-vig, odds converter, Kelly, hedge, arb, parlay & more. No sign-up required.",
  },
  alternates: {
    canonical: "https://www.betsharpmoney.com/tools",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
