'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import JoinCoreEmbed from '@/components/JoinCoreEmbed';
import { APP_URL } from '@/lib/app-url';

// ===========================================
// SET TO TRUE WHEN PRODUCTS ARE READY TO LAUNCH
const IS_LAUNCHED = true;
// ===========================================

// --- Links (Whop signup keeps its affiliate `a=` param; do not change) ---
// Core joins happen in the hero join box (#join); Pro/Alpha buy on the app.
const JOIN_HREF = '#join';
const PRO_SIGNUP = `${APP_URL}/signup?plan=pro&a=websitepro`;
const ALPHA_SIGNUP = `${APP_URL}/signup?plan=alpha&a=websitealpha`;

// --- Fonts (loaded in layout.tsx, referenced by CSS var) ---
const FONT_DISPLAY = 'var(--font-russo), sans-serif';
const FONT_BODY = 'var(--font-roboto-cond), sans-serif';
const FONT_MONO = 'var(--font-plex-mono), monospace';

// --- Gated signup CTA: live <a> when launched, inert "Coming Soon" otherwise ---
function SignupCTA({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!IS_LAUNCHED) {
    return (
      <span className={className} style={{ ...style, opacity: 0.6, cursor: 'default' }}>
        Coming Soon
      </span>
    );
  }
  const external = href.startsWith('http');
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={className} style={style}>
      {children}
    </a>
  );
}

// ============================================================
// Data
// ============================================================
const HERO_BULLETS = [
  'Live feed of smart bets, updated all day',
  'Compare prices across every major sportsbook',
  'One tap to bet at the best price',
];

const FEED_CALLOUTS = [
  { num: '1', title: 'EV % = your edge', body: 'The green number is how much better the price is than the true odds.' },
  { num: '2', title: 'Suggested risk for a small bankroll', body: 'Each play shows a risk amount sized to a modest bankroll.' },
  { num: '3', title: 'Best book + one-click bet link', body: 'The row names the book with the best price. Tap Bet to open it.' },
];

const STEPS = [
  { num: '1', title: 'JOIN WITH YOUR EMAIL', body: 'No card. No trial clock. Your account is ready in seconds.' },
  { num: '2', title: 'OPEN THE LIVE FEED', body: 'Bets are ranked by edge and refresh automatically.' },
  { num: '3', title: 'BET THE EDGE', body: 'Tap Bet to open the best price at your book.' },
];

const WHY_FREE = [
  { title: "We're building the best +EV community.", body: 'More sharp bettors in one place makes everyone’s data better. Core is how you get in the door.' },
  { title: 'Small bankroll? Start here.', body: 'Core covers the main markets and shows a suggested risk per bet, so you can start small and stay disciplined.' },
  { title: "Scale when you're ready.", body: 'Pro adds player props, line movement and Pinnacle limits. Alpha adds SharpMoney Signal. Upgrade only when your bankroll asks for it.' },
];

const CORE_FEATURES = [
  'Core +EV tool access',
  'Core odds screen',
  'Core Promo Optimizer',
  'Free betting calculators',
  'Core Discord access',
  'One-click deep links',
];

type Plan = {
  name: string;
  oldPrice?: string;
  price: string;
  period: string;
  priceColor: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  badge?: string;
  badgeBg: string;
  badgeColor: string;
  cardBg: string;
  borderColor: string;
  shadow: string;
  ctaBg: string;
  ctaColor: string;
};

const PLANS: Plan[] = [
  {
    name: 'CORE',
    oldPrice: '$29.99',
    price: 'FREE',
    period: '',
    priceColor: '#22d3ee',
    description: 'Perfect for beginners learning +EV betting. Join with your email, no card.',
    features: CORE_FEATURES,
    cta: 'JOIN FREE',
    href: JOIN_HREF,
    badge: 'NOW FREE',
    badgeBg: '#4ade80',
    badgeColor: '#052e16',
    cardBg: 'linear-gradient(180deg, rgba(74,222,128,0.07), #111827)',
    borderColor: 'rgba(74,222,128,0.55)',
    shadow: '0 0 40px rgba(74,222,128,0.1)',
    ctaBg: '#06b6d4',
    ctaColor: '#052330',
  },
  {
    name: 'PRO',
    price: '$79.99',
    period: '/month',
    priceColor: '#ffffff',
    description: 'For bettors who want professional-grade data.',
    features: ['Everything in Core', 'Full Plus EV tool access', 'Line movement and Pinnacle limits', 'DFS tool plus exchange liquidity', 'Advanced filter settings', 'Full access to all sportsbooks'],
    cta: 'GET PRO ACCESS',
    href: PRO_SIGNUP,
    badge: 'MOST POPULAR',
    badgeBg: '#06b6d4',
    badgeColor: '#052330',
    cardBg: 'linear-gradient(180deg, rgba(6,182,212,0.07), #111827)',
    borderColor: '#06b6d4',
    shadow: '0 0 40px rgba(6,182,212,0.15)',
    ctaBg: '#06b6d4',
    ctaColor: '#052330',
  },
  {
    name: 'ALPHA',
    price: '$199.99',
    period: '/month',
    priceColor: '#ffffff',
    description: 'Maximum edge with zero limitations.',
    features: ['Everything in Pro', 'SharpMoney Signal (proprietary)', 'Professional handicapped plays', 'Alpha Discord access', 'All future add-ons included', 'Priority support & early access'],
    cta: 'GO ALPHA',
    href: ALPHA_SIGNUP,
    badge: '⚡ MAXIMUM EDGE',
    badgeBg: 'linear-gradient(90deg,#fbbf24,#d97706)',
    badgeColor: '#000000',
    cardBg: 'linear-gradient(180deg, rgba(251,191,36,0.07), #111827)',
    borderColor: 'rgba(251,191,36,0.55)',
    shadow: '0 0 40px rgba(251,191,36,0.1)',
    ctaBg: 'linear-gradient(90deg,#fbbf24,#d97706)',
    ctaColor: '#000000',
  },
];

