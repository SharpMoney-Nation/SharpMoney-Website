import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betting Academy — Free +EV Betting Course",
  description:
    "Learn +EV sports betting from scratch with the SharpMoney Betting Academy. Free 12-video course covering expected value, no-vig pricing, line movement, bankroll management, and profitable betting strategies.",
  robots: {
    index: false,
    follow: false,
  },
  keywords: [
    "+EV betting course",
    "sports betting course",
    "learn sports betting",
    "expected value betting",
    "how to bet on sports",
    "profitable sports betting",
    "sports betting strategy",
    "betting academy",
    "free betting course",
    "plus EV betting tutorial",
    "sharp betting course",
    "line movement",
    "bankroll management",
  ],
  openGraph: {
    title: "Betting Academy — Free +EV Betting Course | SharpMoney",
    description:
      "Learn +EV sports betting from scratch. Free 12-video course covering expected value, line movement, and profitable strategies.",
    url: "https://www.betsharpmoney.com/course",
  },
  twitter: {
    title: "Betting Academy — Free +EV Course | SharpMoney",
    description:
      "Free 12-video course on +EV sports betting. Learn expected value, no-vig pricing, line movement & bankroll management.",
  },
  alternates: {
    canonical: "https://www.betsharpmoney.com/course",
  },
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
