import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotions & Partner Deals",
  description:
    "Exclusive sports betting promotions and partner deals for SharpMoney members. Deposit bonuses, cash back offers, and special discounts on betting tools and platforms.",
  keywords: [
    "sports betting promotions",
    "betting bonuses",
    "sportsbook deposit bonus",
    "betting deals",
    "NoVig promo",
    "EdgeBoost promo",
    "ProphetX promo",
    "Pikkit Pro discount",
    "sports betting offers",
  ],
  openGraph: {
    title: "Promotions & Partner Deals | SharpMoney",
    description:
      "Exclusive sports betting promotions and partner deals. Deposit bonuses, cash back, and special discounts.",
    url: "https://www.betsharpmoney.com/promotions",
  },
  twitter: {
    title: "Promotions & Partner Deals | SharpMoney",
    description:
      "Exclusive sports betting promos and partner deals. Deposit bonuses, cash back & more.",
  },
  alternates: {
    canonical: "https://www.betsharpmoney.com/promotions",
  },
};

export default function PromotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
