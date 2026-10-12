require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const hacks = [
  {
    display_name: 'KelpDAO Exploiter',
    profile_type: 'project',
    aliases: ['KelpDAO Hack', 'Lazarus KelpDAO'],
    twitter_handle: null,
    telegram_handle: null,
    wallet_addresses: [],
    categories: ['defi-exploit', 'hack'],
    summary: 'KelpDAO was exploited for $292M in April 2026 in what became the largest DeFi hack of the year. The attacker drained rsETH liquidity across multiple chains, then borrowed an additional $236M against the stolen assets. The attack has been attributed to North Korea\'s Lazarus Group by multiple blockchain security firms. The hack triggered $9B in TVL to flee Aave in a single weekend.',
    amount_lost_usd: 292000000,
    incident_date: '2026-04-18',
    chain: 'Ethereum',
    status: 'approved',
    verified: true,
    reports_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    display_name: 'Volo Protocol Exploiter',
    profile_type: 'project',
    aliases: ['Volo Hack', 'Volo Sui Exploit'],
    twitter_handle: null,
    telegram_handle: null,
    wallet_addresses: [],
    categories: ['defi-exploit', 'hack'],
    summary: 'Volo Protocol was exploited for $3.5M on the Sui blockchain on April 22, 2026. The attacker gained access via a suspected compromised admin private key — not a smart contract bug. Three vaults holding WBTC, XAUm, and USDC were drained. The attacker attempted to bridge out 19.6 WBTC but was blocked. $500K in stolen funds were frozen within 30 minutes. The team pledged to cover the full $3.5M loss themselves with no user losses.',
    amount_lost_usd: 3500000,
    incident_date: '2026-04-22',
    chain: 'Sui',
    status: 'approved',
    verified: true,
    reports_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    display_name: 'Drift Protocol Exploiter',
    profile_type: 'project',
    aliases: ['Drift Hack'],
    twitter_handle: null,
    telegram_handle: null,
    wallet_addresses: [],
    categories: ['defi-exploit', 'hack'],
    summary: 'Drift Protocol was exploited for $285M on April 1, 2026, making it one of the largest single DeFi hacks of the year. The exploit contributed to April 2026 becoming the worst month for crypto hacks since the $1.4B Bybit breach in February 2025, with over $606M in total losses across 18 days.',
    amount_lost_usd: 285000000,
    incident_date: '2026-04-01',
    chain: 'Solana',
    status: 'approved',
    verified: true,
    reports_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    display_name: 'Truebit Protocol Exploiter',
    profile_type: 'project',
    aliases: ['Truebit Hack', 'TRU Exploit'],
    twitter_handle: null,
    telegram_handle: null,
    wallet_addresses: [],
    categories: ['defi-exploit', 'hack', 'smart-contract'],
    summary: 'Truebit Protocol was exploited for $26.4M (8,535 ETH) on January 8, 2026 — the first major DeFi hack of the year. The attacker exploited an integer overflow bug in a smart contract deployed in 2021 that had never been audited. The flaw allowed the attacker to mint TRU tokens at zero cost and sell them back into the bonding curve. The TRU token crashed 99.9% to zero on the same day.',
    amount_lost_usd: 26400000,
    incident_date: '2026-01-08',
    chain: 'Ethereum',
    status: 'approved',
    verified: true,
    reports_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    display_name: 'Fake Ledger Live App Scammers',
    profile_type: 'project',
    aliases: ['Fake Ledger Live', 'Apple App Store Ledger Scam'],
    twitter_handle: null,
    telegram_handle: null,
    wallet_addresses: [],
    categories: ['phishing', 'impersonation', 'scam'],
    summary: 'Scammers published a fake Ledger Live app on the Apple App Store that mimicked the real app perfectly. The app prompted users to enter their seed phrases, which were immediately stolen. Over 50 victims lost a combined $9.5M across Bitcoin, Ethereum, Solana, Tron, and Ripple. The stolen funds were laundered through KuCoin using 150+ addresses. The app was live for approximately 7 days before being removed. Flagged by @zachxbt on April 14, 2026.',
    amount_lost_usd: 9500000,
    incident_date: '2026-04-07',
    chain: 'Multiple',
    status: 'approved',
    verified: true,
    reports_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    display_name: '$RAVE Token Insiders',
    profile_type: 'project',
    aliases: ['RAVE Manipulation', 'RAVE Pump'],
    twitter_handle: null,
    telegram_handle: null,
    wallet_addresses: [],
    categories: ['market-manipulation', 'insider-trading'],
    summary: 'The $RAVE token was allegedly pumped through insider-driven market manipulation, reaching a $26B fully diluted valuation and breaking into the top 20 by market cap with no credible catalyst. @zachxbt called on Binance, Bitget, and Gate.io to investigate and offered a $10,000 whistleblower bounty. The token pumped 3,765% before crashing over 90%.',
    amount_lost_usd: null,
    incident_date: '2026-04-15',
    chain: 'Multiple',
    status: 'approved',
    verified: true,
    reports_count: 1,
    created_at: new Date().toISOString(),
  },
];

async function seedHacks() {
  console.log(`Inserting ${hacks.length} entries...`);
  for (const hack of hacks) {
    const { data, error } = await supabase
      .from('scammer_profiles')
      .insert({ ...hack, slug: toSlug(hack.display_name) })
      .select('id, display_name')
      .single();

    if (error) {
      console.error(`✗ ${hack.display_name}:`, error.message);
    } else {
      console.log(`✓ ${data.display_name} (id: ${data.id})`);
    }
  }
  console.log('Done.');
}

seedHacks();
