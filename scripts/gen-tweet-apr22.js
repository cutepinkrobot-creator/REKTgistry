const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;
const BG     = '#050507';
const DIM    = 'rgba(204,255,0,0.55)';
const DIMMER = 'rgba(204,255,0,0.38)';
const GRID_A = 0.055;

function drawBg(ctx, glow1, glow2, gridColor) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
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
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#d0d8e8'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
}
function drawBadge(ctx, text, AC) {
  ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24, bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = AC + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = AC + '0e'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = AC; ctx.fillText(text, W - 52, by + 12);
}
function drawNeonLine(ctx, y, AC) {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.3, AC);
  g.addColorStop(0.7, AC); g.addColorStop(1, 'rgba(0,0,0,0)');
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
function bigOutline(ctx, text, x, y, font, AC) {
  ctx.font = font; ctx.lineJoin = 'round'; ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText(text, x, y);
  ctx.shadowColor = AC; ctx.shadowBlur = 14;
  ctx.fillStyle = AC; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}
function drawEdgeBar(ctx, AC) {
  const edge = ctx.createLinearGradient(0, 100, 0, 330);
  edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}88`); edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 330); ctx.stroke();
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 1 — Fake Ledger App on Apple App Store  →  ELECTRIC CYAN
// ══════════════════════════════════════════════════════════════════════════
{
  const SCALE = 2;
  const c = createCanvas(W * SCALE, H * SCALE);
  const ctx = c.getContext('2d');
  ctx.scale(SCALE, SCALE);

  const AC = '#22d3ee'; // cyan-400

  drawBg(ctx,
    'rgba(8,145,178,0.09)',
    'rgba(14,116,144,0.05)',
    `rgba(34,211,238,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ APP STORE SCAM · APRIL 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('FAKE LEDGER LIVE APP — APPLE APP STORE — 50+ VICTIMS', 52, 118);

  bigOutline(ctx, '$9.5M', 52, 215, 'bold 118px Orbitron', AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('stolen via a fake hardware wallet app', 52, 274);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('it was listed on apple\'s app store and looked exactly like the real thing', 52, 302);

  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 325); ctx.stroke();

  const pts = [
    { text: 'App mimicked real Ledger Live perfectly',   col: 'rgba(255,255,255,0.82)' },
    { text: 'Users prompted to enter seed phrase',       col: 'rgba(165,243,252,0.90)' },
    { text: 'BTC, ETH, SOL, TRX, XRP — all drained',     col: `${AC}dd`               },
    { text: 'Stolen funds laundered via KuCoin',         col: 'rgba(200,240,255,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 618, 130 + i * 52);
  });

  drawEdgeBar(ctx, AC);
  drawDivider(ctx, 338, `${AC}18`);

  // 3 pills
  const pills = [
    { value: '$9.5M',   label: 'STOLEN IN 7 DAYS' },
    { value: '50+',     label: 'VICTIMS CONFIRMED' },
    { value: '150+',    label: 'KUCOIN ADDRESSES USED' },
  ];
  const pw = (W - 104 - 32) / 3; let px = 52;
  pills.forEach(p => {
    ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 354, pw, 72, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = AC; ctx.shadowBlur = 3;
    ctx.fillStyle = AC; ctx.font = 'bold 20px Orbitron';
    ctx.fillText(p.value, px + pw / 2, 354 + 26);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(p.label, px + pw / 2, 354 + 54);
    px += pw + 16;
  });

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('your seed phrase is the key. never type it anywhere. ever.', 52, 466);

  drawBottomBar(ctx, AC, 'Source: @zachxbt · CoinDesk · April 14, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-fake-ledger.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: fake-ledger (cyan) 2x');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 2 — Lazarus Group Laundering KelpDAO $292M  →  EMERALD
// ══════════════════════════════════════════════════════════════════════════
{
  const SCALE = 2;
  const c = createCanvas(W * SCALE, H * SCALE);
  const ctx = c.getContext('2d');
  ctx.scale(SCALE, SCALE);

  const AC = '#10b981'; // emerald-500

  drawBg(ctx,
    'rgba(5,150,105,0.09)',
    'rgba(4,120,87,0.05)',
    `rgba(16,185,129,${GRID_A})`
  );
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ LAZARUS GROUP SUSPECTED · LAUNDERING NOW', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('KELPDAO HACKERS (SUSPECTED LAZARUS) — $292M — LAUNDERING', 52, 118);

  bigOutline(ctx, '$292M', 52, 215, 'bold 110px Orbitron', AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('being laundered right now', 52, 274);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('bloomberg reports the kelpdao hackers — suspected lazarus — are actively laundering', 52, 302);

  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 325); ctx.stroke();

  const pts = [
    { text: 'Attack suspected to be North Korea\'s Lazarus', col: 'rgba(255,255,255,0.82)' },
    { text: '$236M borrowed against stolen rsETH',        col: 'rgba(110,231,183,0.90)' },
    { text: 'Funds spread across 20+ chains',             col: `${AC}dd`               },
    { text: 'Wall Street now reassessing DeFi exposure',  col: 'rgba(180,240,210,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 618, 130 + i * 52);
  });

  drawEdgeBar(ctx, AC);
  drawDivider(ctx, 338, `${AC}18`);

  const pills = [
    { value: '$292M',   label: 'STOLEN FROM KELPDAO' },
    { value: '$236M',   label: 'BORROWED ON TOP' },
    { value: '20+',     label: 'CHAINS INVOLVED' },
  ];
  const pw = (W - 104 - 32) / 3; let px = 52;
  pills.forEach(p => {
    ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 354, pw, 72, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = AC; ctx.shadowBlur = 3;
    ctx.fillStyle = AC; ctx.font = 'bold 20px Orbitron';
    ctx.fillText(p.value, px + pw / 2, 354 + 26);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(p.label, px + pw / 2, 354 + 54);
    px += pw + 16;
  });

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('they stole it, borrowed against it, and now they\'re cleaning it. in real time.', 52, 466);

  drawBottomBar(ctx, AC, 'Source: Bloomberg · PeckShield · April 21, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-lazarus-laundering.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: lazarus-laundering (emerald) 2x');
}
