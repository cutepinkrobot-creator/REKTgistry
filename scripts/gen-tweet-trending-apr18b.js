const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;
const BG    = '#050507';
const DIM   = 'rgba(204,255,0,0.55)';
const DIMMER= 'rgba(204,255,0,0.38)';
const GRID_A= 0.055;

// ── Helpers ────────────────────────────────────────────────────────────────
function drawBg(ctx, glow1, glow2, gridColor) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gridColor || `rgba(204,255,0,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, glow1); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, glow2); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}
// gistry always white
function drawLogo(ctx) {
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#d0d8e8'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
}
function drawBadge(ctx, text, color) {
  ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24, bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = color + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = color + '0e'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = color; ctx.fillText(text, W - 52, by + 12);
}
function drawNeonLine(ctx, y, color) {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.3, color); g.addColorStop(0.7, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = g; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}
function drawDivider(ctx, y, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
}
function drawBottomBar(ctx, AC, right) {
  ctx.fillStyle = AC + '0a'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = AC + '22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('REKTgistry.com', 52, H - 35);
  ctx.shadowBlur = 0; ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText(right, W - 52, H - 35);
}
// Big outlined headline text
function bigText(ctx, text, x, y, font, fillColor, AC) {
  ctx.font = font;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.strokeText(text, x, y);
  ctx.shadowColor = AC; ctx.shadowBlur = 12;
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}
function drawPills(ctx, pills, py, ph, AC) {
  const pw = (W - 104 - (pills.length - 1) * 16) / pills.length;
  let px = 52;
  pills.forEach(p => {
    ctx.fillStyle = AC + '10'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = AC; ctx.shadowBlur = 3;
    ctx.fillStyle = AC; ctx.font = 'bold 22px Orbitron';
    ctx.fillText(p.value, px + pw / 2, py + ph * 0.36);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(p.label, px + pw / 2, py + ph * 0.72);
    px += pw + 16;
  });
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 1 — Meta-1 Coin: 23-Year Sentence  →  LIME GREEN (justice served)
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#22c55e';  // green-500

  drawBg(ctx,
    'rgba(21,128,61,0.07)',
    'rgba(20,83,45,0.05)',
    `rgba(34,197,94,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ JUSTICE SERVED · APRIL 17, 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('META-1 COIN FRAUD — ROBERT DUNLAP — TEXAS', 52, 118);

  bigText(ctx, '23 YRS', 52, 215, 'bold 112px Orbitron', AC, AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('federal prison sentence', 52, 274);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('defrauded ~1,000 investors of $20M with a completely fake token', 52, 302);

  // Vertical divider
  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 328); ctx.stroke();

  const pts = [
    { text: 'Token "backed by $1B Picasso art"',    col: 'rgba(255,255,255,0.82)' },
    { text: 'Promised 224,923% returns, zero risk', col: 'rgba(134,239,172,0.90)' },
    { text: '$215,000 of stolen funds: a Ferrari',  col: `${AC}dd`               },
    { text: 'Operated Meta-1 Coin Trust 2018–2023', col: 'rgba(200,240,200,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 618, 130 + i * 52);
  });

  const edge = ctx.createLinearGradient(0, 100, 0, 328);
  edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}77`); edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 328); ctx.stroke();

  drawDivider(ctx, 342, `${AC}18`);

  drawPills(ctx, [
    { value: '$20M',      label: 'STOLEN FROM INVESTORS' },
    { value: '~1,000',    label: 'VICTIMS DEFRAUDED' },
    { value: '224,923%',  label: 'PROMISED RETURNS' },
  ], 358, 72, AC);

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("He bought a Ferrari. Now he has 23 years to think about it.", 52, 470);

  drawBottomBar(ctx, AC, 'Source: CoinTelegraph · Bitcoinist · April 17, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-meta1-sentence.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: meta1-sentence (green)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 2 — Pig Butchering / Romance Scams  →  ROSE / PINK-PURPLE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#e879f9';  // fuchsia-400

  drawBg(ctx,
    'rgba(192,38,211,0.07)',
    'rgba(134,25,143,0.04)',
    `rgba(232,121,249,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ SECRET SERVICE WARNING · APRIL 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';

  bigText(ctx, '$4B+', W / 2, 185, 'bold 118px Orbitron', AC, AC);

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 26px Orbitron';
  ctx.fillText('stolen through pig butchering scams', W / 2, 255);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('romance + fake investment platform = total wipeout', W / 2, 285);

  drawDivider(ctx, 312, `${AC}18`);

  // How it works — 3 step pills
  const steps = [
    { num: '01', title: 'Fake relationship',  sub: '"accidentally" texts or DMs you first' },
    { num: '02', title: 'Build trust',        sub: 'weeks of conversation, fake affection' },
    { num: '03', title: 'Introduce platform', sub: 'fake exchange, fake profits, real loss' },
  ];
  const pw = (W - 104 - 32) / 3; let px = 52;
  steps.forEach(s => {
    ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 328, pw, 90, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.shadowColor = AC; ctx.shadowBlur = 4;
    ctx.fillStyle = AC; ctx.font = 'bold 22px Orbitron';
    ctx.fillText(s.num, px + 16, 328 + 26);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 13px Orbitron';
    ctx.fillText(s.title, px + 16, 328 + 52);
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.sub, px + 16, 328 + 72);
    px += pw + 16;
  });

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('U.S. Secret Service issued official warning April 17 · scams up 40% YoY', W / 2, 458);
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("They didn't fall in love with you. They fell in love with your wallet.", W / 2, 482);

  drawBottomBar(ctx, AC, 'Source: U.S. Secret Service · TRM Labs · April 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-pig-butchering.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: pig-butchering (fuchsia)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 3 — Meme Coin Rug Pulls  →  HOT PINK / MAGENTA
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#f472b6';  // pink-400

  drawBg(ctx,
    'rgba(236,72,153,0.07)',
    'rgba(157,23,77,0.04)',
    `rgba(244,114,182,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ MEME COIN ALERT · 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('RUG PULL STATISTICS — MEME COIN SEASON 2026', 52, 118);

  bigText(ctx, '$5K/day', 52, 218, 'bold 106px Orbitron', AC, AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('drained from meme coin traders on average', 52, 278);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('every single day in 2026 — not a headline, just a tuesday', 52, 306);

  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 330); ctx.stroke();

  const pts = [
    { text: 'Token creation tools are free & instant', col: 'rgba(255,255,255,0.82)' },
    { text: 'Liquidity pulled hours after launch',     col: 'rgba(249,168,212,0.90)' },
    { text: 'Dev wallets pre-loaded before public',    col: `${AC}dd`               },
    { text: 'Fake audits & KYC used as trust signals', col: 'rgba(255,200,230,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 618, 130 + i * 52);
  });

  const edge = ctx.createLinearGradient(0, 100, 0, 330);
  edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}77`); edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 330); ctx.stroke();

  drawDivider(ctx, 344, `${AC}18`);

  drawPills(ctx, [
    { value: 'Daily',   label: 'RUG PULLS HAPPENING' },
    { value: '$5K avg', label: 'STOLEN PER INCIDENT' },
    { value: '6,500%',  label: 'YoY INCREASE IN Q1' },
  ], 358, 72, AC);

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("If the community is hype and the contract is unaudited, it's a trap.", 52, 470);

  drawBottomBar(ctx, AC, 'Source: coinranking.com · 2026 Rug Pull Report');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-meme-rugs.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: meme-rugs (pink)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 4 — Truebit: Old Unaudited Contract  →  BLUE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#60a5fa';  // blue-400

  drawBg(ctx,
    'rgba(37,99,235,0.07)',
    'rgba(29,78,216,0.04)',
    `rgba(96,165,250,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ DEFI EXPLOIT · JANUARY 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('TRUEBIT PROTOCOL — CONTRACT DEPLOYED 2021, NEVER AUDITED', 52, 118);

  bigText(ctx, '$26.4M', 52, 210, 'bold 110px Orbitron', AC, AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('drained via integer overflow bug', 52, 272);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('8,535 ETH stolen · $TRU token wiped to zero in minutes', 52, 300);

  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 325); ctx.stroke();

  const pts = [
    { text: 'Smart contract deployed in 2021',      col: 'rgba(255,255,255,0.82)' },
    { text: 'No public third-party audit on record', col: 'rgba(147,197,253,0.90)' },
    { text: 'Attacker minted $26M in free tokens',  col: `${AC}dd`               },
    { text: 'Token price crashed to $0 same day',   col: 'rgba(200,220,255,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 618, 130 + i * 52);
  });

  const edge = ctx.createLinearGradient(0, 100, 0, 325);
  edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}77`); edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 325); ctx.stroke();

  drawDivider(ctx, 338, `${AC}18`);

  drawPills(ctx, [
    { value: '$26.4M',  label: 'STOLEN IN ETH' },
    { value: '5 YRS',   label: 'CONTRACT AGE AT HACK' },
    { value: '$0',      label: '$TRU TOKEN VALUE AFTER' },
  ], 354, 72, AC);

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("Old contracts don't retire. They just wait to get exploited.", 52, 466);

  drawBottomBar(ctx, AC, 'Source: therecord.media · cryptopotato · Jan 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-truebit-hack.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: truebit-hack (blue)');
}
