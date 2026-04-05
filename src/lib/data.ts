export type ScamCategory =
  | 'Pump & Dump'
  | 'Rug Pull'
  | 'Phishing'
  | 'Social Engineering'
  | 'Exchange Hack'
  | 'Exit Scam'
  | 'Fake Project'
  | 'Wash Trading'
  | 'Other';

export type ProfileType = 'Person' | 'Project' | 'Exchange';

export interface Profile {
  id: string;
  slug: string;
  name: string;
  aliases?: string[];
  type: ProfileType;
  category: ScamCategory[];
  reports: number;
  lossUsd: number;
  summary: string;
  twitter?: string;
  date: string;
  featured?: boolean;
  rank?: number;
}

export const topIndividuals: Profile[] = [
  {
    id: '1',
    slug: 'justin-sun',
    name: 'Justin Sun',
    aliases: ['@justinsuntron'],
    type: 'Person',
    category: ['Wash Trading'],
    reports: 200,
    lossUsd: 4_600_000_000,
    summary: 'Accused of orchestrating massive wash trading schemes and market manipulation across multiple exchanges. Subject of SEC charges.',
    twitter: 'justinsuntron',
    date: '2024-03-01',
    rank: 1,
    featured: true,
  },
  {
    id: '2',
    slug: 'ben-armstrong',
    name: 'Ben Armstrong',
    aliases: ['BitBoy Crypto', '@BitBoy_Crypto'],
    type: 'Person',
    category: ['Pump & Dump'],
    reports: 185,
    lossUsd: 12_000_000,
    summary: 'YouTube influencer with 1.5M+ followers accused of coordinated pump-and-dump schemes and undisclosed paid promotions.',
    twitter: 'BitBoy_Crypto',
    date: '2024-06-01',
    rank: 2,
  },
  {
    id: '3',
    slug: 'hailey-welch',
    name: 'Hailey Welch',
    aliases: ['Hawk Tuah Girl', '@haliey_welch'],
    type: 'Person',
    category: ['Pump & Dump', 'Rug Pull'],
    reports: 175,
    lossUsd: 65_000_000,
    summary: 'Launched HAWK token in December 2024. Price dumped 90%+ within hours of launch. Community reports coordinated insider selling.',
    twitter: 'haliey_welch',
    date: '2024-12-04',
    rank: 3,
  },
];

export const recentIncidents: Profile[] = [
  {
    id: '10',
    slug: 'hypervault',
    name: 'Hypervault',
    type: 'Project',
    category: ['Rug Pull'],
    reports: 42,
    lossUsd: 3_600_000,
    summary: 'Developers pulled liquidity and abandoned project after launch. Social accounts deleted.',
    date: '2025-09-14',
  },
  {
    id: '11',
    slug: 'sbi-crypto',
    name: 'SBI Crypto',
    type: 'Exchange',
    category: ['Exchange Hack'],
    reports: 38,
    lossUsd: 24_000_000,
    summary: 'Cross-chain bridge compromise affecting multiple blockchains. Funds drained through a series of transactions.',
    date: '2025-09-10',
  },
  {
    id: '12',
    slug: 'seedify',
    name: 'Seedify',
    type: 'Project',
    category: ['Other'],
    reports: 29,
    lossUsd: 1_200_000,
    summary: 'Developer private key compromise led to unauthorized token minting and fund drainage.',
    date: '2025-09-08',
  },
  {
    id: '13',
    slug: 'griffinai',
    name: 'GriffinAI',
    type: 'Project',
    category: ['Other'],
    reports: 31,
    lossUsd: 3_000_000,
    summary: 'Cross-chain bridge exploit. Attacker manipulated oracle price feeds to drain liquidity pools.',
    date: '2025-09-05',
  },
  {
    id: '14',
    slug: 'hyperdrive',
    name: 'Hyperdrive',
    type: 'Project',
    category: ['Other'],
    reports: 27,
    lossUsd: 782_000,
    summary: 'Arbitrary call vulnerability in the protocol allowed attacker to redirect user funds.',
    date: '2025-09-03',
  },
  {
    id: '15',
    slug: 'abracadabra',
    name: 'Abracadabra',
    type: 'Project',
    category: ['Other'],
    reports: 44,
    lossUsd: 1_700_000,
    summary: "Cook function flaw exploited in a flash loan attack targeting the protocol's cauldron contracts.",
    date: '2025-10-01',
  },
];

export const allProfiles: Profile[] = [
  ...topIndividuals,
  {
    id: '4',
    slug: 'bybit-hack',
    name: 'Bybit Exchange Hack',
    aliases: ['Lazarus Group'],
    type: 'Exchange',
    category: ['Exchange Hack'],
    reports: 120,
    lossUsd: 1_500_000_000,
    summary: 'North Korean Lazarus Group compromised Bybit cold wallet infrastructure. Largest exchange hack in history at time of incident.',
    date: '2025-02-21',
    rank: 1,
  },
  {
    id: '5',
    slug: 'dmm-bitcoin',
    name: 'DMM Bitcoin Exchange Hack',
    type: 'Exchange',
    category: ['Exchange Hack'],
    reports: 95,
    lossUsd: 305_000_000,
    summary: 'Japanese exchange DMM Bitcoin suffered private key compromise leading to unauthorized Bitcoin transfers.',
    date: '2024-05-31',
  },
  {
    id: '6',
    slug: 'veloradex',
    name: 'VeloraDEX',
    type: 'Project',
    category: ['Other'],
    reports: 18,
    lossUsd: 20_000,
    summary: 'Exploited vulnerability in Augustus V6 contract. Attacker drained user funds through a malformed swap call.',
    date: '2025-10-15',
  },
  {
    id: '7',
    slug: 'squid-protocol',
    name: 'Squid',
    type: 'Project',
    category: ['Other'],
    reports: 22,
    lossUsd: 90_000,
    summary: 'Logic bug in sponsorOrderUsingPermit2() function allowed unauthorized fund extraction.',
    date: '2025-10-12',
  },
  {
    id: '8',
    slug: 'oraclebnb',
    name: 'OracleBNB',
    type: 'Project',
    category: ['Rug Pull', 'Exit Scam'],
    reports: 35,
    lossUsd: 80_000,
    summary: 'Rug pull on BNB Chain. Developer wallets drained liquidity pools within 48 hours of launch.',
    date: '2025-10-10',
  },
  {
    id: '9',
    slug: 'typus-finance',
    name: 'Typus Finance',
    type: 'Project',
    category: ['Other'],
    reports: 26,
    lossUsd: 3_440_000,
    summary: 'Oracle manipulation attack targeting the protocol\'s price feeds. Attacker profited via inflated collateral valuations.',
    date: '2025-10-08',
  },
  ...recentIncidents,
];

export function formatUsd(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export const STATS = {
  totalProfiles: 12860,
  totalLossUsd: 688_000_000,
  communityReports: 9_400,
  dataSources: 20,
};
