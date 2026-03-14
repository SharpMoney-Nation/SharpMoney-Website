import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Results & Reviews",
  description:
    "See real results from SharpMoney members. Verified profit screenshots, ROI stats, and honest reviews from bettors using our +EV tools to beat the market.",
  keywords: [
    "sports betting results",
    "+EV betting results",
    "sharp betting profits",
    "sports betting ROI",
    "SharpMoney reviews",
    "betting tool reviews",
    "profitable sports betting",
  ],
  openGraph: {
    title: "Member Results & Reviews | SharpMoney",
    description:
      "Real results from real members. See verified profit screenshots and reviews from bettors using SharpMoney +EV tools.",
    url: "https://www.betsharpmoney.com/results",
  },
  twitter: {
    title: "Member Results & Reviews | SharpMoney",
    description:
      "Real results from real members. Verified profit screenshots and reviews from SharpMoney +EV bettors.",
  },
  alternates: {
    canonical: "https://www.betsharpmoney.com/results",
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
