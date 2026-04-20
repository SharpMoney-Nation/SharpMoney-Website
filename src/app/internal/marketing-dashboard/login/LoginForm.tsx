"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const sp = useSearchParams();
  const nextPath = sp.get("next") || "/internal/marketing-dashboard";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/internal/marketing-dashboard/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed");
        return;
      }
      window.location.href = nextPath;
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-white/10 rounded-2xl p-8 bg-[#0a0a0a]">
        <p className="text-xs text-cyan font-semibold tracking-wider uppercase mb-2">
          Internal
        </p>
        <h1 className="text-xl font-bold mb-1">Marketing dashboard</h1>
        <p className="text-white/50 text-sm mb-6">
          Enter the dashboard password from your team env.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-cyan/50"
            autoComplete="current-password"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
