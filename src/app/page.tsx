'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

// ── Icons (inline SVGs matching lucide-react) ───────────────────────────────
const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ShieldIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-shield ${className}`} style={style} aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);

const SearchIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-search ${className}`} style={style} aria-hidden="true">
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </svg>
);

const UsersIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-users ${className}`} style={style} aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const DollarIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-dollar-sign ${className}`} style={style} aria-hidden="true">
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const UserIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-user ${className}`} style={style} aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const VerifiedIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-circle-check-big ${className}`} style={style} aria-label="Verified report">
    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const AlertIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-triangle-alert ${className}`} style={style} aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const TwitterIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-twitter ${className}`} style={style} aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const CalendarIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-calendar ${className}`} style={style} aria-hidden="true">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const ZapIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-zap ${className}`} style={style} aria-hidden="true">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

const StarIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-star ${className}`} style={style} aria-hidden="true">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const ArrowRightIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg {...iconProps} className={`lucide lucide-arrow-right ${className}`} style={style} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ── Data ────────────────────────────────────────────────────────────────────
type Profile = {
  href: string;
  rank: number;
  name: string;
  initial: string;
  verified?: boolean;
  aliases?: string;
  extraAliases?: number;
  reports: number;
  summary: string;
  tags: { label: string; cls: string }[];
  loss: string | null;
  twitter?: string;
  date: string;
};

const TAG = {
  pump: { label: 'Pump & Dump', cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  rug: { label: 'Rug Pull', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  other: { label: 'Other', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  phishing: { label: 'Phishing', cls: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  social: { label: 'Social Engineering', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  exit: { label: 'Exit Scam', cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
};

const HALL_OF_SHAME: Profile[] = [
  {
    href: '/profile/hailey-welch-hawk-tuah-girl-influencer',
    rank: 1,
    name: 'Hailey Welch (Hawk Tuah Girl)',
    initial: 'H',
    verified: true,
    aliases: 'Hawk Tuah, Haliey Welch',
    extraAliases: 1,
    reports: 175,
    summary:
      'Internet personality launched HAWK meme token in Dec 2024 which hit $500M market cap then crashed 90%+ within hours. Over $65M wiped from investor portfolios. Multiple class action lawsuits filed alleging coordinated pump-and-dump. SEC investigation opened.',
    tags: [TAG.pump, TAG.rug],
    loss: '$65.0M',
    twitter: 'haliey_welch',
    date: 'Dec 2024',
  },
  {
    href: '/profile/bybit-exchange-hack-2025-02-21',
    rank: 2,
    name: 'Bybit Exchange Hack',
    initial: 'B',
    verified: true,
    aliases: 'Bybit',
    reports: 120,
    summary:
      'North Korean Lazarus Group compromised Bybit cold wallet via UI spoofing, stealing $1.5B in ETH — the largest crypto hack in history.',
    tags: [TAG.other],
    loss: '$1500.0M',
    date: 'Feb 2025',
  },
  {
    href: '/profile/dmm-bitcoin-exchange-hack-2024-05-31',
    rank: 3,
    name: 'DMM Bitcoin Exchange Hack',
    initial: 'D',
    verified: true,
    reports: 95,
    summary:
      'Japanese exchange DMM Bitcoin hacked for 4,502 BTC (~$305M) by Lazarus Group. Exchange shut down and transferred accounts to SBI VC Trade.',
    tags: [TAG.other],
    loss: '$305.0M',
    date: 'May 2024',
  },
  {
    href: '/profile/lastpass-seed-phrase-thefts-2023-10-25',
    rank: 4,
    name: 'LastPass Seed Phrase Thefts',
    initial: 'L',
    verified: true,
    reports: 90,
    summary:
      '2022 LastPass breach led to $35M+ stolen from crypto wallets through 2023-2024 as attackers cracked master passwords and extracted seed phrases.',
    tags: [TAG.phishing],
    loss: '$35.0M',
    date: 'Oct 2023',
  },
  {
    href: '/profile/wazirx-exchange-hack-2024-07-18',
    rank: 5,
    name: 'WazirX Exchange Hack',
    initial: 'W',
    verified: true,
    reports: 88,
    summary:
      "India's largest crypto exchange drained of $234M via Safe multisig UI manipulation attributed to Lazarus Group. Withdrawals halted; restructuring filed.",
    tags: [TAG.other],
    loss: '$234.0M',
    date: 'Jul 2024',
  },
  {
    href: '/profile/coinbase-social-engineering-2025-05-15',
    rank: 6,
    name: 'Coinbase Social Engineering',
    initial: 'C',
    verified: true,
    reports: 85,
    summary:
      'Attackers bribed Coinbase support contractors to leak KYC data on ~1% of monthly users, then extorted victims. Coinbase refused a $20M ransom; $400M+ remediation costs.',
    tags: [TAG.social],
    loss: '$400.0M',
    date: 'May 2025',
  },
  {
    href: '/profile/euler-finance-exploit-2023-03-13',
    rank: 7,
    name: 'Euler Finance Exploit',
    initial: 'E',
    verified: true,
    reports: 70,
    summary:
      'Flash loan attacked a missing health check in the donate() function, draining $197M. Attacker returned nearly all funds after on-chain negotiation.',
    tags: [TAG.other],
    loss: '$197.0M',
    date: 'Mar 2023',
  },
  {
    href: '/profile/atomic-wallet-hack-2023-06-03',
    rank: 8,
    name: 'Atomic Wallet Hack',
    initial: 'A',
    verified: true,
    reports: 65,
    summary:
      'Lazarus Group exploited Atomic Wallet vulnerabilities, stealing ~$100M from over 5,500 users across multiple blockchains.',
    tags: [TAG.other],
    loss: '$100.0M',
    date: 'Jun 2023',
  },
  {
    href: '/profile/multichain-bridge-collapse-2023-07-06',
    rank: 9,
    name: 'Multichain Bridge Collapse',
    initial: 'M',
    verified: true,
    aliases: 'Fantom Bridge',
    reports: 60,
    summary:
      'Multichain CEO arrested by Chinese authorities, giving government control of keys. Over $126M drained from bridge pools. Protocol shut down.',
    tags: [TAG.other],
    loss: '$126.0M',
    date: 'Jul 2023',
  },
];

const BIGGEST_THREATS: Profile[] = [
  {
    href: '/profile/social-engineering-scam-rekt-2026-01-10',
    rank: 1,
    name: 'Social Engineering Scam',
    initial: 'S',
    reports: 1,
    summary:
      'Quick Summary On January 10, 2026, a victim lost over $282 million worth of Bitcoin and Litecoin (1,459 BTC and 2.05M LTC) through a hardware wallet social engineering scam, with the attacker immediately bridging 928.7 BTC (~$71M) via THORChain to Ethereum.',
    tags: [TAG.phishing],
    loss: '$282.0M',
    date: 'Jan 2026',
  },
  {
    href: '/profile/step-finance-rekt-2026-01-31',
    rank: 2,
    name: 'Step Finance',
    initial: 'S',
    reports: 1,
    summary:
      'Quick Summary On January 31, 2026, Step Finance, a Solana DeFi portfolio tracker, suffered a $27-30M treasury breach when an attacker exploited a "well-known attack vector" to transfer stake authorization from compromised treasury wallets and drain 261,854 SOL.',
    tags: [TAG.other],
    loss: '$30.0M',
    date: 'Jan 2026',
  },
  {
    href: '/profile/truebit-rekt-2026-01-08',
    rank: 3,
    name: 'Truebit',
    initial: 'T',
    reports: 1,
    summary:
      'Quick Summary On January 8, 2026, Truebit Protocol suffered a $26.5 million exploit when an attacker exploited an integer overflow vulnerability in the getPurchasePrice() function, allowing them to mint hundreds of millions of TRU tokens for 0 ETH.',
    tags: [TAG.other],
    loss: '$26.5M',
    date: 'Jan 2026',
  },
];

const TOP_SCAMMER_2025: Profile = HALL_OF_SHAME[1]; // Bybit
const TOP_SCAMMERS_2024: Profile[] = [
  { ...HALL_OF_SHAME[0], rank: 1 },
  { ...HALL_OF_SHAME[2], rank: 2 },
  { ...HALL_OF_SHAME[4], rank: 3 },
];

const TOP_INDIVIDUALS: Profile[] = [
  {
    href: '/profile/justin-sun-influencer',
    rank: 1,
    name: 'Justin Sun',
    initial: 'J',
    verified: true,
    aliases: 'Sun Yuchen, TRON Justin Sun',
    reports: 200,
    summary:
      'TRON founder charged by SEC in 2023 for wash trading ($4.6B in TRX/BTT), market manipulation, and secretly paying celebrities (Lindsay Lohan, Jake Paul, Akon, others) for undisclosed promotions. Also sued for alleged fraud at Poloniex and HTX exchanges. Case ongoing.',
    tags: [TAG.pump, TAG.exit],
    loss: '$4600.0M',
    twitter: 'justinsuntron',
    date: 'Jan 2018',
  },
  {
    href: '/profile/ben-armstrong-bitboy-crypto-influencer',
    rank: 2,
    name: 'Ben Armstrong (BitBoy Crypto)',
    initial: 'B',
    verified: true,
    aliases: 'BitBoy, BitBoy Crypto',
    extraAliases: 1,
    reports: 185,
    summary:
      'YouTube crypto influencer (1.5M+ followers) documented promoting tokens for undisclosed payments, running pump-and-dump schemes on multiple altcoins. Sued by former business partner for fraud. Hit Theory investigations confirmed paid promotions on CRO, MATIC, and others totaling $12M+ in investor losses.',
    tags: [TAG.pump, TAG.social],
    loss: '$12.0M',
    twitter: 'BitBoy_Crypto',
    date: 'Jan 2022',
  },
  { ...HALL_OF_SHAME[0], rank: 3 },
];

const RECENTLY_REPORTED: Profile[] = [
  {
    href: '/profile/hypervault-rekt-2025-09-26',
    rank: 0,
    name: 'Hypervault',
    initial: 'H',
    reports: 1,
    summary:
      'Quick Summary On September 26, 2025, DeFi protocol Hypervault disappeared with approximately $3.6 million in user assets in a suspected exit scam. The project withdrew all funds from Hyperliquid.',
    tags: [TAG.rug],
    loss: '$3.6M',
    date: 'Sep 2025',
  },
  {
    href: '/profile/sbi-crypto-rekt-2025-09-24',
    rank: 0,
    name: 'SBI Crypto',
    initial: 'S',
    reports: 1,
    summary:
      "Quick Summary On September 24, 2025, SBI Crypto, a mining pool subsidiary of Japan's SBI Holdings, suffered a theft of approximately $24 million across five blockchains: Bitcoin, Ethereum, Litecoin, Bitcoin Cash and Dogecoin.",
    tags: [TAG.other],
    loss: '$24.0M',
    date: 'Sep 2025',
  },
  {
    href: '/profile/seedify-rekt-2025-09-23',
    rank: 0,
    name: 'Seedify',
    initial: 'S',
    reports: 1,
    summary:
      "Quick Summary On September 23, 2025, Seedify's SFUND token was exploited by DPRK-linked hackers who compromised a developer's private key to mint unauthorized tokens through the cross-chain bridge.",
    tags: [TAG.other],
    loss: '$1.2M',
    date: 'Sep 2025',
  },
  {
    href: '/profile/griffinai-rekt-2025-09-25',
    rank: 0,
    name: 'GriffinAI',
    initial: 'G',
    reports: 1,
    summary:
      "Quick Summary On September 25, 2025, Griffin AI's GAIN token crashed 90% within 24 hours of launch after an attacker exploited a cross-chain bridge vulnerability to mint 5 billion unauthorized tokens.",
    tags: [TAG.other],
    loss: '$3.0M',
    date: 'Sep 2025',
  },
  {
    href: '/profile/hyperdrive-rekt-2025-09-28',
    rank: 0,
    name: 'Hyperdrive',
    initial: 'H',
    reports: 1,
    summary:
      'Quick Summary On September 28, 2025, Hyperdrive, a lending protocol on the Hyperliquid blockchain, lost approximately $782,000 after an attacker exploited a smart contract vulnerability.',
    tags: [TAG.other],
    loss: null,
    date: 'Sep 2025',
  },
  {
    href: '/profile/abracadabra-rekt-2025-10-04',
    rank: 0,
    name: 'Abracadabra',
    initial: 'A',
    reports: 1,
    summary:
      "Quick Summary On October 4, 2025, Abracadabra Money (MIM_Spell) was exploited for approximately $1.7 million due to a critical flaw in the cook function's implementation logic.",
    tags: [TAG.other],
    loss: '$1.7M',
    date: 'Oct 2025',
  },
];

// ── Card component ──────────────────────────────────────────────────────────
function DarkSideCard({ p }: { p: Profile }) {
  return (
    <Link className="h-full block" href={p.href}>
      <div
        className="group dark-side-card rounded-xl p-5 hover:-translate-y-1 cursor-pointer relative overflow-hidden h-full flex flex-col"
        style={{ border: '1px solid var(--darkside-border)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(100,130,0,0.07) 0%, transparent 65%)' }}
        />
        {p.rank > 0 && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
            style={{
              backgroundColor: 'rgba(55,70,0,0.4)',
              border: '1px solid var(--darkside-border)',
              color: 'var(--darkside-text)',
            }}
          >
            #{p.rank}
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(55,70,0,0.3)',
              color: '#ccff00',
              border: '1px solid rgba(100,130,0,0.5)',
              letterSpacing: '0.08em',
            }}
          >
            ◈ REPORTED
          </div>
          <div
            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(136,153,187,0.1)',
              color: '#8899bb',
              border: '1px solid rgba(136,153,187,0.2)',
            }}
          >
            <UserIcon className="w-3 h-3" /> Person
          </div>
        </div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: 'rgba(55,70,0,0.35)',
                color: 'var(--text-card)',
                border: '1px solid rgba(100,130,0,0.45)',
              }}
            >
              {p.initial}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm" style={{ color: 'var(--text-card)' }}>
                  {p.name}
                </span>
                {p.verified && <VerifiedIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
              </div>
              {p.aliases && (
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  aka {p.aliases}
                  {p.extraAliases ? ` +${p.extraAliases}` : ''}
                </span>
              )}
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--text-card)' }}
          >
            <AlertIcon className="w-3 h-3" />
            {p.reports} report{p.reports === 1 ? '' : 's'}
          </div>
        </div>
        <p
          className="text-sm mb-3 line-clamp-3 leading-relaxed flex-1"
          style={{ color: 'var(--text-card)' }}
        >
          {p.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {p.tags.map((t) => (
            <span
              key={t.label}
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${t.cls}`}
            >
              {t.label}
            </span>
          ))}
        </div>
        <div
          className="flex items-center gap-4 text-xs pt-3"
          style={{ borderTop: '1px solid rgba(80,110,0,0.4)', color: 'var(--text-secondary)' }}
        >
          {p.loss && (
            <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-card)' }}>
              <DollarIcon className="w-3 h-3" />
              {p.loss} lost
            </span>
          )}
          {p.twitter && (
            <span className="flex items-center gap-1">
              <TwitterIcon className="w-3 h-3" />@{p.twitter}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <CalendarIcon className="w-3 h-3" />
            {p.date}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Section divider with neon saber bars ────────────────────────────────────
function SaberDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <hr className="saber-red flex-1" />
      <div
        className="px-3 py-1 rounded text-xs font-black tracking-widest uppercase whitespace-nowrap"
        style={{
          backgroundColor: 'rgba(55,70,0,0.25)',
          color: '#99cc00',
          border: '1px solid rgba(100,130,0,0.45)',
        }}
      >
        {label}
      </div>
      <hr className="saber-red-r flex-1" />
    </div>
  );
}

