const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;

// ── V2 style tokens ───────────────────────────────────────────────────────────
const BG          = '#050507';           // deeper black
const DIM         = 'rgba(204,255,0,0.55)';  // small/secondary text
const DIMMER      = 'rgba(204,255,0,0.38)';  // pun lines / captions
const SUBHEAD     = 'rgba(204,255,0,0.72)';  // subtitles below big numbers
const GRID_A      = 0.012;               // grid line opacity
const GLOW_MULTI  = 0.5;                 // multiply all bg glow opacities

// ── Shared helpers ────────────────────────────────────────────────────────────
function drawBackground(ctx, glow1, glow2) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = `rgba(204,255,0,${GRID_A})`;
  ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, glow1); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, glow2); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawLogo(ctx) {
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(204,255,0,0.6)';
  ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
}

function drawBadge(ctx, text, color) {
  ctx.shadowBlur = 0;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24;
  const bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = color + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = color + '0e'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = color;
  ctx.fillText(text, W - 52, by + 12);
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
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('rektgistry.com', 52, H - 35);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText(rightText, W - 52, H - 35);
}

function drawStatPills(ctx, stats, py, accentColor, pillW) {
  const pw = pillW || (W - 104 - (stats.length - 1) * 16) / stats.length;
  let px = 52;
  stats.forEach(s => {
    ctx.fillStyle = accentColor + '0a';
    ctx.strokeStyle = accentColor + '2a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, 76, 10);
    ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = accentColor; ctx.shadowBlur = 3;
    ctx.fillStyle = accentColor; ctx.font = 'bold 26px Orbitron';
    ctx.fillText(s.value, px + pw / 2, py + 28);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.label, px + pw / 2, py + 56);
    px += pw + 16;
  });
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 1 — Launch Announcement
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(204,255,0,0.05)', 'rgba(74,126,255,0.04)');
  drawNeonLine(ctx, 3, 'rgba(204,255,0,0.65)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ LAUNCH ANNOUNCEMENT', '#ccff00');
  drawDivider(ctx, 90, 'rgba(204,255,0,0.10)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(255,255,255,0.06)'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 68px Orbitron';
  ctx.fillText('12,860+ scammers.', 52, 185);
  ctx.fillText('On record. Forever.', 52, 265);

  ctx.shadowBlur = 0;
  ctx.fillStyle = SUBHEAD; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('$688M+ in documented losses. Community-powered. Free to search.', 52, 325);

  drawStatPills(ctx, [
    { value: '12,860+', label: 'INCIDENTS' },
    { value: '$688M+',  label: 'TOTAL LOST' },
    { value: '7',       label: 'CATEGORIES' },
  ], 395, '#ccff00', 210);

  ctx.textAlign = 'left';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText('Every rug has a weaver.', 52, 516);

  // bottom bar manually (different right text)
  ctx.fillStyle = 'rgba(204,255,0,0.05)'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = 'rgba(204,255,0,0.12)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('rektgistry.com', 52, H - 35);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Search the registry → Report a scammer → File an appeal', W - 52, H - 35);

  drawNeonLine(ctx, H - 2, 'rgba(204,255,0,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-launch-v2.png'), c.toBuffer('image/png'));
  console.log('✓ Image 1 saved: launch-v2');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 2 — Fake Ledger Scam Alert
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(255,80,80,0.06)', 'rgba(200,60,0,0.04)');
  drawNeonLine(ctx, 3, 'rgba(255,80,80,0.7)');
  drawLogo(ctx);
  drawBadge(ctx, '⚠ ACTIVE SCAM ALERT', '#ff5050');
  drawDivider(ctx, 90, 'rgba(255,80,80,0.14)');

  // Big stat
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ff5050'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#ff5050'; ctx.font = 'bold 120px Orbitron';
  ctx.fillText('$9.5M', 52, 195);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.80)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('stolen in 7 days', 52, 265);

  ctx.fillStyle = 'rgba(255,160,80,0.85)'; ctx.font = 'bold 16px Orbitron';
  ctx.fillText('50+ victims. 1 fake app. Apple App Store.', 52, 300);

  // Vertical divider
  ctx.strokeStyle = 'rgba(255,80,80,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(580, 108); ctx.lineTo(580, 345); ctx.stroke();

  // Bullets
  const bullets = [
    { text: '📱 Fake Ledger Live app on App Store',     color: 'rgba(255,255,255,0.80)' },
    { text: '🔑 Prompted users for 24-word seed phrase', color: 'rgba(255,180,80,0.88)' },
    { text: '💸 Funds laundered via 150+ KuCoin addresses', color: 'rgba(255,90,90,0.88)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 15px Orbitron';
  bullets.forEach((b, i) => {
    ctx.fillStyle = b.color;
    ctx.fillText(b.text, 612, 152 + i * 72);
  });

  // Left edge accent line
  const redEdge = ctx.createLinearGradient(0, 100, 0, 350);
  redEdge.addColorStop(0, 'rgba(255,80,80,0)');
  redEdge.addColorStop(0.5, 'rgba(255,80,80,0.5)');
  redEdge.addColorStop(1, 'rgba(255,80,80,0)');
  ctx.strokeStyle = redEdge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 350); ctx.stroke();

  drawDivider(ctx, 368, 'rgba(255,80,80,0.10)');
  drawBottomBar(ctx, '#ff5050', 'Source: @zachxbt · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(255,80,80,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-ledger-v2.png'), c.toBuffer('image/png'));
  console.log('✓ Image 2 saved: ledger-v2');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 3 — FBI IC3 $11.4B Report
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(74,126,255,0.05)', 'rgba(40,80,200,0.04)');
  drawNeonLine(ctx, 3, 'rgba(74,126,255,0.7)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ FBI IC3 ANNUAL REPORT 2025', '#4a7eff');
  drawDivider(ctx, 90, 'rgba(74,126,255,0.14)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.shadowColor = '#4a7eff'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 140px Orbitron';
  ctx.fillText('$11.4B', W / 2, 188);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#4a7eff'; ctx.font = 'bold 24px Orbitron';
  ctx.fillText('lost to crypto scams in 2025', W / 2, 264);

  ctx.fillStyle = DIM; ctx.font = 'bold 14px Orbitron';
  ctx.fillText('↑ 22% from 2024  ·  181,565 complaints  ·  all-time record', W / 2, 298);

  drawDivider(ctx, 330, 'rgba(74,126,255,0.14)');

  // Stat pills
  const pw = 260, ph = 76;
  const totalW = 3 * pw + 2 * 20;
  let px = (W - totalW) / 2;
  const py = 348;
  [
    { value: '181,565', label: 'COMPLAINTS' },
    { value: '$7.2B',   label: 'INVESTMENT FRAUD' },
    { value: '$389M',   label: 'CRYPTO ATM SCAMS' },
  ].forEach(s => {
    ctx.fillStyle = 'rgba(74,126,255,0.08)';
    ctx.strokeStyle = 'rgba(74,126,255,0.20)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
    ctx.fillStyle = '#ccff00'; ctx.font = 'bold 26px Orbitron';
    ctx.fillText(s.value, px + pw / 2, py + 28);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.label, px + pw / 2, py + 56);
    px += pw + 20;
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("and that's only what got reported.", W / 2, 466);

  drawBottomBar(ctx, '#4a7eff', 'FBI IC3 Report · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(74,126,255,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-fbi-v2.png'), c.toBuffer('image/png'));
  console.log('✓ Image 3 saved: fbi-v2');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 4 — Q1 2026 Stats Roundup
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(204,255,0,0.05)', 'rgba(74,126,255,0.04)');
  drawNeonLine(ctx, 3, 'rgba(204,255,0,0.65)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ Q1 2026 REPORT', '#ccff00');
  drawDivider(ctx, 90, 'rgba(204,255,0,0.10)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 110px Orbitron';
  ctx.fillText('$482M', 52, 185);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 26px Orbitron';
  ctx.fillText('stolen in Q1 2026', 52, 255);

  ctx.fillStyle = DIM; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('44 attacks · Hacken Q1 Security Report', 52, 290);

  drawStatPills(ctx, [
    { value: '$482M', label: 'TOTAL STOLEN' },
    { value: '44',    label: 'ATTACKS' },
    { value: '$306M', label: 'PHISHING ALONE' },
  ], 338, '#ccff00');

  ctx.textAlign = 'left';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("The code was fine. The people weren't.", 52, 470);

  drawBottomBar(ctx, '#ccff00', 'Hacken Q1 2026 · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(204,255,0,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-q1-stats-v2.png'), c.toBuffer('image/png'));
  console.log('✓ Image 4 saved: q1-stats-v2');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 5 — Safer Code, Bigger Losses
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(204,255,0,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const gL = ctx.createRadialGradient(200, H/2, 0, 200, H/2, 380);
  gL.addColorStop(0, 'rgba(34,197,94,0.07)'); gL.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gL; ctx.fillRect(0, 0, W, H);

  const gR = ctx.createRadialGradient(W-200, H/2, 0, W-200, H/2, 380);
  gR.addColorStop(0, 'rgba(239,68,68,0.07)'); gR.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gR; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, 'rgba(204,255,0,0.55)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ Q1 2026 INSIGHT', '#a3e635');
  drawDivider(ctx, 90, 'rgba(204,255,0,0.08)');

  const MID = W / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(MID, 108); ctx.lineTo(MID, 530); ctx.stroke();
  ctx.setLineDash([]);

  const CY_TOP = 210;

  // Left — safer code
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 7;
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 68px Orbitron';
  ctx.fillText('↓', MID/2, CY_TOP - 20);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 18px Orbitron';
  ctx.fillText('CONTRACT BUGS', MID/2, CY_TOP + 50);
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('smart contracts getting safer', MID/2, CY_TOP + 76);
  ctx.fillText('every year', MID/2, CY_TOP + 94);

  // Right — bigger losses
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 7;
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 68px Orbitron';
  ctx.fillText('↑', MID + MID/2, CY_TOP - 20);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 18px Orbitron';
  ctx.fillText('$482M LOSSES', MID + MID/2, CY_TOP + 50);
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('stolen in Q1 2026 alone', MID + MID/2, CY_TOP + 76);
  ctx.fillText('up from Q1 2025', MID + MID/2, CY_TOP + 94);

  drawDivider(ctx, 388, 'rgba(255,255,255,0.05)');

  ctx.shadowColor = 'rgba(255,255,255,0.08)'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px Orbitron';
  ctx.fillText('The weakest link was never the code.', MID, 436);
  ctx.shadowBlur = 0;
  ctx.fillStyle = DIM; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('63% of Q1 losses came from phishing & social engineering', MID, 474);

  drawBottomBar(ctx, '#ccff00', 'Source: Hacken · Q1 2026');
  drawNeonLine(ctx, H - 2, 'rgba(204,255,0,0.55)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-q1-safercode-v2.png'), c.toBuffer('image/png'));
  console.log('✓ Image 5 saved: q1-safercode-v2');
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 6 — DPRK / Drift Protocol
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  ctx.fillStyle = '#040304'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(239,68,68,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 700);
  g1.addColorStop(0, 'rgba(160,0,0,0.09)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(60,0,0,0.07)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, 'rgba(239,68,68,0.75)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ STATE-SPONSORED ATTACK', '#ef4444');
  drawDivider(ctx, 90, 'rgba(239,68,68,0.12)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(239,68,68,0.55)'; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('DPRK — LAZARUS GROUP', 52, 118);

  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 130px Orbitron';
  ctx.fillText('$285M', 52, 210);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.82)'; ctx.font = 'bold 24px Orbitron';
  ctx.fillText('stolen from Drift Protocol · Solana', 52, 278);

  ctx.fillStyle = 'rgba(255,100,100,0.65)'; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('April 1, 2026  ·  Biggest crypto hack of 2026', 52, 312);

  // Detail pills
  const dpw = (W - 104 - 32) / 3;
  let dpx = 52;
  [
    { value: 'Fake Token Oracle', label: 'ATTACK VECTOR' },
    { value: 'CCTP Bridge',       label: 'LAUNDERING ROUTE' },
    { value: 'ETH + CEX Mix',     label: 'FUND FLOW' },
  ].forEach(d => {
    ctx.fillStyle = 'rgba(239,68,68,0.06)';
    ctx.strokeStyle = 'rgba(239,68,68,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(dpx, 356, dpw, 72, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillStyle = '#f87171'; ctx.font = 'bold 14px Orbitron';
    ctx.fillText(d.value, dpx + dpw/2, 356 + 26);
    ctx.fillStyle = 'rgba(204,255,0,0.45)'; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(d.label, dpx + dpw/2, 356 + 52);
    dpx += dpw + 16;
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("April Fool's Day. No joke.", 52, 474);

  drawBottomBar(ctx, '#ef4444', 'Source: TRM Labs · Elliptic · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(239,68,68,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-q1-dprk-v2.png'), c.toBuffer('image/png'));
  console.log('✓ Image 6 saved: q1-dprk-v2');
}