const FAQS = [
  { q: 'Is SharpMoney Core really free?', a: 'Yes. Core is free. It used to cost $29.99 a month. Now it costs $0 and there is no subscription.' },
  { q: 'Do I need a credit card?', a: 'No. Joining Core asks for your email only. Nothing is stored for billing.' },
  { q: 'What is included with SharpMoney Core?', a: 'Core +EV tool access, the Core odds screen, Core Promo Optimizer, free betting calculators, Core Discord access, and one-click deep links.' },
  { q: 'What does +EV mean?', a: 'A bet is +EV when the sportsbook’s price is better than the true odds. It means a better price, not a guaranteed win or a winning season.' },
  { q: 'Can I use Core with a small bankroll?', a: 'Yes. Core covers the main markets and shows a suggested risk per bet, so you can start small and stay disciplined.' },
  { q: 'How do I upgrade later?', a: 'Open Plans inside the app anytime. Pro and Alpha include a 3-day free trial.' },
  { q: 'Do I need a Whop account?', a: 'Your email creates one automatically when you join. Whop handles the login. You may get a one-time code by email.' },
];

// ============================================================
// Page
// ============================================================
export default function Home() {
  useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Reveal-on-scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    const revealTimer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        io.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(revealTimer);
      io.disconnect();
    };
  }, []);

  return (
    <div
      className="sv-motion"
      style={{
        background: 'var(--survivor-bg)',
        color: '#fff',
        minHeight: '100vh',
        overflowX: 'hidden',
        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      }}
    >
      {/* Nav (shared) */}
      <Nav />

      {/* Hero */}
      <header style={{ position: 'relative', overflow: 'hidden', padding: '68px 24px 88px' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 1000, height: 540, background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.14), transparent 65%)', pointerEvents: 'none' }} />
        <div className="sv-two-col" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 56, alignItems: 'center' }}>

          {/* Hero copy */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22, animation: 'fadeInUp 0.8s ease both' }}>
            <div style={{ display: 'flex' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', padding: '7px 15px', borderRadius: 7, textTransform: 'uppercase' }}>
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', animation: 'blinkDot 1.6s ease-in-out infinite' }} />
                100% Free &bull; No Credit Card
              </span>
            </div>
            <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px,3.6vw,42px)', lineHeight: 1.14, fontWeight: 400, letterSpacing: '0.01em', overflowWrap: 'break-word' }}>
              A FREE BETTING TOOL<br /><span style={{ color: '#22d3ee' }}>FOR SMARTER BETS.</span>
            </h1>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.55, color: '#9ca3af', maxWidth: 540 }}>
              SharpMoney Core finds the bets where the odds are on your side, at the book with the best price. Type your email. Click Join. You&rsquo;re in.
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {HERO_BULLETS.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: '#d1d5db' }}>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <span style={{ position: 'relative', display: 'inline-block', fontFamily: FONT_MONO, fontSize: 21, color: '#6b7280' }}>
                Was $29.99/mo
                <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: '50%', height: 2, background: '#f87171', animation: 'strikeIn 0.7s ease 0.9s both', width: '100%' }} />
              </span>
              <span aria-hidden="true" style={{ color: '#22d3ee', fontSize: 22, fontWeight: 700 }}>→</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 44, fontWeight: 700, color: '#22d3ee', textShadow: '0 0 30px rgba(34,211,238,0.4)' }}>$0</span>
            </div>
          </div>

          {/* Hero visual: the join box */}
          <div style={{ minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInUp 0.8s ease 0.2s both' }}>
            <div id="join" style={{ position: 'relative', width: 'min(430px,100%)', scrollMarginTop: 80, background: 'linear-gradient(155deg,#111827 30%,#0d1420)', border: '1px solid rgba(34,211,238,0.35)', borderRadius: 14, padding: '26px 28px 24px', boxShadow: '0 0 60px rgba(6,182,212,0.1), 0 24px 60px rgba(0,0,0,0.55)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22 }}>SHARPMONEY CORE</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#4ade80', textTransform: 'uppercase', border: '1px solid rgba(74,222,128,0.4)', background: 'rgba(74,222,128,0.08)', borderRadius: 6, padding: '4px 10px' }}>Free Forever</span>
              </div>
              <p style={{ margin: '0 0 16px', fontFamily: FONT_BODY, fontSize: 15, color: '#9ca3af' }}>Type your email. Click Join. You&rsquo;ll be inside the tool in a few seconds.</p>
              <JoinCoreEmbed />
            </div>
          </div>
        </div>
      </header>

      {/* Trust strip */}
      <section aria-label="Community stats" style={{ borderTop: '1px solid #1f2937', borderBottom: '1px solid #1f2937', background: '#0b111b' }}>
        <div data-reveal="true" style={{ maxWidth: 1000, margin: '0 auto', padding: '26px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 24, textAlign: 'center' }}>
          <div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: '#22d3ee' }}>4.9</div><div style={{ color: '#fbbf24', fontSize: 14 }} aria-label="5 star rating">★★★★★</div></div>
          <div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: '#22d3ee' }}>5K+</div><div style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>Community Members</div></div>
          <div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: '#22d3ee' }}>20+</div><div style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>Sportsbooks Covered</div></div>
          <div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: '#4ade80' }}>$0</div><div style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>To Join</div></div>
        </div>
      </section>

      {/* See how Core works */}
      <section id="product" style={{ position: 'relative', padding: '96px 24px', background: 'linear-gradient(180deg,#0d1420,#0b111b 50%,#0d1420)' }}>
        <div style={{ maxWidth: 1150, margin: '0 auto' }}>
          <div data-reveal="true" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 400, lineHeight: 1.15 }}>THIS IS <span style={{ color: '#22d3ee' }}>THE FEED.</span></h2>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.55, color: '#9ca3af' }}>Every row is a bet where the sportsbook&rsquo;s price beats the true odds.</p>
          </div>
          <div className="sv-two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 48, alignItems: 'center' }}>
            <div data-reveal="true" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(34,211,238,0.35)', padding: 8, background: '#111827', boxShadow: '0 0 50px rgba(6,182,212,0.08), 0 24px 60px rgba(0,0,0,0.5)' }}>
                <Image src="/images/plus-ev/plus-ev-feed-with-indicators.jpg" alt="SharpMoney Plus EV feed showing live +EV bets across sportsbooks with EV percentage, suggested risk, odds, and one-click bet links" width={1200} height={800} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 9 }} />
              </div>
              <div aria-hidden="true" style={{ position: 'absolute', top: -14, right: -8, background: '#111827', border: '1px solid #1f2937', borderRadius: 9, padding: '8px 14px', fontFamily: FONT_MONO, fontSize: 12, color: '#4ade80', boxShadow: '0 12px 30px rgba(0,0,0,0.55)' }}>+2.0% EV • LIVE</div>
            </div>
            <div data-reveal="true" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FEED_CALLOUTS.map((c) => (
                <div key={c.num} style={{ display: 'flex', gap: 14, background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: '16px 18px' }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee', fontFamily: FONT_DISPLAY, fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.num}</span>
                  <div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: '0.02em', marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.5, color: '#9ca3af' }}>{c.body}</div>
                  </div>
                </div>
              ))}
              <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {CORE_FEATURES.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span aria-hidden="true" style={{ color: '#22d3ee', flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: '#d1d5db' }}>{feat}</span>
                  </li>
                ))}
              </ul>
              <p style={{ margin: '4px 0 0', fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>Line movement charts, quick indicators, and the full sportsbook feed are Pro and Alpha features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section aria-label="How it works" style={{ padding: '96px 24px', borderTop: '1px solid #1f2937' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 data-reveal="true" style={{ margin: '0 0 38px', textAlign: 'center', fontFamily: FONT_DISPLAY, fontSize: 'clamp(26px,3vw,36px)', fontWeight: 400 }}>THREE <span style={{ color: '#22d3ee' }}>STEPS</span></h2>
          <div data-reveal="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
            {STEPS.map((step, i) => (
              <div key={i} className="transition-transform duration-200 hover:-translate-y-1 hover:border-[#22d3ee]/45" style={{ position: 'relative', background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee', fontFamily: FONT_DISPLAY, fontSize: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{step.num}</span>
                  <h3 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 400, letterSpacing: '0.02em' }}>{step.title}</h3>
                </div>
                <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.55, color: '#9ca3af' }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why is Core free? */}
      <section aria-label="Why Core is free" style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-reveal="true" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 38px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(26px,3vw,36px)', fontWeight: 400 }}>WHY IS CORE <span style={{ color: '#4ade80' }}>FREE?</span></h2>
          </div>
          <div data-reveal="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
            {WHY_FREE.map((card, i) => (
              <div key={i} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h3 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.55, color: '#9ca3af' }}>{card.body}</p>
              </div>
            ))}
          </div>
          <p data-reveal="true" style={{ margin: '22px 0 0', textAlign: 'center', fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>Betting involves risk. +EV means a better price, not a guaranteed win.</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '96px 24px', borderTop: '1px solid #1f2937' }}>
        <div style={{ maxWidth: 1150, margin: '0 auto' }}>
          <div data-reveal="true" style={{ textAlign: 'center', marginBottom: 44, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 400 }}>CHOOSE YOUR <span style={{ color: '#22d3ee' }}>EDGE</span></h2>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 16, color: '#9ca3af' }}>Start free. Upgrade when your bankroll is ready. Pro and Alpha include a 3-day free trial.</p>
          </div>
          <div data-reveal="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, alignItems: 'stretch' }}>
            {PLANS.map((plan) => {
              const CardWrapper = IS_LAUNCHED ? 'a' : 'div';
              const external = plan.href.startsWith('http');
              const wrapperProps = IS_LAUNCHED
                ? external
                  ? { href: plan.href, target: '_blank', rel: 'noopener noreferrer' }
                  : { href: plan.href }
                : {};
              return (
                <CardWrapper
                  key={plan.name}
                  {...wrapperProps}
                  className="transition-transform duration-200 hover:-translate-y-1.5"
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, background: plan.cardBg, border: `2px solid ${plan.borderColor}`, borderRadius: 14, padding: '30px 26px', color: '#fff', boxShadow: plan.shadow, textDecoration: 'none' }}
                >
                  {plan.badge && (
                    <span style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: plan.badgeBg, color: plan.badgeColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '5px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>{plan.badge}</span>
                  )}
                  <h3 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 400 }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    {plan.oldPrice && <span style={{ fontFamily: FONT_MONO, fontSize: 16, color: '#6b7280', textDecoration: 'line-through' }}>{plan.oldPrice}</span>}
                    <span style={{ fontFamily: FONT_MONO, fontSize: 32, fontWeight: 700, color: plan.priceColor }}>{plan.price}</span>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: '#6b7280' }}>{plan.period}</span>
                  </div>
                  <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 14, color: '#9ca3af' }}>{plan.description}</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontFamily: FONT_BODY, fontSize: 14, color: '#d1d5db' }}>
                        <span aria-hidden="true" style={{ color: '#22d3ee', flexShrink: 0 }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span style={{ display: 'block', textAlign: 'center', background: plan.ctaBg, color: plan.ctaColor, fontWeight: 700, fontSize: 13.5, letterSpacing: '0.05em', padding: 13, borderRadius: 9 }}>{IS_LAUNCHED ? plan.cta : 'Coming Soon'}</span>
                </CardWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions" style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h2 data-reveal="true" style={{ margin: '0 0 30px', textAlign: 'center', fontFamily: FONT_DISPLAY, fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 400 }}>FREQUENTLY ASKED <span style={{ color: '#22d3ee' }}>QUESTIONS</span></h2>
          <div data-reveal="true" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <details key={i} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: '0 22px' }}>
                <summary style={{ cursor: 'pointer', fontSize: 16, fontWeight: 600, padding: '17px 0', listStyle: 'none', color: '#fff' }}>{faq.q}</summary>
                <p style={{ margin: 0, padding: '0 0 18px', fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.6, color: '#9ca3af' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-label="Get started" style={{ position: 'relative', padding: '100px 24px', overflow: 'hidden', borderTop: '1px solid #1f2937' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 820, height: 420, background: 'radial-gradient(ellipse, rgba(6,182,212,0.11), transparent 65%)', pointerEvents: 'none' }} />
        <div data-reveal="true" style={{ position: 'relative', maxWidth: 800, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(30px,3.8vw,48px)', fontWeight: 400, lineHeight: 1.14 }}>READY?<br /><span style={{ color: '#22d3ee' }}>IT TAKES ONE EMAIL.</span></h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <SignupCTA href={JOIN_HREF} className="sv-motion text-[16px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]" style={{ letterSpacing: '0.05em', padding: '17px 38px', animation: 'pulseGlow 2.5s ease-in-out infinite' }}>
              JOIN FREE
            </SignupCTA>
          </div>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>No credit card. Just your email.</p>
        </div>
      </section>

      {/* Footer (shared) */}
      <Footer />
    </div>
  );
}
