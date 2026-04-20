import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function MarketingDashboardLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-white/40 text-sm">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
