'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// ===========================================
// SET TO TRUE WHEN PRODUCTS ARE READY TO LAUNCH
const IS_LAUNCHED = true;
// ===========================================

// --- Links (Whop signup keeps its affiliate `a=` param; do not change) ---
const CORE_SIGNUP = 'https://sharpmoney-whop-app.vercel.app/signup?plan=core&a=websitecore';
const PRO_SIGNUP = 'https://sharpmoney-whop-app.vercel.app/signup?plan=pro&a=websitepro';
const ALPHA_SIGNUP = 'https://sharpmoney-whop-app.vercel.app/signup?plan=alpha&a=websitealpha';
const OFFICIAL_RULES = 'https://sharpmoney-whop-app.vercel.app/survivor/official-rules';

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
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  );
}

// ============================================================
// Data
// ============================================================
const CONTEST_CARDS = [
  { value: '$5,000', label: 'Prize pool', color: '#fbbf24' },
  { value: '100%', label: 'Free to enter', color: '#4ade80' },
  { value: 'NFL', label: 'Survivor format', color: '#ffffff' },
  { value: '2', label: 'Entries per member', color: '#22d3ee' },
  { value: 'PIKKIT', label: 'Presented in partnership', color: '#60a5fa' },
];

const STEPS = [
  { num: '1', title: 'JOIN CORE FREE', body: 'Create your free SharpMoney account. Core was $29.99/month — now it costs nothing.' },
  { num: '2', title: 'ENTER THE SURVIVOR POOL', body: 'Claim your two free entries and make your NFL selection before the Week 1 pick lock.' },
  { num: '3', title: 'SURVIVE AND ADVANCE', body: 'Pick a winner each week and stay alive for the $5,000 prize.' },
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
    description: 'Perfect for beginners learning +EV betting — and your ticket into the Survivor Pool.',
    features: ['Core +EV tool access', 'Core odds screen', 'Core Promo Optimizer', 'Free betting calculators', 'Core Discord access', '$5,000 Survivor Pool — 2 free entries'],
    cta: 'START WITH CORE',
    href: CORE_SIGNUP,
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
    features: ['Everything in Core', '$5,000 Survivor Pool — 2 free entries', 'Full Plus EV tool access', 'Line movement and Pinnacle limits', 'DFS tool plus exchange liquidity', 'Advanced filter settings', 'Full access to all sportsbooks'],
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
    features: ['Everything in Pro', '$5,000 Survivor Pool — 2 free entries', 'SharpMoney Signal (proprietary)', 'Professional handicapped plays', 'Alpha Discord access', 'All future add-ons included', 'Priority support & early access'],
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
  { q: 'Is SharpMoney Core really free?', a: 'Yes. Core is free forever — no subscription required. It previously cost $29.99 per month and now costs $0.' },
  { q: 'What happened to the $29.99/month price?', a: 'We removed it. Everything in the Core plan is now available at no cost, permanently.' },
  { q: 'How do I enter the $5,000 Survivor Pool?', a: 'Create a free SharpMoney Core account, claim your two free entries, and make your first weekly NFL selection.' },
  { q: 'Is the Survivor Pool free to enter?', a: 'Yes — entry is 100% free with no purchase necessary. The pool is presented in partnership with Pikkit with a $5,000 prize pool.' },
  { q: 'How many entries do I receive?', a: 'Every member — free or paid — receives exactly 2 free entries in every contest. Tier never changes the allowance.' },
  { q: 'When does registration close?', a: 'Registration closes at the Week 1 pick lock. If you claim entries in the final day, make your picks immediately.' },
  { q: 'Do I need a Pikkit account?', a: 'No — entries are claimed and picks are made through your SharpMoney account. Pikkit is the contest sponsor.' },
  { q: 'What is included with SharpMoney Core?', a: 'Core +EV tool access, the Core odds screen, Core Promo Optimizer, free betting calculators, Core Discord access, and one-click deep links.' },
  { q: 'What is the difference between Core, Pro, and Alpha?', a: 'Core is free with essential tools. Pro ($79.99/mo) adds the full Plus EV tool, line movement, Pinnacle limits, and advanced filters. Alpha ($199.99/mo) adds SharpMoney Signal and professional plays. Pro and Alpha include a 3-day free trial.' },
];

