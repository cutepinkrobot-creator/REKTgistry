// Registry update — confirmed hacks & scams May–October 2026
// Sources: TRM Labs, PeckShield/CertiK monthly reports, Nominis, CoinDesk, Cointelegraph
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
    display_name: 'Bitget Exchange Exploiter',
    profile_type: 'project',
    aliases: ['Bitget Hack', 'Bitget Zero-Day'],
    categories: ['exchange-hack', 'hack'],
    summary: 'Bitget was hacked for $387.5M on September 24, 2026 — the largest crypto theft of the year. Attackers compromised the exchange\'s wallet infrastructure and manipulated transaction data so unauthorized withdrawals passed Bitget\'s own authorization process, draining hot and warm wallets. Private keys and cold storage were not breached. Initially estimated at $351.6M, the figure was later revised up to $387.5M. Bitget covered losses from its own balance sheet and replenished its Protection Fund.',
    amount_lost_usd: 387500000,
    incident_date: '2026-09-24',
    chain: 'Multiple',
    verified: true,
  },
  {
    display_name: 'Liquid Network Exploiter',
    profile_type: 'project',
    aliases: ['Liquid Network Hack', 'Blockstream Liquid Exploit'],
    categories: ['defi-exploit', 'hack'],
    summary: 'Blockstream\'s Liquid Network Bitcoin sidechain was exploited for ~$319M on September 6, 2026 via a bug in its validator software that let attackers mint unbacked synthetic bitcoin and cash it out for real BTC — briefly the biggest hack of 2026. The attackers, claiming to be white hats, negotiated with Blockstream and returned about 85% (~$285M). The remaining ~$48M was kept as a self-awarded "bounty."',
    amount_lost_usd: 319000000,
    incident_date: '2026-09-06',
    chain: 'Bitcoin',
    verified: true,
  },
  {
    display_name: 'Coldcard Firmware Exploiter',
    profile_type: 'project',
    aliases: ['Coldcard Hack', 'Coinkite Coldcard Drain'],
    categories: ['hack', 'wallet-drainer'],
    summary: 'Starting July 30, 2026, attackers drained roughly 1,816 BTC (~$116M) from over 5,200 Coldcard hardware wallet addresses across four waves — the largest hardware wallet exploit of 2026. The root cause was a 2021 firmware bug that weakened seed phrase randomness, making keys brute-forceable. The drain continued into early August. In October, Coldcard\'s official X account was also hijacked to push a fake firmware alert pointing to a phishing site.',
    amount_lost_usd: 116000000,
    incident_date: '2026-07-30',
    chain: 'Bitcoin',
    verified: true,
  },
  {
    display_name: 'Ledger SE Asia Drainer Ring',
    profile_type: 'project',
    aliases: ['Ledger October Breach', 'Ledger Data Breach Drains'],
    categories: ['phishing', 'wallet-drainer', 'scam'],
    summary: 'Reports from October 9–11, 2026 describe a data breach at Ledger followed by coordinated wallet draining across Southeast Asia, with over $86M traced to a handful of collection addresses. A fake rebuilt Ledger site ranking high in Google results asks victims for their 24-word seed phrase. Figures are preliminary and from limited outlets — treat amounts as unconfirmed while investigation continues.',
    amount_lost_usd: 86000000,
    incident_date: '2026-10-09',
    chain: 'Multiple',
    verified: false,
  },
  {
    display_name: 'Humanity Protocol Exploiter',
    profile_type: 'project',
    aliases: ['Humanity Protocol Hack', '$H Token Exploit'],
    categories: ['defi-exploit', 'hack', 'key-compromise'],
    summary: 'Humanity Protocol was exploited for an estimated $30–32M on June 9, 2026 after a foundation member\'s private key was stolen. The attacker drained over $30M from 17 Ethereum wallets, then extended the attack to BNB Chain by seizing proxy admin control and minting 100 million extra $H tokens (~$12.9M).',
    amount_lost_usd: 31000000,
    incident_date: '2026-06-09',
    chain: 'Ethereum',
    verified: true,
  },
  {
    display_name: 'AFX Trade Bridge Exploiter',
    profile_type: 'project',
    aliases: ['AFX Trade Hack', 'AFX Bridge Exploit'],
    categories: ['defi-exploit', 'hack', 'bridge-exploit'],
    summary: 'AFX Trade, an Arbitrum-based protocol, lost $24.15M in USDC on July 22, 2026 after five compromised validator signatures cleared the two-thirds quorum on its Arbitrum bridge, letting the attacker authorize fraudulent withdrawals.',
    amount_lost_usd: 24150000,
    incident_date: '2026-07-22',
    chain: 'Arbitrum',
    verified: true,
  },
  {
    display_name: 'VerusCoin Bridge Exploiter',
    profile_type: 'project',
    aliases: ['VerusCoin Bridge Hack'],
    categories: ['defi-exploit', 'hack', 'bridge-exploit'],
    summary: 'The VerusCoin Bridge was exploited twice in 2026: $11.6M in May and another $7.54M in July (~$19.1M total), making it one of the repeat-victim bridges of the year.',
    amount_lost_usd: 19100000,
    incident_date: '2026-05-20',
    chain: 'Multiple',
    verified: true,
  },
  {
    display_name: 'THORChain Treasury Exploiter',
    profile_type: 'project',
    aliases: ['THORChain Vault Exploit 2026'],
    categories: ['defi-exploit', 'hack'],
    summary: 'THORChain suffered a treasury exploit on May 15, 2026. A breach of one vault drained more than $10.7M in protocol-owned funds across at least nine chains.',
    amount_lost_usd: 10700000,
    incident_date: '2026-05-15',
    chain: 'Multiple',
    verified: true,
  },
  {
    display_name: 'Trusted Volumes Exploiter',
    profile_type: 'project',
    aliases: ['TrustedVolumes Hack', '1inch Market Maker Exploit'],
    categories: ['defi-exploit', 'hack', 'smart-contract'],
    summary: 'Trusted Volumes, a market maker for 1inch, lost ~$6.7M on May 7, 2026 on Ethereum after a flaw in its core signature validation logic let an attacker forge trading orders.',
    amount_lost_usd: 6700000,
    incident_date: '2026-05-07',
    chain: 'Ethereum',
    verified: true,
  },
  {
    display_name: 'TitanX Bridge Exploiter',
    profile_type: 'project',
    aliases: ['TitanX Bridge Hack'],
    categories: ['defi-exploit', 'hack', 'bridge-exploit'],
    summary: 'TitanX\'s bridge lost ~$6.3M on June 20, 2026 when a cross-chain verification flaw let attackers forge withdrawal proofs and mint bridged assets without proper validation.',
    amount_lost_usd: 6300000,
    incident_date: '2026-06-20',
    chain: 'Ethereum',
    verified: true,
  },
  {
    display_name: 'Summer.fi Vault Exploiter',
    profile_type: 'project',
    aliases: ['Lazy Summer Vault Hack', 'Summer.fi Flash Loan Attack'],
    categories: ['defi-exploit', 'hack', 'flash-loan'],
    summary: 'Summer.fi\'s Lazy Summer vault lost ~$6M in USDC and DAI on Ethereum to a flash-loan attack on July 6, 2026. The losses were severe enough that the protocol subsequently began winding down operations.',
    amount_lost_usd: 6000000,
    incident_date: '2026-07-06',
    chain: 'Ethereum',
    verified: true,
  },
];

async function seed() {
  console.log(`Inserting ${hacks.length} entries...`);
  for (const hack of hacks) {
    const slug = toSlug(hack.display_name);
    // skip if an entry with this slug already exists
    const { data: existing } = await supabase
      .from('scammer_profiles').select('id').eq('slug', slug).maybeSingle();
    if (existing) { console.log(`– skipped (exists): ${hack.display_name}`); continue; }

    const { data, error } = await supabase
      .from('scammer_profiles')
      .insert({
        ...hack,
        slug,
        twitter_handle: null,
        telegram_handle: null,
        wallet_addresses: [],
        status: 'approved',
        reports_count: 1,
        created_at: new Date().toISOString(),
      })
      .select('id, display_name')
      .single();

    if (error) console.error(`✗ ${hack.display_name}:`, error.message);
    else console.log(`✓ ${data.display_name}`);
  }
  console.log('Done.');
}

seed();
