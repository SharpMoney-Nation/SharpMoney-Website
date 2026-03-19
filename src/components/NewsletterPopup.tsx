"use client";

import { useState, useEffect } from "react";

const POPUP_DELAY_MS = 20000; // 20 seconds
const STORAGE_KEY = "sm_promo_dismissed";
const DISMISS_DURATION_DAYS = 3; // Don't show again for 3 days after dismiss

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
    // Check if user already dismissed
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
            tags: ["website-newsletter", "promo-popup", "bracket-contest"],
            source: "website-promo-popup",
          },
        ]);
      }

      setStatus("success");
      // Don't show popup again after successful subscribe
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
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl animate-fade-in-up">
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
          <div className="text-center py-2">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-white mb-3">
              You&apos;re on the list!
            </h3>
            <p className="text-white/60 text-sm mb-5">
              Use the code below at checkout to get 50% off your first month.
            </p>

            {/* Promo code */}
            <div className="bg-cyan/10 border-2 border-cyan/30 rounded-xl p-4 mb-5">
              <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Your promo code</p>
              <code className="text-cyan text-3xl font-bold font-mono tracking-widest">
                Madness50
              </code>
            </div>

            {/* March Madness Bracket */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">🏀</span>
                <h4 className="text-sm font-bold text-orange-400">March Madness Bracket Contest</h4>
              </div>
              <p className="text-white/60 text-xs mb-3">
                Fill out a bracket for a chance to win a <strong className="text-white">free month of Alpha</strong>. Open to all members — no purchase necessary.
              </p>
              <a
                href="https://whop.com/sharpmoney/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500/20 border border-orange-500/30 text-orange-400 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-orange-500/30 transition-colors"
              >
                Enter Your Bracket →
              </a>
            </div>

            {/* Plan links */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { name: "Core", price: "$14.99", href: "https://whop.com/sharpmoney/core-ae/" },
                { name: "Pro", price: "$39.99", href: "https://whop.com/sharpmoney/pro-7e/" },
                { name: "Alpha", price: "$99.99", href: "https://whop.com/sharpmoney/alpha-4e/" },
              ].map((plan) => (
                <a
                  key={plan.name}
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/5 border border-white/10 rounded-lg p-3 hover:border-cyan/40 hover:bg-cyan/5 transition-all text-center"
                >
                  <div className="text-xs text-white/50 mb-1">{plan.name}</div>
                  <div className="text-cyan font-bold">{plan.price}</div>
                  <div className="text-[10px] text-white/30">/first mo</div>
                </a>
              ))}
            </div>

            <a
              href="https://whop.com/sharpmoney/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-gradient-to-r from-cyan to-blue-500 rounded-xl font-semibold text-black text-sm hover:opacity-90 transition-opacity text-center"
            >
              Get Started Now →
            </a>

            <p className="text-white/30 text-xs mt-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Offer expires March 26, 2026
            </p>
          </div>
        ) : (
          // Form state — Promo popup
          <>
            {/* Event badges */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-orange-500/15 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full">
                🏀 March Madness
              </span>
              <span className="text-xs font-semibold bg-green-500/15 border border-green-500/30 text-green-400 px-3 py-1 rounded-full">
                ⚾ MLB Opening Day
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-1">
              <span className="text-white/30 line-through decoration-red-500/50">Full Price</span>{" "}
              <span className="bg-gradient-to-r from-cyan to-blue-400 bg-clip-text text-transparent">Half Off.</span>
            </h3>

            <p className="text-white/50 text-sm text-center mb-5">
              <strong className="text-white">50% off your first month</strong> — any plan. New &amp; returning members only.
            </p>

            {/* Pricing row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { name: "Core", old: "$29.99", price: "$14.99" },
                { name: "Pro", old: "$79.99", price: "$39.99", popular: true },
                { name: "Alpha", old: "$199.99", price: "$99.99" },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-lg p-3 text-center ${
                    plan.popular
                      ? "bg-cyan/10 border border-cyan/30"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <div className="text-[10px] font-bold text-cyan uppercase tracking-wider mb-1">Popular</div>
                  )}
                  <div className="text-xs text-white/50 mb-0.5">{plan.name}</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-white/20 line-through text-xs">{plan.old}</span>
                    <span className="text-lg font-bold text-cyan">{plan.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo code display */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Code</span>
              <span className="bg-cyan/10 border border-cyan/30 text-cyan font-bold text-sm tracking-widest px-4 py-1.5 rounded-lg">Madness50</span>
            </div>

            <p className="text-white/50 text-xs text-center mb-4">
              Drop your email to claim the deal, enter our 🏀 <strong className="text-orange-400">March Madness Bracket Contest</strong>, &amp; join our newsletter for weekly +EV tips.
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
                {status === "loading"
                  ? "Submitting..."
                  : "Claim 50% Off →"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-400 text-xs text-center mt-3">
                Something went wrong. Please try again.
              </p>
            )}

            <p className="text-white/30 text-xs text-center mt-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Offer expires March 26, 2026
            </p>
          </>
        )}
      </div>
    </div>
  );
}