const SURVIVED = [true, true, true, false, false, false];
const WEEKS = SURVIVED.map((on, i) => ({
  label: 'W' + (i + 1),
  size: on ? 17 : 13,
  bg: on ? '#22d3ee' : 'rgba(255,255,255,0.05)',
  border: on ? '#22d3ee' : '#374151',
  glow: on ? '0 0 12px rgba(34,211,238,0.55)' : 'none',
  labelColor: on ? '#22d3ee' : '#6b7280',
  hasLine: i < SURVIVED.length - 1,
  lineBg: SURVIVED[i + 1] ? '#22d3ee' : '#374151',
}));

// ============================================================
// Page
// ============================================================
export default function Home() {
  const [prize, setPrize] = useState(5000);

  useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Count-up prize $0 -> $5,000
    setPrize(0);
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setPrize(Math.round(5000 * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

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
      cancelAnimationFrame(raf);
      clearTimeout(revealTimer);
      io.disconnect();
    };
  }, []);

  const prizeText = '$' + prize.toLocaleString('en-US');

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
      {/* Announcement bar */}
      <a
        href="#survivor"
        className="flex items-center justify-center gap-[10px] flex-wrap text-center text-[13px] font-bold"
        style={{ background: 'linear-gradient(90deg,#06b6d4,#22d3ee)', color: '#052330', letterSpacing: '0.03em', padding: '8px 16px' }}
      >
        <span style={{ fontFamily: FONT_MONO, fontWeight: 700, background: '#052330', color: '#22d3ee', borderRadius: 4, padding: '1px 7px', fontSize: 11 }}>
          NEW
        </span>
        <span>SharpMoney Core is now FREE • Enter the $5,000 NFL Survivor Pool</span>
        <span aria-hidden="true">→</span>
      </a>

      {/* Nav (shared) */}
      <Nav />

      {/* Hero */}
      <header style={{ position: 'relative', overflow: 'hidden', padding: '68px 24px 88px' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 1000, height: 540, background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.14), transparent 65%)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -140, right: -140, width: 520, height: 520, background: 'radial-gradient(circle, rgba(251,191,36,0.07), transparent 65%)', pointerEvents: 'none' }} />
        <div className="sv-two-col" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 56, alignItems: 'center' }}>

          {/* Hero copy */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22, animation: 'fadeInUp 0.8s ease both' }}>
            <div style={{ display: 'flex' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', padding: '7px 15px', borderRadius: 7, textTransform: 'uppercase' }}>
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', animation: 'blinkDot 1.6s ease-in-out infinite' }} />
                SharpMoney Core is Now Free
              </span>
            </div>
            <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(26px,3.6vw,42px)', lineHeight: 1.14, fontWeight: 400, letterSpacing: '0.01em', overflowWrap: 'break-word' }}>
              TURN YOUR HOBBY<br />INTO YOUR SIDE HUSTLE.<br /><span style={{ color: '#fbbf24' }}>ENTER TO WIN $5,000.</span>
            </h1>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.55, color: '#9ca3af', maxWidth: 540 }}>
              SharpMoney Core was $29.99/month. Now it&rsquo;s 100% free. Create your account to access our sports betting tools and enter the free $5,000 Pikkit NFL Survivor Pool.
            </p>
            {/* Pricing treatment */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <span style={{ position: 'relative', display: 'inline-block', fontFamily: FONT_MONO, fontSize: 21, color: '#6b7280' }}>
                Was $29.99/mo
                <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: '50%', height: 2, background: '#f87171', animation: 'strikeIn 0.7s ease 0.9s both', width: '100%' }} />
              </span>
              <span aria-hidden="true" style={{ color: '#22d3ee', fontSize: 22, fontWeight: 700 }}>→</span>
              <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 44, fontWeight: 700, color: '#22d3ee', textShadow: '0 0 30px rgba(34,211,238,0.4)' }}>$0</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#4ade80', textTransform: 'uppercase', border: '1px solid rgba(74,222,128,0.4)', background: 'rgba(74,222,128,0.08)', borderRadius: 6, padding: '4px 10px' }}>Free Forever</span>
              </span>
            </div>
            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 4 }}>
              <SignupCTA
                href={CORE_SIGNUP}
                className="sv-motion text-[15px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]"
                style={{ letterSpacing: '0.05em', padding: '16px 32px', animation: 'pulseGlow 2.5s ease-in-out infinite' }}
              >
                JOIN SHARPMONEY FREE
              </SignupCTA>
              <a href="#survivor" className="text-[15px] font-semibold text-[#d1d5db] hover:text-[#22d3ee] transition-colors rounded-[10px]" style={{ border: '1px solid #374151', letterSpacing: '0.04em', padding: '16px 32px' }}>
                EXPLORE THE $5,000 SURVIVOR POOL
              </a>
            </div>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 14, color: '#6b7280' }}>Join Core free and receive two chances to win.</p>
          </div>

          {/* Hero visual: the contest card */}
          <div style={{ minWidth: 0, position: 'relative', minHeight: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInUp 0.8s ease 0.2s both' }}>
            <div className="sv-motion" style={{ position: 'relative', width: 'min(430px,100%)', background: 'linear-gradient(155deg,#111827 30%,#0d1420)', border: '1px solid rgba(34,211,238,0.35)', borderRadius: 14, padding: '26px 28px 24px', boxShadow: '0 0 60px rgba(6,182,212,0.1), 0 24px 60px rgba(0,0,0,0.55)', animation: 'floatY 6s ease-in-out infinite' }}>
              <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 220, background: 'radial-gradient(circle at top right, rgba(251,191,36,0.09), transparent 70%)', borderRadius: 14, pointerEvents: 'none' }} />
              <div aria-hidden="true" style={{ position: 'absolute', top: -15, left: 20, background: '#111827', border: '1px solid #374151', borderRadius: 8, padding: '6px 11px', boxShadow: '0 12px 30px rgba(0,0,0,0.55)', fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1 }}>
                <span style={{ color: '#6b7280', textDecoration: 'line-through' }}>$29.99</span>
                <span style={{ color: '#22d3ee', margin: '0 5px' }}>→</span>
                <span style={{ color: '#22d3ee', fontWeight: 700 }}>$0</span>
              </div>
              <div style={{ position: 'absolute', top: -13, right: 20, background: '#4ade80', color: '#052e16', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', padding: '6px 13px', borderRadius: 999, transform: 'rotate(2deg)', boxShadow: '0 6px 18px rgba(74,222,128,0.3)' }}>FREE ENTRY</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(16,98,251,0.15)', border: '1px solid rgba(16,98,251,0.5)', color: '#60a5fa', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', padding: '5px 11px', borderRadius: 6 }}>PIKKIT SURVIVOR</span>
                <Image src="/sponsors/pikkit.svg" alt="Pikkit" width={64} height={16} style={{ height: 16, width: 'auto', display: 'inline-block' }} />
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 25, margin: '13px 0 4px' }}>NFL SURVIVOR POOL</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 'clamp(46px,5.6vw,60px)', fontWeight: 700, lineHeight: 1.05, color: '#fbbf24', textShadow: '0 0 36px rgba(251,191,36,0.3)' }}>{prizeText}</div>
              <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, marginTop: 4 }}>Prize Pool</div>
              <div style={{ display: 'flex', gap: 'min(34px,4vw)', marginTop: 18, flexWrap: 'wrap' }}>
                <span><span style={{ display: 'block', fontFamily: FONT_DISPLAY, fontSize: 21, color: '#4ade80' }}>2</span><span style={{ fontSize: 9.5, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Free entries / member</span></span>
                <span><span style={{ display: 'block', fontFamily: FONT_DISPLAY, fontSize: 21 }}>18</span><span style={{ fontSize: 9.5, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Weeks</span></span>
                <span><span style={{ display: 'block', fontFamily: FONT_DISPLAY, fontSize: 21 }}>$0</span><span style={{ fontSize: 9.5, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>To enter</span></span>
              </div>
              {/* survivor week path */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {WEEKS.map((wk, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: wk.size, height: wk.size, borderRadius: '50%', background: wk.bg, border: `2px solid ${wk.border}`, boxShadow: wk.glow }} />
                        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: wk.labelColor }}>{wk.label}</span>
                      </div>
                      {wk.hasLine && <div style={{ flex: 1, height: 2, background: wk.lineBg, margin: '0 4px 15px' }} />}
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#9ca3af', marginTop: 10 }}>One pick a week. Win and advance — lose and you&rsquo;re out. Last entry standing takes the pool.</div>
              </div>
              <SignupCTA href={CORE_SIGNUP} className="block text-center text-[13.5px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[8px]" style={{ marginTop: 20, letterSpacing: '0.05em', padding: 13 }}>
                CLAIM 2 FREE ENTRIES
              </SignupCTA>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: '#6b7280', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sponsored by</span>
                <Image src="/sponsors/pikkit.svg" alt="Pikkit" width={56} height={14} style={{ height: 14, width: 'auto', display: 'block' }} />
              </div>
              <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 11, color: '#6b7280', lineHeight: 1.45 }}>Free to enter. No purchase necessary. Registration closes at the Week 1 pick lock. See official rules.</div>
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
          <div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: '#fbbf24' }}>$5,000</div><div style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>Survivor Prize Pool</div></div>
        </div>
      </section>

      {/* Survivor Pool section */}
      <section id="survivor" style={{ position: 'relative', padding: '96px 24px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 760, height: 700, background: 'radial-gradient(circle, rgba(16,98,251,0.07), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
          <div data-reveal="true" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 46px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(16,98,251,0.12)', border: '1px solid rgba(16,98,251,0.45)', padding: '7px 15px', borderRadius: 7 }}>
              <span style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em' }}>IN PARTNERSHIP WITH</span>
              <Image src="/sponsors/pikkit.svg" alt="Pikkit" width={60} height={15} style={{ height: 15, width: 'auto', display: 'block' }} />
            </div>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px,3.4vw,42px)', fontWeight: 400, lineHeight: 1.15 }}>SURVIVE THE SEASON.<br /><span style={{ color: '#fbbf24' }}>WIN YOUR SHARE OF $5,000.</span></h2>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.55, color: '#9ca3af' }}>Join SharpMoney Core for free and enter our $5,000 NFL Survivor Pool presented in partnership with Pikkit. Make your weekly selection, survive, and stay in the running for the prize.</p>
          </div>
          <div data-reveal="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 40 }}>
            {CONTEST_CARDS.map((card, i) => (
              <div key={i} className="transition-transform duration-200 hover:-translate-y-1 hover:border-[#22d3ee]/45" style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: '22px 18px', textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: card.color, marginBottom: 7 }}>{card.value}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</div>
              </div>
            ))}
          </div>
          <div data-reveal="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <SignupCTA href={CORE_SIGNUP} className="text-[15px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]" style={{ letterSpacing: '0.05em', padding: '16px 36px' }}>
              ENTER THE FREE SURVIVOR POOL
            </SignupCTA>
            <a href={OFFICIAL_RULES} target="_blank" rel="noopener noreferrer" className="text-[#6b7280] hover:text-[#22d3ee] transition-colors" style={{ fontFamily: FONT_BODY, fontSize: 14, textDecoration: 'underline' }}>Read the official rules</a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-label="How it works" style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 data-reveal="true" style={{ margin: '0 0 38px', textAlign: 'center', fontFamily: FONT_DISPLAY, fontSize: 'clamp(26px,3vw,36px)', fontWeight: 400 }}>THREE STEPS TO THE <span style={{ color: '#fbbf24' }}>PRIZE</span></h2>
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

      {/* Core product section */}
      <section id="product" style={{ position: 'relative', padding: '96px 24px', background: 'linear-gradient(180deg,#0d1420,#0b111b 50%,#0d1420)', borderTop: '1px solid #1f2937' }}>
        <div className="sv-two-col" style={{ maxWidth: 1150, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 56, alignItems: 'center' }}>
          <div data-reveal="true" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 400, lineHeight: 1.15 }}>MORE THAN A <span style={{ color: '#22d3ee' }}>FREE CONTEST</span></h2>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 17, lineHeight: 1.55, color: '#9ca3af' }}>SharpMoney Core gives sports bettors the tools to compare markets, identify value, and make more informed decisions&mdash;now completely free.</p>
            <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {CORE_FEATURES.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,211,238,0.1)', color: '#22d3ee', fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: '#d1d5db' }}>{feat}</span>
                </li>
              ))}
            </ul>
            <p style={{ margin: '6px 0 0', fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>Line movement charts, quick indicators, and the full sportsbook feed are Pro and Alpha features.</p>
            <div style={{ display: 'flex', marginTop: 6 }}>
              <SignupCTA href={CORE_SIGNUP} className="text-[14px] font-bold text-[#22d3ee] transition-colors rounded-[9px] hover:brightness-125" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.45)', letterSpacing: '0.05em', padding: '13px 28px' }}>
                GET CORE FREE
              </SignupCTA>
            </div>
          </div>
          <div data-reveal="true" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(34,211,238,0.35)', padding: 8, background: '#111827', boxShadow: '0 0 50px rgba(6,182,212,0.08), 0 24px 60px rgba(0,0,0,0.5)' }}>
              <Image src="/images/plus-ev/plus-ev-feed-with-indicators.jpg" alt="SharpMoney Plus EV feed showing live +EV bets across sportsbooks with EV percentage, odds, and one-click bet links" width={1200} height={800} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 9 }} />
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', top: -14, right: -8, background: '#111827', border: '1px solid #1f2937', borderRadius: 9, padding: '8px 14px', fontFamily: FONT_MONO, fontSize: 12, color: '#4ade80', boxShadow: '0 12px 30px rgba(0,0,0,0.55)' }}>+1.7% EV • LIVE</div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1150, margin: '0 auto' }}>
          <div data-reveal="true" style={{ textAlign: 'center', marginBottom: 44, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 400 }}>CHOOSE YOUR <span style={{ color: '#22d3ee' }}>EDGE</span></h2>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 16, color: '#9ca3af' }}>Core is free forever. Pro and Alpha include a 3-day free trial.</p>
          </div>
          {/* Survivor pool included on every plan */}
          <div data-reveal="true" style={{ maxWidth: 720, margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', textAlign: 'center', background: 'linear-gradient(180deg, rgba(251,191,36,0.08), rgba(34,211,238,0.06))', border: '1px solid rgba(251,191,36,0.35)', borderRadius: 12, padding: '14px 22px' }}>
            <span aria-hidden="true" style={{ fontSize: 18 }}>🏈</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.5, color: '#d1d5db' }}>
              The <strong style={{ color: '#fbbf24' }}>$5,000 NFL Survivor Pool</strong> is included with <strong style={{ color: '#fff' }}>every plan</strong> — <strong style={{ color: '#fff' }}>2 free entries</strong> for every member, free or paid.
            </span>
          </div>
          <div data-reveal="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, alignItems: 'stretch' }}>
            {PLANS.map((plan) => {
              const CardWrapper = IS_LAUNCHED ? 'a' : 'div';
              const wrapperProps = IS_LAUNCHED ? { href: plan.href, target: '_blank', rel: 'noopener noreferrer' } : {};
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
          <h2 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 'clamp(30px,3.8vw,48px)', fontWeight: 400, lineHeight: 1.14 }}>START FREE. MAKE YOUR PICKS.<br /><span style={{ color: '#fbbf24' }}>CHASE $5,000.</span></h2>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 17, color: '#9ca3af' }}>Join SharpMoney Core for $0 and enter the free Pikkit NFL Survivor Pool.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <SignupCTA href={CORE_SIGNUP} className="sv-motion text-[16px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[10px]" style={{ letterSpacing: '0.05em', padding: '17px 38px', animation: 'pulseGlow 2.5s ease-in-out infinite' }}>
              JOIN SHARPMONEY FREE
            </SignupCTA>
            <a href="#survivor" className="text-[16px] font-semibold text-[#d1d5db] hover:text-[#22d3ee] transition-colors rounded-[10px]" style={{ border: '1px solid #374151', letterSpacing: '0.04em', padding: '17px 38px' }}>VIEW SURVIVOR POOL DETAILS</a>
          </div>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontSize: 13, color: '#6b7280' }}>No purchase necessary to enter the Survivor Pool. <a href={OFFICIAL_RULES} target="_blank" rel="noopener noreferrer" className="text-[#6b7280] hover:text-[#22d3ee] transition-colors" style={{ textDecoration: 'underline' }}>See official rules</a> for eligibility.</p>
        </div>
      </section>

      {/* Footer (shared) */}
      <Footer />
    </div>
  );
}
