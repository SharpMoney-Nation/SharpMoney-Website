import Image from 'next/image';

// Shared site footer — SharpMoney v2 (Survivor) styling. Used across every page.

const OFFICIAL_RULES = 'https://sharpmoney-whop-app.vercel.app/survivor/official-rules';

const LINKS = [
  { label: 'Plans', href: '/#pricing' },
  { label: 'Tools', href: '/tools' },
  { label: 'Guides', href: '/guides' },
  { label: 'Promos', href: '/promotions' },
  { label: 'Results', href: '/results' },
  { label: 'Survivor Pool', href: '/#survivor' },
  { label: 'Contest Rules', href: OFFICIAL_RULES, external: true },
  { label: 'Discord', href: 'https://discord.gg/b4QmzcPhTt', external: true },
  { label: 'X', href: 'https://x.com/BetSharpMoney', external: true },
  { label: 'YouTube', href: 'https://www.youtube.com/@BetSharpMoneyYT', external: true },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--survivor-border)', background: 'var(--survivor-band)' }} className="px-6 pt-11 pb-8">
      <div className="max-w-[1150px] mx-auto flex flex-col gap-7">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-[10px]">
            <Image
              src="/sharpmoney-logo.png"
              alt="SharpMoney logo"
              width={30}
              height={30}
              style={{ width: 30, height: 30, objectFit: 'contain' }}
            />
            <span className="text-[16px] text-white" style={{ fontFamily: 'var(--font-russo), sans-serif' }}>
              SharpMoney
            </span>
          </div>
          <nav
            aria-label="Footer"
            className="flex items-center gap-[22px] flex-wrap text-[14px]"
            style={{ fontFamily: 'var(--font-roboto-cond), sans-serif' }}
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-[#6b7280] hover:text-[#22d3ee] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="text-[13px] text-[#4b5563]" style={{ fontFamily: 'var(--font-roboto-cond), sans-serif' }}>
            © {new Date().getFullYear()} SharpMoney. All rights reserved.
          </div>
        </div>
        <div
          className="text-center text-[12px] leading-[1.7] text-[#6b7280]"
          style={{ borderTop: '1px solid var(--survivor-border)', paddingTop: 22, fontFamily: 'var(--font-roboto-cond), sans-serif' }}
        >
          SharpMoney provides tools for informational purposes. Sports betting involves risk. Please gamble responsibly.
          The $5,000 NFL Survivor Pool is presented in partnership with Pikkit and is free to enter; see the official
          rules for eligibility and full terms. If you or someone you know has a gambling problem, call 1-800-GAMBLER.
        </div>
      </div>
    </footer>
  );
}
