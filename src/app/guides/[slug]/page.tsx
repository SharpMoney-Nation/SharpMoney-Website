import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES, getArticleBySlug } from "../articles";
import { notFound } from "next/navigation";

// ============================================================================
// Generate static params for all articles
// ============================================================================
export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

// ============================================================================
// Dynamic metadata for SEO
// ============================================================================
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Guide Not Found" };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://www.betsharpmoney.com/guides/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["SharpMoney"],
    },
    twitter: {
      title: article.metaTitle,
      description: article.metaDescription,
    },
    alternates: {
      canonical: `https://www.betsharpmoney.com/guides/${article.slug}`,
    },
  };
}

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
// Article Page
// ============================================================================
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

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
            <Link href="/#pricing" className="text-white/70 hover:text-cyan transition-colors">Plans</Link>
            <Link href="/tools" className="text-white/70 hover:text-cyan transition-colors">Tools</Link>
            <Link href="/guides" className="text-cyan font-semibold transition-colors">Guides</Link>
            <Link href="/promotions" className="text-white/70 hover:text-cyan transition-colors">Promos</Link>
            <Link href="/results" className="text-white/70 hover:text-cyan transition-colors">Results</Link>
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
        {/* Article Header */}
        <div className="border-b border-white/5 bg-gradient-to-b from-cyan/5 to-transparent">
          <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
              <Link href="/guides" className="hover:text-cyan transition-colors">
                Guides
              </Link>
              <span>/</span>
              <span className="text-white/60">{article.title}</span>
            </div>

            {/* Category + Read time */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  article.category === "beginner"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : article.category === "strategy"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-cyan/10 text-cyan border-cyan/20"
                }`}
              >
                {article.categoryLabel}
              </span>
              <span className="text-white/30 text-sm">{article.readTime}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
              {article.headline}
            </h1>

            <p className="text-white/50 text-lg">
              {article.description}
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <article
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-white/70 prose-p:leading-relaxed
              prose-li:text-white/70
              prose-strong:text-white
              prose-a:text-cyan prose-a:no-underline hover:prose-a:underline
              prose-table:border-collapse
              prose-th:border prose-th:border-white/10 prose-th:bg-white/5 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-white/80 prose-th:text-sm
              prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-td:text-white/60
              prose-dt:text-white prose-dt:font-semibold
              prose-dd:text-white/60 prose-dd:ml-0 prose-dd:mb-4
            "
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Related Tools */}
          {article.relatedTools.length > 0 && (
            <div className="mt-16 p-6 md:p-8 bg-card-bg border border-card-border rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Free Tools Mentioned in This Guide
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {article.relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-center gap-2 bg-cyan/10 border border-cyan/20 text-cyan font-semibold text-sm px-4 py-3 rounded-lg hover:bg-cyan/20 transition-colors"
                  >
                    {tool.name} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-cyan/10 to-blue/10 border border-cyan/20 rounded-xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to Find +EV Bets Automatically?
            </h3>
            <p className="text-white/50 mb-6 max-w-lg mx-auto">
              SharpMoney Pro scans 20+ sportsbooks in real time and surfaces every bet where the price is in your favor. Sharp book data, line movement charts, and Kelly sizing included.
            </p>
            <a
              href="https://sharpmoney-whop-app.vercel.app/signup?plan=pro&a=websitepro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-cyan text-black font-semibold px-8 py-3 rounded-lg hover:bg-cyan-dim transition-colors"
            >
              Try SharpMoney Pro
            </a>
          </div>

          {/* Back to Guides */}
          <div className="mt-12 text-center">
            <Link
              href="/guides"
              className="text-white/40 hover:text-cyan text-sm transition-colors"
            >
              ← Back to All Guides
            </Link>
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
