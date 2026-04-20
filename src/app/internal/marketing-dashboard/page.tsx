import MarketingDashboardClient from "./MarketingDashboardClient";

export const metadata = {
  title: "Marketing dashboard | Internal",
  robots: { index: false, follow: false },
};

export default function MarketingDashboardPage() {
  return <MarketingDashboardClient />;
}
