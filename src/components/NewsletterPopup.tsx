"use client";

import { useState, useEffect } from "react";

const POPUP_DELAY_MS = 10_000;
const STORAGE_KEY = "sm_newsletter_popup_dismissed";
const DISMISS_DURATION_DAYS = 3;

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
      if (window._scq) {
        window._scq.push([
          "identify",
          {
            email: email,
            tags: ["website-newsletter", "newsletter-popup"],
            source: "website-newsletter-popup",
          },
        ]);
      }

      setStatus("success");
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
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl animate-fade-in-up">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="text-center py-2">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-white mb-3">
              You&apos;re on the list
            </h3>
            <p className="text-white/60 text-sm">
              Thanks for subscribing. Watch your inbox for +EV tips and SharpMoney
              updates.
            </p>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 bg-cyan/10 border border-cyan/30 text-cyan text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Newsletter
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 pr-8">
              Get weekly +EV insights
            </h3>
            <p className="text-white/50 text-sm mb-6">
              SharpMoney tools, line movement ideas, and betting education — no
              spam, unsubscribe anytime.
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
                className="w-full py-3 bg-gradient-to-r from-cyan to-blue-500 rounded-xl font-semibold text-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === "loading" ? "Submitting..." : "Subscribe"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-400 text-xs text-center mt-3">
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