// ── Live Stats ───────────────────────────────────────────────────────────────
function formatBigUsd(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);

  // Track visibility separately so we can trigger when data arrives
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (target === 0 || started.current) return;
    // Wait until visible AND target is real
    function tryStart() {
      if (!isVisible.current) {
        const t = setTimeout(tryStart, 100);
        return () => clearTimeout(t);
      }
      started.current = true;
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const cancel = tryStart();
    return typeof cancel === 'function' ? cancel : undefined;
  }, [target, duration]);

  return { value, ref };
}

function StatCard({
  icon, mainValue, mainLabel, subValue, subLabel, isMoney = false,
}: {
  icon: React.ReactNode;
  mainValue: number;
  mainLabel: string;
  subValue?: number;
  subLabel?: string;
  isMoney?: boolean;
}) {
  const { value: animMain, ref } = useCountUp(mainValue, 1800);
  const { value: animSub } = useCountUp(subValue ?? 0, 2200);

  const fmt = (n: number) => isMoney ? formatBigUsd(n) : n.toLocaleString();

  return (
    <div
      ref={ref}
      className="rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid rgba(180,255,0,0.2)',
        boxShadow: '0 2px 12px rgba(180,255,0,0.08)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(180,255,0,0.08)' }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black tabular-nums" style={{ color: '#ccff00' }}>
          {mainValue === 0 ? '—' : fmt(animMain)}
        </div>
        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          {mainLabel}
        </div>
      </div>
      {subValue !== undefined && subValue > 0 && (
        <div className="w-full pt-2 mt-1" style={{ borderTop: '1px solid rgba(180,255,0,0.1)' }}>
          <div className="text-sm font-black tabular-nums" style={{ color: 'rgba(204,255,0,0.6)' }}>
            {fmt(animSub)}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {subLabel}
          </div>
        </div>
      )}
    </div>
  );
}

