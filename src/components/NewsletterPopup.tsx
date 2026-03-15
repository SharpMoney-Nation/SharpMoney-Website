"use client";

import { useState, useEffect } from "react";

const POPUP_DELAY_MS = 5000; // 5 seconds
const STORAGE_KEY = "sm_newsletter_dismissed";
const DISMISS_DURATION_DAYS = 14; // Don't show again for 2 weeks after dismiss

// Extend window for SendX global
declare global {
  interface Window {
    _scq?: Array<[string, ...unknown[]]>;
  }
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    // Check if user already dismissed or subscribed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DURATION_DAYS) return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      // Use SendX JavaScript API to identify/subscribe the contact
      if (window._scq) {
        window._scq.push([
          "identify",
          {
            email: email,
            tags: ["website-newsletter"],
            source: "website-popup",
          },
        ]);
      }

      setStatus("success");
      // Never show popup again after successful subscribe
      localStorage.setItem(
        STORAGE_KEY,
        (Date.now() + 1000 * 60 * 60 * 24 * 365).toString()
      );
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={status === "success" ? undefined : handleDismiss}
      />

      {/* Popup */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {status === "success" ? (
          // Success state — show bracket link + password directly
          <div className="text-center py-2">
            <div className="text-4xl mb-3">🏀</div>
            <h3 className="text-xl font-bold text-white mb-4">
              You&apos;re in! Here&apos;s your bracket info.
            </h3>

            {/* Bracket Link */}
            <div className="text-left mb-3">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Bracket Link
              </p>
              <a
                href="https://fantasy.espn.com/games/tournament-challenge-bracket-2026/group?id=a3e38d20-7b66-4484-8de6-243ab5ede8c0&joinKey=6715ac66-893a-32d3-99f9-8e651a4b5823&joining=true"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cyan text-sm hover:bg-white/10 transition-colors break-all"
              >
                Join the bracket on ESPN →
              </a>
            </div>

            {/* Password */}
            <div className="text-left mb-4">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Password
              </p>
              <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                <code className="text-cyan text-base font-bold font-mono">
                  Sharpmoney2024
                </code>
              </div>
            </div>

            {/* Prizes */}
            <div className="flex justify-center gap-5 mb-4 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-xl">🥇</div>
                <p className="text-white font-bold text-sm">$250</p>
              </div>
              <div className="text-center">
                <div className="text-xl">🥈</div>
                <p className="text-white/70 font-medium text-sm">T-Shirt</p>
              </div>
              <div className="text-center">
                <div className="text-xl">🥉</div>
                <p className="text-white/70 font-medium text-sm">T-Shirt</p>
              </div>
            </div>

            <p className="text-amber-400 text-xs mb-4">
              ⏰ Brackets lock Thursday, 3/19 at 12:15 PM ET
            </p>

            <a
              href="https://fantasy.espn.com/games/tournament-challenge-bracket-2026/group?id=a3e38d20-7b66-4484-8de6-243ab5ede8c0&joinKey=6715ac66-893a-32d3-99f9-8e651a4b5823&joining=true"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-gradient-to-r from-cyan to-blue rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity text-center"
            >
              Fill Out Your Bracket Now
            </a>
          </div>
        ) : (
          // Form state
          <>
            {/* Icon */}
            <div className="text-center mb-1">
              <span className="text-3xl">🏀</span>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Free March Madness Bracket
            </h3>

            {/* Prize breakdown */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl">🥇</div>
                <p className="text-white font-bold text-sm">$250</p>
              </div>
              <div className="text-center">
                <div className="text-2xl">🥈</div>
                <p className="text-white/80 font-medium text-sm">T-Shirt</p>
              </div>
              <div className="text-center">
                <div className="text-2xl">🥉</div>
                <p className="text-white/80 font-medium text-sm">T-Shirt</p>
              </div>
            </div>

            <p className="text-white/60 text-sm text-center mb-5">
              Enter your email to get the bracket link &amp; password.
              You&apos;ll also join our newsletter for weekly +EV tips and
              promos.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-gradient-to-r from-cyan to-blue rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === "loading"
                  ? "Submitting..."
                  : "Get the Bracket Link"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-400 text-xs text-center mt-3">
                Something went wrong. Please try again.
              </p>
            )}

            <p className="text-white/30 text-xs text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
