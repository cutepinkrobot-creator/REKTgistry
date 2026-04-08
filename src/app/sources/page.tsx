export default function SourcesPage() {
  const categories = [
    {
      title: 'Hack & Exploit Databases',
      color: '#ff5050',
      sources: [
        { name: 'De.Fi REKT Database', badge: 'Imported + Live', desc: 'Comprehensive database of DeFi exploits, rug pulls, and protocol hacks with verified loss amounts.' },
        { name: 'Web3 Is Going Great', badge: 'Imported', desc: 'Curated timeline of crypto failures, scams, and hacks maintained by Molly White.' },
        { name: 'CryptoScamDB', badge: 'Imported', desc: 'Community-maintained database of scam URLs, fraudulent addresses, and blacklisted domains.' },
        { name: 'SlowMist Hacked', badge: 'Imported', desc: 'Comprehensive incident registry covering DeFi, CEX, and NFT incidents.' },
      ],
    },
    {
      title: 'On-Chain Security Scanning',
      color: '#39ff14',
      sources: [
        { name: 'GoPlus Security API', badge: 'Live API', desc: 'Real-time token analysis: honeypot detection, tax rates, mintable supply across 30+ blockchains.' },
        { name: 'Honeypot.is', badge: 'Live API', desc: 'Dedicated honeypot detection for EVM tokens. Simulates buy/sell transactions to detect traps.' },
        { name: 'Rugcheck.xyz', badge: 'Live API', desc: 'Solana-specific rug pull risk scoring — token authority and LP lock status.' },
        { name: 'Forta Network', badge: 'Live API', desc: 'Decentralized real-time threat detection with block-by-block on-chain monitoring.' },
        { name: 'Chainabuse', badge: 'Live API', desc: 'Community-reported scam address and URL database operated by TRM Labs covering 16 fraud categories.' },
      ],
    },
    {
      title: 'Address & Domain Blacklists',
      color: '#4a7eff',
      sources: [
        { name: 'MetaMask eth-phishing-detect', badge: 'Imported', desc: '205,000+ blocked phishing domains targeting Web3 users.' },
        { name: 'ScamSniffer Scam Database', badge: 'Imported', desc: 'Phishing domain and wallet address blacklist with 7-day publication delay.' },
        { name: 'OFAC Sanctions List (SDN)', badge: 'Imported', desc: 'U.S. Treasury list of sanctioned crypto addresses including Lazarus Group and ransomware operators.' },
        { name: 'BitcoinAbuse', badge: 'Live API', desc: 'Community-reported Bitcoin address abuse database covering ransomware, scams, and blackmail.' },
      ],
    },
    {
      title: 'Token & Market Data',
      color: '#06b6d4',
      sources: [
        { name: 'DexScreener', badge: 'Live API', desc: 'Real-time DEX pair data: price, volume, and liquidity across chains.' },
        { name: 'CoinGecko', badge: 'Reference', desc: 'Comprehensive token metadata and market data.' },
        { name: 'Etherscan / BscScan / Solscan', badge: 'Reference', desc: 'Block explorers for transaction and contract verification.' },
      ],
    },
    {
      title: 'Wallet Intelligence',
      color: '#8b5cf6',
      sources: [
        { name: 'Bubblemaps', badge: 'Reference', desc: 'Visual wallet clustering tool revealing token distribution and connected wallets.' },
        { name: 'Arkham Intelligence', badge: 'Reference', desc: 'On-chain entity tracking and wallet labeling for fund flow analysis.' },
      ],
    },
    {
      title: 'Security Research',
      color: '#06b6d4',
      sources: [
        { name: 'ZachXBT', badge: 'Reference', desc: 'Independent blockchain investigator. Forensic reports on rug pulls and scam networks.' },
        { name: 'PeckShield', badge: 'Reference', desc: 'Real-time hack alerts with monthly incident summaries.' },
        { name: 'Rekt News', badge: 'Reference', desc: 'Narrative analysis and post-mortems of major DeFi hacks and exploits since 2020.' },
      ],
    },
    {
      title: 'Community Submissions',
      color: '#ccff00',
      sources: [
        { name: 'Community Reports', badge: 'Live', desc: 'Primary source. Victims and researchers submit incident details for moderation review before publication.' },
      ],
    },
  ];

  const badgeColor = (badge: string) => {
    if (badge.includes('Live')) return { bg: 'rgba(57,255,20,0.08)', color: '#39ff14', border: '1px solid rgba(57,255,20,0.2)' };
    if (badge === 'Reference') return { bg: 'rgba(90,96,128,0.15)', color: '#5a6080', border: '1px solid #1f2133' };
    return { bg: 'rgba(74,126,255,0.08)', color: '#4a7eff', border: '1px solid rgba(74,126,255,0.2)' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', color: '#5a6080', letterSpacing: '0.2em', marginBottom: '6px' }}>◈ DATA TRANSPARENCY</div>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '32px', fontWeight: 900, color: '#e2e8f0', marginBottom: '8px' }}>Our Data Sources</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.7, maxWidth: '600px' }}>
        REKTgistry aggregates data from public databases, on-chain APIs, and community submissions. We believe in full transparency about where our data comes from.
      </p>

      <div className="flex flex-col gap-8">
        {categories.map((cat) => (
          <section key={cat.title}>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: cat.color, marginBottom: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {cat.title}
            </h2>
            <div className="flex flex-col gap-3">
              {cat.sources.map((src) => {
                const bc = badgeColor(src.badge);
                return (
                  <div key={src.name} className="rounded-xl p-4 flex items-start gap-4" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>{src.name}</span>
                        <span style={{ fontSize: '9px', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', padding: '2px 6px', borderRadius: '4px', background: bc.bg, color: bc.color, border: bc.border }}>
                          {src.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#5a6080', lineHeight: 1.5 }}>{src.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Future integrations */}
      <section className="mt-10">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#5a6080', marginBottom: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Future Integrations</h2>
        <div className="rounded-xl p-5" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
          <div className="flex flex-wrap gap-2">
            {['Token Sniffer', 'Dune Analytics', 'Chainalysis', 'Certik Skynet', 'Messari', 'HAPI Protocol', 'CA DFPI Crypto Scam Tracker'].map((name) => (
              <span key={name} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(90,96,128,0.1)', color: '#5a6080', border: '1px solid #1f2133' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-8">
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#ccff00', marginBottom: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Methodology</h2>
        <div className="rounded-xl p-5" style={{ background: '#14161e', border: '1px solid #1f2133' }}>
          <ul style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.9, paddingLeft: '16px' }}>
            <li>All profiles are labeled &quot;alleged&quot; — not independently verified</li>
            <li>Source attribution is provided with links to original sources</li>
            <li>On-chain data reflects the state at query time</li>
            <li>Corrections can be requested via the appeal process</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