function LiveStats() {
  const [stats, setStats] = useState<{
    events: number; lostUsd: number;
    industryLost: number; industryEvents: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => {
        setStats({
          events: d.totalHackEvents ?? 0,
          lostUsd: d.totalLostUsd ?? 0,
          industryLost: d.industryLostUsd ?? 0,
          industryEvents: d.industryHackEvents ?? 0,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="grid grid-cols-2 gap-4 mb-12">
      <StatCard
        icon={<UsersIcon className="w-5 h-5" style={{ color: '#ccff00' }} />}
        mainValue={loading ? 0 : stats?.events ?? 0}
        mainLabel="Total Incidents"
        subValue={loading ? 0 : stats?.industryEvents ?? 0}
        subLabel="Industry Events · via SlowMist"
      />
      <StatCard
        icon={<DollarIcon className="w-5 h-5" style={{ color: '#ccff00' }} />}
        mainValue={loading ? 0 : stats?.lostUsd ?? 0}
        mainLabel="Tracked in Registry"
        subValue={loading ? 0 : stats?.industryLost ?? 0}
        subLabel="Total Industry Losses · via SlowMist"
        isMoney
      />
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="pt-14 pb-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-widest uppercase"
            style={{
              backgroundColor: 'rgba(74,126,255,0.1)',
              color: 'var(--accent)',
              border: '1px solid rgba(74,126,255,0.3)',
            }}
          >
            <ShieldIcon className="w-3 h-3" />
            Community Threat Intelligence
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Know who you&apos;re working with.{' '}
            <span className="dissolve-reform">Before it&apos;s too late.</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto mb-3 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Scammers operate in the dark. The community fights back. Search our registry before
            trusting anyone in Web3.
          </p>
          <hr className="saber-red max-w-sm mx-auto mb-8" />
          <form className="max-w-xl mx-auto mb-4" action="/directory" method="GET">
            <div className="relative flex items-center">
              <SearchIcon
                className="absolute left-4 w-5 h-5 pointer-events-none"
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                type="text"
                name="q"
                placeholder="Search by name, wallet address, Twitter handle..."
                className="w-full pl-12 pr-28 py-4 rounded-xl placeholder-gray-600 outline-none transition-colors text-sm"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Search
              </button>
            </div>
          </form>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Try: wallet address, Twitter @handle, or project name
          </p>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <LiveStats />

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <SaberDivider label="HOW IT WORKS" />
        <section className="mb-14">
          <h2
            className="text-xl font-black mb-6 tracking-wide text-center"
            style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Protect yourself — 3 steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(74,126,255,0.18)' }}
            >
              <div className="text-4xl font-black mb-3" style={{ color: '#4a7eff', opacity: 0.25 }}>
                01
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Search Before You Work
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Enter a name, wallet, or social handle to check if they&apos;ve been reported.
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(136,153,187,0.15)',
              }}
            >
              <div className="text-4xl font-black mb-3" style={{ color: '#8899bb', opacity: 0.25 }}>
                02
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Review the Evidence
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Community-submitted evidence: transaction hashes, screenshots, and incident
                timelines.
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(220,185,0,0.2)' }}
            >
              <div className="text-4xl font-black mb-3" style={{ color: '#ccff00', opacity: 0.25 }}>
                03
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Report a Scammer
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Spotted one? Submit a report with evidence. Our moderation team reviews before it
                goes live.
              </p>
            </div>
          </div>
        </section>

        {/* ── Dark Side Intel / Hall of Shame ──────────────────────────── */}
        <section className="mb-14">
          <SaberDivider label="◈ DARK SIDE INTEL" />
          <h2
            className="text-2xl font-black mb-1 tracking-wide uppercase text-center"
            style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Hall of Shame
          </h2>
          <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            The Dark Side&apos;s most notorious — ranked by community reports
          </p>

          {/* Most Wanted — TOP 9 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ZapIcon className="w-4 h-4" style={{ color: '#ccff00' }} />
              <h3
                className="font-black text-base tracking-widest uppercase"
                style={{ color: '#99cc00' }}
              >
                Most Wanted
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: 'rgba(55,70,0,0.25)',
                  color: '#ccff00',
                  border: '1px solid rgba(100,130,0,0.4)',
                }}
              >
                TOP 9
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HALL_OF_SHAME.map((p) => (
                <DarkSideCard key={`most-${p.href}`} p={p} />
              ))}
            </div>
          </div>

          {/* This Year's Biggest Threats — TOP 3 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <StarIcon className="w-4 h-4" style={{ color: '#ccff00' }} />
              <h3
                className="font-black text-base tracking-widest uppercase"
                style={{ color: '#99cc00' }}
              >
                This Year&apos;s Biggest Threats
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: 'rgba(55,70,0,0.25)',
                  color: '#ccff00',
                  border: '1px solid rgba(100,130,0,0.4)',
                }}
              >
                TOP 3
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BIGGEST_THREATS.map((p) => (
                <DarkSideCard key={`threat-${p.href}`} p={p} />
              ))}
            </div>
          </div>

          {/* Top Scammer of 2025 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <StarIcon className="w-4 h-4" style={{ color: '#ccff00' }} />
              <h3
                className="font-black text-base tracking-widest uppercase"
                style={{ color: '#99cc00' }}
              >
                Top Scammer of 2025
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: 'rgba(55,70,0,0.25)',
                  color: '#ccff00',
                  border: '1px solid rgba(100,130,0,0.4)',
                }}
              >
                #1
              </span>
            </div>
            <div className="max-w-sm mx-auto">
              <DarkSideCard p={{ ...TOP_SCAMMER_2025, rank: 1 }} />
            </div>
          </div>

          {/* Top Scammers of 2024 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <StarIcon className="w-4 h-4" style={{ color: '#ccff00' }} />
              <h3
                className="font-black text-base tracking-widest uppercase"
                style={{ color: '#99cc00' }}
              >
                Top Scammers of 2024
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: 'rgba(55,70,0,0.25)',
                  color: '#ccff00',
                  border: '1px solid rgba(100,130,0,0.4)',
                }}
              >
                TOP 3
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TOP_SCAMMERS_2024.map((p) => (
                <DarkSideCard key={`s24-${p.href}`} p={p} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Individuals — Top Worst Influencers ──────────────────────── */}
        <section className="mb-14">
          <SaberDivider label="◈ INDIVIDUALS" />
          <h2
            className="text-2xl font-black mb-1 tracking-wide uppercase text-center"
            style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Top Worst Influencers
          </h2>
          <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            The most-reported individuals in the Web3 space
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOP_INDIVIDUALS.map((p) => (
              <DarkSideCard key={`ind-${p.href}`} p={p} />
            ))}
          </div>
        </section>

        {/* ── Projects — Top Worst Projects ────────────────────────────── */}
        <section className="mb-14">
          <SaberDivider label="◈ PROJECTS" />
          <h2
            className="text-2xl font-black mb-1 tracking-wide uppercase text-center"
            style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Top Worst Projects
          </h2>
          <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            The biggest project failures ranked by community losses
          </p>
          <div
            className="rounded-xl p-6 text-center text-sm"
            style={{
              backgroundColor: 'var(--darkside-bg)',
              border: '1px solid rgba(55,70,0,0.35)',
              color: 'rgba(155,200,0,0.6)',
            }}
          >
            No project profiles yet.
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <div
          className="rounded-xl p-4 mb-12 flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <AlertIcon
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: '#eab308' }}
          />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#b45309' }}>Disclaimer:</strong> All profiles represent{' '}
            <strong>alleged</strong> community reports and have not been legally verified. Provided
            for due diligence only. If you believe a profile is inaccurate,{' '}
            <Link href="/dispute" className="hover:underline" style={{ color: 'var(--accent)' }}>
              submit a dispute
            </Link>{' '}
            or{' '}
            <Link href="/appeal" className="hover:underline" style={{ color: 'var(--accent)' }}>
              file an appeal
            </Link>
            .
          </p>
        </div>

        {/* ── Recently Reported (6-card grid) ──────────────────────────── */}
        <section className="mb-16">
          <div className="flex flex-col items-center mb-6 gap-2">
            <h2
              className="text-xl font-black text-center"
              style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
            >
              Recently Reported
            </h2>
            <Link
              href="/directory"
              className="flex items-center gap-1 text-sm font-semibold hover:underline transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              View all <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECENTLY_REPORTED.map((p) => (
              <DarkSideCard key={`recent-${p.href}`} p={p} />
            ))}
          </div>
        </section>

        {/* ── Protect the Community CTA ────────────────────────────────── */}
        <section
          className="mb-16 text-center rounded-2xl py-12 px-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(74,126,255,0.25)',
            boxShadow: '0 0 40px rgba(74,126,255,0.07)',
          }}
        >
          <ShieldIcon
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: 'var(--accent)' }}
          />
          <h2
            className="text-2xl font-black mb-3 sw-title"
            style={{ color: 'var(--text-primary)' }}
          >
            Protect the Community
          </h2>
          <p
            className="mb-6 max-w-md mx-auto text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Help others stay safe. Submit a verified report and help the community avoid bad actors.
            All submissions are reviewed before going live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 20px rgba(74,126,255,0.25)',
              }}
            >
              Submit a Report <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/appeal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <CalendarIcon className="w-4 h-4" />
              File an Appeal
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
