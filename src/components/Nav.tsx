'use client';

import { useState } from 'react';
import Image from 'next/image';

// Shared site navigation — SharpMoney v2 (Survivor) styling.
// Sticky + translucent so it sits correctly on both the slate homepage and
// the dark inner pages. Used across every page (no more inline nav copies).

const IS_LAUNCHED = true;
const CORE_SIGNUP = 'https://sharpmoney-whop-app.vercel.app/signup?plan=core&a=websitecore';
const LOGIN_URL = 'https://sharpmoney-whop-app.vercel.app/api/oauth/init?next=%2Fev';

const LINKS = [
  { label: 'Plans', href: '/#pricing' },
  { label: 'Tools', href: '/tools' },
  { label: 'Guides', href: '/guides' },
  { label: 'Promos', href: '/promotions' },
  { label: 'Results', href: '/results' },
  { label: 'Survivor Pool', href: '/#survivor' },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(13,20,32,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--survivor-border)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-[11px] text-white shrink-0">
          <Image
            src="/sharpmoney-logo.png"
            alt="SharpMoney logo"
            width={34}
            height={34}
            style={{ width: 34, height: 34, objectFit: 'contain' }}
          />
          <span
            className="text-[18px] text-white"
            style={{ fontFamily: 'var(--font-russo), sans-serif', letterSpacing: '0.02em' }}
          >
            SharpMoney
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-[26px] flex-wrap justify-end">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] text-[#9ca3af] hover:text-[#22d3ee] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={LOGIN_URL}
            className="text-[15px] font-semibold text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
          >
            Log In
          </a>
          {IS_LAUNCHED ? (
            <a
              href={CORE_SIGNUP}
              target="_blank"
              rel="noopener noreferrer"
              className="sv-motion text-[14px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[9px] px-[22px] py-[10px]"
              style={{ letterSpacing: '0.04em', animation: 'pulseGlow 2.5s ease-in-out infinite' }}
            >
              JOIN FREE
            </a>
          ) : (
            <span className="text-[14px] font-bold text-[#052330]/70 bg-[#06b6d4]/50 rounded-[9px] px-[22px] py-[10px] cursor-default">
              Coming Soon
            </span>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-4"
          style={{ background: 'var(--survivor-bg)', borderTop: '1px solid var(--survivor-border)' }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] text-[#9ca3af] hover:text-[#22d3ee] transition-colors py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href={LOGIN_URL} onClick={() => setMobileMenuOpen(false)} className="text-[15px] font-semibold text-[#f59e0b] hover:text-[#fbbf24] py-1">
            Log In
          </a>
          {IS_LAUNCHED ? (
            <a
              href={CORE_SIGNUP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] font-bold text-[#052330] bg-[#06b6d4] hover:bg-[#22d3ee] transition-colors rounded-[9px] px-[22px] py-3 text-center"
              style={{ letterSpacing: '0.04em' }}
            >
              JOIN FREE
            </a>
          ) : (
            <span className="text-[14px] font-bold text-[#052330]/70 bg-[#06b6d4]/50 rounded-[9px] px-[22px] py-3 text-center cursor-default">
              Coming Soon
            </span>
          )}
        </div>
      )}
    </nav>
  );
}
