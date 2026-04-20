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

// ── Shared helpers ─────────────────────────────────────────────────────────
function drawBackground(ctx, glow1, glow2, gridColor) {
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

// gistry stays white (#d0d8e8) — always
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
function drawBottomBar(ctx, accentColor, rightText) {
  ctx.fillStyle = accentColor + '0a'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = accentColor + '22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('REKTgistry.com', 52, H - 35);
  ctx.shadowBlur = 0; ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText(rightText, W - 52, H - 35);
}
function drawPills(ctx, pills, py, ph, color) {
  const pw = (W - 104 - (pills.length - 1) * 16) / pills.length;
  let px = 52;
  pills.forEach(p => {
    ctx.fillStyle = color + '10'; ctx.strokeStyle = color + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = color; ctx.shadowBlur = 3;
    ctx.fillStyle = color; ctx.font = 'bold 22px Orbitron';
    ctx.fillText(p.value, px + pw / 2, py + ph * 0.36);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(p.label, px + pw / 2, py + ph * 0.72);
    px += pw + 16;
  });
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 1 — France Wrench Attacks  →  DEEP BLUE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#3b82f6';   // blue-500

  drawBackground(ctx,
    'rgba(37,99,235,0.08)',
    'rgba(29,78,216,0.05)',
    `rgba(59,130,246,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '⚠ PHYSICAL THREAT · APRIL 2026', AC);
  drawDivider(ctx, 90, `${AC}25`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}99`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('FRANCE — 41 KIDNAPPINGS IN 2026 ALONE', 52, 118);

  ctx.shadowColor = AC; ctx.shadowBlur = 14;
  ctx.fillStyle = AC; ctx.font = 'bold 100px Orbitron';
  ctx.fillText('1 every', 52, 194);
  ctx.fillText('2.5 days', 52, 295);
  ctx.shadowBlur = 0;

  // Right panel divider
  ctx.strokeStyle = `${AC}22`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(630, 108); ctx.lineTo(630, 370); ctx.stroke();

  const facts = [
    { text: 'Armed thugs forcing seed phrase reveals',    col: 'rgba(255,255,255,0.82)' },
    { text: 'Family abducted to unlock time-locked wallet', col: 'rgba(147,197,253,0.90)' },
    { text: '+75% globally — France holds 40% of cases',  col: `${AC}dd` },
    { text: 'Govt prevention platform launched Apr 16',   col: 'rgba(200,220,255,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  facts.forEach((f, i) => {
    ctx.fillStyle = f.col;
    ctx.fillText('→  ' + f.text, 658, 138 + i * 60);
  });

  const edge = ctx.createLinearGradient(0, 90, 0, 370);
  edge.addColorStop(0, `${AC}00`);
  edge.addColorStop(0.5, `${AC}88`);
  edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 90); ctx.lineTo(8, 370); ctx.stroke();

  drawDivider(ctx, 382, `${AC}18`);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("They don't need your password. They have your family.", 52, 426);
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Crypto wealth is on-chain. Your safety is not.', 52, 452);

  drawBottomBar(ctx, AC, 'Source: crypto.news · CoinDesk · April 17, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-wrench-attacks.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: wrench-attacks (blue)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 2 — KuCoin Laundering  →  TEAL / CYAN  (fixed text layout)
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#06b6d4';   // cyan-500

  drawBackground(ctx,
    'rgba(6,182,212,0.06)',
    'rgba(0,120,160,0.04)',
    `rgba(6,182,212,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ EXCHANGE EXPOSED · APRIL 14, 2026', AC);
  drawDivider(ctx, 90, `${AC}25`);

  // Big number left
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = AC; ctx.shadowBlur = 12;
  ctx.fillStyle = AC; ctx.font = 'bold 118px Orbitron';
  ctx.fillText('$13M+', 52, 192);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 21px Orbitron';
  ctx.fillText('laundered through KuCoin', 52, 264);
  ctx.fillStyle = `${AC}cc`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('flagged by @zachxbt · April 14, 2026', 52, 292);

  // Vertical divider
  ctx.strokeStyle = `${AC}22`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(580, 108); ctx.lineTo(580, 320); ctx.stroke();

  // Right side bullets — 4 items with generous spacing, all within 108–318
  const pts = [
    { text: '$9.5M — fake Ledger Live app scam',   col: 'rgba(255,255,255,0.82)' },
    { text: '$3.5M — Bitcoin Depot hack',           col: 'rgba(103,232,249,0.90)' },
    { text: 'Routed via AudiA6 mixing service',     col: `${AC}cc`               },
    { text: 'KuCoin EU ban already in effect',      col: 'rgba(200,240,255,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 608, 130 + i * 52);
  });

  // Left edge accent
  const edge = ctx.createLinearGradient(0, 100, 0, 320);
  edge.addColorStop(0, `${AC}00`);
  edge.addColorStop(0.5, `${AC}88`);
  edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 320); ctx.stroke();

  // Full-width divider below both columns
  drawDivider(ctx, 336, `${AC}18`);

  // Bottom insight text — full width, no overlap
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("If the exchange won't freeze it, the exchange is part of it.", 52, 382);

  ctx.fillStyle = `${AC}77`; ctx.font = 'bold 12px Orbitron';
  ctx.fillText('KuCoin paid $300M+ in AML fines to US authorities in 2025.', 52, 408);
  ctx.fillText('150+ deposit addresses used to wash funds. Exchange still operating.', 52, 430);

  drawBottomBar(ctx, AC, 'Source: @zachxbt · CryptoTimes · April 14, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-kucoin-launder.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: kucoin-launder (teal, fixed)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 3 — DPRK Fake IT Workers  →  PURPLE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#a855f7';   // purple-500

  drawBackground(ctx,
    'rgba(126,34,206,0.08)',
    'rgba(88,28,135,0.05)',
    `rgba(168,85,247,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ STATE-SPONSORED FRAUD · APR 8', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('DPRK — NORTH KOREA INSIDER THREAT', 52, 118);

  ctx.shadowColor = AC; ctx.shadowBlur = 12;
  ctx.fillStyle = AC; ctx.font = 'bold 104px Orbitron';
  ctx.fillText('$1M/mo', 52, 200);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('earned by DPRK fake devs inside crypto firms', 52, 272);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 14px Orbitron';
  ctx.fillText('390 accounts exposed by @zachxbt · forged IDs · fake names · real admin access', 52, 300);

  // 3 pills
  drawPills(ctx, [
    { value: '390',    label: 'FAKE ACCOUNTS' },
    { value: '$3.5M',  label: 'PAID SINCE NOV 2025' },
    { value: '123456', label: 'THEIR DEFAULT PASSWORD' },
  ], 336, 76, AC);

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("North Korea didn't hack your protocol. They got hired by it.", 52, 462);

  drawBottomBar(ctx, AC, 'Source: @zachxbt · TheBlock · April 8, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-dprk-workers.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: dprk-workers (purple)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 4 — 12 DeFi Protocols Hacked  →  INDIGO / BLUE-PURPLE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#6366f1';   // indigo-500

  drawBackground(ctx,
    'rgba(79,70,229,0.08)',
    'rgba(55,48,200,0.05)',
    `rgba(99,102,241,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ DEFI CONTAGION · APRIL 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.shadowColor = AC; ctx.shadowBlur = 14;
  ctx.fillStyle = AC; ctx.font = 'bold 130px Orbitron';
  ctx.fillText('12', W / 2, 172);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px Orbitron';
  ctx.fillText('DeFi protocols hacked', W / 2, 246);
  ctx.fillStyle = `${AC}cc`; ctx.font = 'bold 17px Orbitron';
  ctx.fillText('in 2 weeks — cascading from the $285M Drift exploit', W / 2, 280);

  drawDivider(ctx, 308, `${AC}20`);

  // 4 victim pills
  drawPills(ctx, [
    { value: '$13.7M', label: 'GRINEX' },
    { value: '$7.6M',  label: 'RHEA FINANCE' },
    { value: '$1.67M', label: 'BSC TMM/USDT' },
    { value: '$423K',  label: 'AETHIR' },
  ], 324, 76, AC);

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = `${AC}99`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('+ Silo Finance · Dango Bridge · and 6 more within days of each other', W / 2, 446);
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText('One big hack shakes the tree. Twelve smaller ones pick up the fruit.', W / 2, 472);

  drawBottomBar(ctx, AC, 'Source: blockchain.news · April 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-defi-cascade.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: defi-cascade (indigo)');
}
