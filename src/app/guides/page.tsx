import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "./articles";

export const metadata: Metadata = {
  title: "Free Sports Betting Guides — Learn +EV Betting",
  description:
    "Free guides and articles on +EV sports betting, expected value, odds, vig, line movement, bankroll management, and profitable betting strategies. Written by the SharpMoney team.",
  keywords: [
    "sports betting guide",
    "+EV betting guide",
    "how to bet on sports",
    "expected value sports betting",
    "sports betting for beginners",
    "learn sports betting",
    "profitable sports betting",
    "sports betting strategy",
    "sharp betting guide",
    "sports betting education",
  ],
  openGraph: {
    title: "Free Sports Betting Guides — Learn +EV Betting | SharpMoney",
    description:
      "Free guides on +EV sports betting, expected value, odds, and profitable strategies.",
    url: "https://www.betsharpmoney.com/guides",
  },
  twitter: {
    title: "Free Sports Betting Guides | SharpMoney",
    description:
      "Free guides on +EV sports betting, expected value, odds, and profitable strategies.",
  },
  alternates: {
    canonical: "https://www.betsharpmoney.com/guides",
  },
};

// ============================================================================
// Logo
// ============================================================================
function Logo({ className = "w-48" }: { className?: string }) {
  return (
    <Image
      src="/logo.jpg"
      alt="SharpMoney"
      width={200}
      height={200}
      className={className}
    />
  );
}

// ============================================================================
// Category badge colors
// ============================================================================
const CATEGORY_COLORS: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  strategy: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  tools: "bg-cyan/10 text-cyan border-cyan/20",
};

// ============================================================================
// Main Page
// ============================================================================
export default function GuidesPage() {
  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold tracking-wider text-cyan">
              SHARPMONEY
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#pricing"
              className="text-white/70 hover:text-cyan transition-colors"
            >
              Plans
            </Link>
            <Link
              href="/tools"
              className="text-white/70 hover:text-cyan transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/guides"
              className="text-cyan font-semibold transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/promotions"
              className="text-white/70 hover:text-cyan transition-colors"
            >
              Promos
            </Link>
            <Link
              href="/results"
              className="text-white/70 hover:text-cyan transition-colors"
            >
              Results
            </Link>
            <a
              href="https://sharpmoney-whop-app.vercel.app/api/oauth/init?next=%2Fev"
              className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
            >
              Login
            </a>
            <a
              href="https://sharpmoney-whop-app.vercel.app/signup?plan=pro&a=websitepro"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan text-black font-semibold px-6 py-2 rounded-lg hover:bg-cyan-dim transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-20 bg-black">
        {/* Hero */}
        <div className="border-b border-white/5 bg-gradient-to-b from-cyan/5 to-transparent">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Sports Betting{" "}
              <span className="gradient-text">Guides</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Free, in-depth guides on +EV betting, expected value, odds, and
              the strategies that separate profitable bettors from everyone
              else.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid gap-6">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className="group block bg-card-bg border border-card-border rounded-xl p-6 md:p-8 hover:border-cyan/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      CATEGORY_COLORS[article.category] || CATEGORY_COLORS.beginner
                    }`}
                  >
                    {article.categoryLabel}
                  </span>
                  <span className="text-white/30 text-sm">
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan transition-colors mb-2">
                  {article.title}
                </h2>

                <p className="text-white/50 leading-relaxed mb-4">
                  {article.description}
                </p>

                <div className="flex items-center gap-2 text-cyan text-sm font-semibold">
                  Read Guide
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* More coming soon */}
          <div className="mt-12 text-center">
            <p className="text-white/30 text-sm">
              More guides coming soon. Check back regularly or follow us on{" "}
              <a
                href="https://x.com/BetSharpMoney"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:underline"
              >
                X/Twitter
              </a>{" "}
              for updates.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo className="w-10 h-10 object-contain" />
              <span className="text-lg font-bold tracking-wider text-cyan">
                SHARPMONEY
              </span>
            </div>
            <div className="flex items-center gap-6 text-white/50 text-sm">
              <Link href="/#pricing" className="hover:text-cyan transition-colors">Plans</Link>
              <Link href="/tools" className="hover:text-cyan transition-colors">Tools</Link>
              <Link href="/guides" className="hover:text-cyan transition-colors">Guides</Link>
              <Link href="/promotions" className="hover:text-cyan transition-colors">Promos</Link>
              <Link href="/results" className="hover:text-cyan transition-colors">Results</Link>
              <a href="https://discord.gg/b4QmzcPhTt" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">Discord</a>
              <a href="https://x.com/BetSharpMoney" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">X</a>
              <a href="https://www.youtube.com/@BetSharpMoneyYT" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">YouTube</a>
            </div>
            <div className="text-white/30 text-sm">
              © {new Date().getFullYear()} SharpMoney. All rights reserved.
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
            SharpMoney provides tools for informational purposes. Sports betting involves risk. Please gamble responsibly.
          </div>
        </div>
      </footer>
    </>
  );
}
