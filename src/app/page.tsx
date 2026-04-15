'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { getTopProfiles, ScammerProfile } from '@/lib/supabase';

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

// ── Tag styles ────────────────────────────────────────────────────────────────
const TAG = {
  pump: { label: 'Pump & Dump', cls: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  rug: { label: 'Rug Pull', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  other: { label: 'Other', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  phishing: { label: 'Phishing', cls: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  social: { label: 'Social Engineering', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  exit: { label: 'Exit Scam', cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatLoss(usd: number | null): string | null {
  if (!usd) return null;
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd.toLocaleString()}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function categoriesToTags(categories: string[]): { label: string; cls: string }[] {
  const tags: { label: string; cls: string }[] = [];
  const lc = categories.map((c) => c.toLowerCase());
  if (lc.some((c) => c.includes('pump'))) tags.push(TAG.pump);
  if (lc.some((c) => c.includes('rug'))) tags.push(TAG.rug);
  if (lc.some((c) => c.includes('phish'))) tags.push(TAG.phishing);
  if (lc.some((c) => c.includes('social') || c.includes('engineering'))) tags.push(TAG.social);
  if (lc.some((c) => c.includes('exit'))) tags.push(TAG.exit);
  if (tags.length === 0) tags.push(TAG.other);
  return tags;
}

// ── LiveDarkSideCard ─────────────────────────────────────────────────────────
function LiveDarkSideCard({ profile, rank }: { profile: ScammerProfile; rank?: number }) {
  const now = new Date();
  const isFeatured = !!(profile.featured_until && new Date(profile.featured_until) > now);
  const tags = categoriesToTags(profile.categories);
  const loss = formatLoss(profile.amount_lost_usd);
  const date = formatDate(profile.incident_date);
  const alias = profile.aliases && profile.aliases.length > 0 ? profile.aliases[0] : null;

  return (
    <Link className="h-full block" href={`/directory/${profile.slug}`}>
      <div
        className="group dark-side-card rounded-xl p-5 hover:-translate-y-1 cursor-pointer relative overflow-hidden h-full flex flex-col"
        style={{ border: '1px solid var(--darkside-border)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(100,130,0,0.07) 0%, transparent 65%)' }}
        />
        {rank && rank > 0 && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
            style={{
              backgroundColor: 'rgba(55,70,0,0.4)',
              border: '1px solid var(--darkside-border)',
              color: 'var(--darkside-text)',
            }}
          >
            #{rank}
          </div>
        )}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
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
            <UserIcon className="w-3 h-3" /> {profile.profile_type === 'person' ? 'Person' : 'Project'}
          </div>
          {isFeatured && (
            <div
              className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(180,130,0,0.2)',
                color: '#f59e0b',
                border: '1px solid rgba(180,130,0,0.4)',
              }}
            >
              ★ FEATURED
            </div>
          )}
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
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm" style={{ color: 'var(--text-card)', letterSpacing: '0.02em' }}>
                  {profile.display_name}
                </span>
                {profile.verified && <VerifiedIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
              </div>
              {alias && (
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  aka {alias}
                  {profile.aliases.length > 1 ? ` +${profile.aliases.length - 1}` : ''}
                </span>
              )}
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--text-card)' }}
          >
            <AlertIcon className="w-3 h-3" />
            {profile.reports_count} report{profile.reports_count === 1 ? '' : 's'}
          </div>
        </div>
        <p
          className="mb-3 line-clamp-3 leading-relaxed flex-1"
          style={{ color: 'var(--text-card)', fontSize: '11px' }}
        >
          {profile.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((t) => (
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
          {loss && (
            <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-card)' }}>
              <DollarIcon className="w-3 h-3" />
              {loss} lost
            </span>
          )}
          {profile.twitter_handle && (
            <span className="flex items-center gap-1">
              <TwitterIcon className="w-3 h-3" />@{profile.twitter_handle}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1 ml-auto">
              <CalendarIcon className="w-3 h-3" />
              {date}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── SkeletonCard ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-xl animate-pulse"
      style={{
        height: '180px',
        backgroundColor: 'rgba(55,70,0,0.15)',
        border: '1px solid rgba(100,130,0,0.2)',
      }}
    />
  );
}

// ── HallOfShameSection ───────────────────────────────────────────────────────
function HallOfShameSection() {
  const [profiles, setProfiles] = useState<ScammerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopProfiles(30).then(({ data }) => {
      setProfiles((data as ScammerProfile[]) ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Most Wanted: top 9 by reports_count (already sorted)
  const mostWanted = profiles.slice(0, 9);

  // Top Worst Influencers: profile_type === 'person', top 3
  const topInfluencers = profiles.filter((p) => p.profile_type === 'person').slice(0, 3);

  // Top Worst Projects: profile_type === 'project', top 3
  const topProjects = profiles.filter((p) => p.profile_type === 'project').slice(0, 3);

  // Recently Added: last 6 by created_at
  const recentlyAdded = [...profiles]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const skeletons = [0, 1, 2];

  return (
    <>
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
            {loading
              ? skeletons.map((i) => <SkeletonCard key={`skel-mw-${i}`} />)
              : mostWanted.map((p, i) => (
                  <LiveDarkSideCard key={`most-${p.id}`} profile={p} rank={i + 1} />
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
          {loading
            ? skeletons.map((i) => <SkeletonCard key={`skel-inf-${i}`} />)
            : topInfluencers.length > 0
              ? topInfluencers.map((p, i) => (
                  <LiveDarkSideCard key={`ind-${p.id}`} profile={p} rank={i + 1} />
                ))
              : (
                <div
                  className="col-span-3 rounded-xl p-6 text-center text-sm"
                  style={{
                    backgroundColor: 'var(--darkside-bg)',
                    border: '1px solid rgba(55,70,0,0.35)',
                    color: 'rgba(155,200,0,0.6)',
                  }}
                >
                  No individual profiles yet.
                </div>
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading
            ? skeletons.map((i) => <SkeletonCard key={`skel-proj-${i}`} />)
            : topProjects.length > 0
              ? topProjects.map((p, i) => (
                  <LiveDarkSideCard key={`proj-${p.id}`} profile={p} rank={i + 1} />
                ))
              : (
                <div
                  className="col-span-3 rounded-xl p-6 text-center text-sm"
                  style={{
                    backgroundColor: 'var(--darkside-bg)',
                    border: '1px solid rgba(55,70,0,0.35)',
                    color: 'rgba(155,200,0,0.6)',
                  }}
                >
                  No project profiles yet.
                </div>
              )}
        </div>
      </section>

      {/* ── Recently Added ───────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex flex-col items-center mb-6 gap-2">
          <h2
            className="text-xl font-black text-center"
            style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Recently Added
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
          {loading
            ? skeletons.map((i) => <SkeletonCard key={`skel-rec-${i}`} />)
            : recentlyAdded.map((p) => (
                <LiveDarkSideCard key={`recent-${p.id}`} profile={p} />
              ))}
        </div>
      </section>
    </>
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

// Shared count-up: triggered by an external visible flag
function useCountUpValue(target: number, duration: number, visible: boolean) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!visible || target === 0 || started.current) return;
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
  }, [target, duration, visible]);
  return value;
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animMain = useCountUpValue(mainValue, 1800, visible);
  const animSub  = useCountUpValue(subValue ?? 0, 2200, visible);
  const fmt = (n: number) => isMoney ? formatBigUsd(n) : n.toLocaleString();

  return (
    <div
      ref={cardRef}
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
          <hr className="saber-red max-w-sm mx-auto mb-4" />
          <p className="text-sm italic mb-8" style={{ color: 'rgba(255,255,255,0.28)' }}>Every rug has a weaver.</p>
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

        {/* ── Hall of Shame + Individuals + Projects + Recently Added ── */}
        <HallOfShameSection />

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
