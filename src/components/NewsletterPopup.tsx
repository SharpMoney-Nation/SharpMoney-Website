"use client";

import { useState, useEffect } from "react";

const POPUP_DELAY_MS = 30000; // 30 seconds
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
        onClick={handleDismiss}
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
          // Success state
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">
              You&apos;re in!
            </h3>
            <p className="text-white/60 text-sm">
              Check your inbox for a welcome email. We&apos;ll keep you updated
              with weekly +EV tips, promos, and industry news.
            </p>
            <button
              onClick={handleDismiss}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          // Form state
          <>
            {/* Icon */}
            <div className="text-center mb-1">
              <span className="text-3xl">📬</span>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Join the SharpMoney Newsletter
            </h3>

            <p className="text-white/60 text-sm text-center mb-6">
              Get weekly +EV betting tips, strategy breakdowns, exclusive
              promos, and industry news — straight to your inbox. Free forever.
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
                  ? "Subscribing..."
                  : "Subscribe — It's Free"}
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
