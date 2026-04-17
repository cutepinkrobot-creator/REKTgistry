const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;

// ── Shared helpers ────────────────────────────────────────────────────────────
function drawBackground(ctx, glow1Color, glow2Color) {
  ctx.fillStyle = '#0b0c10';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(204,255,0,0.03)';
  ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, glow1Color); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, glow2Color); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawLogo(ctx) {
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowColor = 'rgba(255,255,255,0.2)';
  ctx.shadowBlur = 2;
  ctx.fillStyle = '#d0d8e8';
  ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
  ctx.shadowBlur = 0;
}

function drawBadge(ctx, text, color) {
  ctx.shadowBlur = 0;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24;
  const bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = color + '66'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = color + '12'; ctx.fillRect(bx, by, bw, 24);
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
  ctx.fillStyle = accentColor + '0d'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = accentColor + '26'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('rektgistry.com', 52, H - 35);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = 'bold 13px Orbitron';
  ctx.fillText(rightText, W - 52, H - 35);
}

function drawStatPills(ctx, stats, py, accentColor) {
  const pw = (W - 104 - (stats.length - 1) * 16) / stats.length;
  let px = 52;
  stats.forEach(s => {
    ctx.fillStyle = accentColor + '0d';
    ctx.strokeStyle = accentColor + '33';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, 76, 10);
    ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillStyle = accentColor; ctx.font = 'bold 26px Orbitron';
    ctx.fillText(s.value, px + pw / 2, py + 28);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.label, px + pw / 2, py + 56);
    px += pw + 16;
  });
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 1 — Q1 2026 Stats Roundup  (lime / blue accent)
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(204,255,0,0.08)', 'rgba(74,126,255,0.08)');
  drawNeonLine(ctx, 3, 'rgba(204,255,0,0.7)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ Q1 2026 REPORT', '#ccff00');
  drawDivider(ctx, 90, 'rgba(204,255,0,0.12)');

  // Big number
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 110px Orbitron';
  ctx.fillText('$482M', 52, 185);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 26px Orbitron';
  ctx.fillText('stolen in Q1 2026', 52, 255);

  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = 'bold 16px Orbitron';
  ctx.fillText('44 attacks · Hacken Q1 Security Report', 52, 293);

  // Stat pills
  drawStatPills(ctx, [
    { value: '$482M', label: 'TOTAL STOLEN' },
    { value: '44',    label: 'ATTACKS' },
    { value: '$306M', label: 'PHISHING ALONE' },
  ], 340, '#ccff00');

  // Pun line
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = 'bold 16px Orbitron';
  ctx.fillText('The code was fine. The people weren\'t.', 52, 476);

  drawBottomBar(ctx, '#ccff00', 'Hacken Q1 2026 · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(204,255,0,0.7)');

  const out = path.join(__dirname, '../public/rektgistry-tweet-q1-stats.png');
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ Image 1 saved:', out);
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 2 — Safer Code, Bigger Losses  (split design, green vs red)
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // Custom background — left green tint, right red tint
  ctx.fillStyle = '#0b0c10'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(204,255,0,0.025)'; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const gLeft = ctx.createRadialGradient(200, H / 2, 0, 200, H / 2, 380);
  gLeft.addColorStop(0, 'rgba(34,197,94,0.10)'); gLeft.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gLeft; ctx.fillRect(0, 0, W, H);

  const gRight = ctx.createRadialGradient(W - 200, H / 2, 0, W - 200, H / 2, 380);
  gRight.addColorStop(0, 'rgba(239,68,68,0.10)'); gRight.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gRight; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, 'rgba(204,255,0,0.6)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ Q1 2026 INSIGHT', '#a3e635');
  drawDivider(ctx, 90, 'rgba(204,255,0,0.10)');

  // Vertical center divider
  const MID = W / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.beginPath(); ctx.moveTo(MID, 105); ctx.lineTo(MID, 530); ctx.stroke();
  ctx.setLineDash([]);

  const CY_TOP = 210, CY_BOT = 330;

  // ── LEFT: Safer Code ──
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 68px Orbitron';
  ctx.fillText('↓', MID / 2, CY_TOP - 20);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 18px Orbitron';
  ctx.fillText('CONTRACT BUGS', MID / 2, CY_TOP + 50);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = 'bold 13px Orbitron';
  ctx.fillText('smart contracts getting safer', MID / 2, CY_TOP + 78);
  ctx.fillText('every year', MID / 2, CY_TOP + 96);

  // ── RIGHT: Bigger Losses ──
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 68px Orbitron';
  ctx.fillText('↑', MID + MID / 2, CY_TOP - 20);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 18px Orbitron';
  ctx.fillText('$482M LOSSES', MID + MID / 2, CY_TOP + 50);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = 'bold 13px Orbitron';
  ctx.fillText('stolen in Q1 2026 alone', MID + MID / 2, CY_TOP + 78);
  ctx.fillText('up from Q1 2025', MID + MID / 2, CY_TOP + 96);

  // ── Center headline ──
  drawDivider(ctx, 390, 'rgba(255,255,255,0.06)');

  ctx.shadowColor = 'rgba(255,255,255,0.1)'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Orbitron';
  ctx.fillText('The weakest link was never the code.', MID, 438);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = 'bold 15px Orbitron';
  ctx.fillText('63% of Q1 losses came from phishing & social engineering', MID, 476);

  drawBottomBar(ctx, '#ccff00', 'Source: Hacken · Q1 2026');
  drawNeonLine(ctx, H - 2, 'rgba(204,255,0,0.6)');

  const out = path.join(__dirname, '../public/rektgistry-tweet-q1-safercode.png');
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ Image 2 saved:', out);
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 3 — North Korea / Drift Protocol  (dark red, ominous)
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // Dark red/maroon background
  ctx.fillStyle = '#0a0608'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(239,68,68,0.025)'; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 700);
  g1.addColorStop(0, 'rgba(180,0,0,0.15)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(80,0,0,0.12)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, 'rgba(239,68,68,0.8)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ STATE-SPONSORED ATTACK', '#ef4444');
  drawDivider(ctx, 90, 'rgba(239,68,68,0.15)');

  // Flag emoji + DPRK label
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(239,68,68,0.6)';
  ctx.font = 'bold 13px Orbitron';
  ctx.fillText('DPRK — LAZARUS GROUP', 52, 118);

  // Big number
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 22;
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 130px Orbitron';
  ctx.fillText('$285M', 52, 210);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 24px Orbitron';
  ctx.fillText('stolen from Drift Protocol · Solana', 52, 278);

  ctx.fillStyle = 'rgba(255,100,100,0.6)';
  ctx.font = 'bold 15px Orbitron';
  ctx.fillText('April 1, 2026  ·  Biggest crypto hack of 2026', 52, 312);

  // Detail pills
  const details = [
    { value: 'Fake Token Oracle', label: 'ATTACK VECTOR' },
    { value: 'CCTP Bridge', label: 'LAUNDERING ROUTE' },
    { value: 'ETH + CEX Mix', label: 'FUND FLOW' },
  ];
  const pw = (W - 104 - 32) / 3;
  let px = 52;
  details.forEach(d => {
    ctx.fillStyle = 'rgba(239,68,68,0.07)';
    ctx.strokeStyle = 'rgba(239,68,68,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 358, pw, 72, 10);
    ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillStyle = '#f87171'; ctx.font = 'bold 14px Orbitron';
    ctx.fillText(d.value, px + pw / 2, 358 + 26);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(d.label, px + pw / 2, 358 + 52);
    px += pw + 16;
  });

  // Pun line
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = 'bold 16px Orbitron';
  ctx.fillText('April Fool\'s Day. No joke.', 52, 476);

  drawBottomBar(ctx, '#ef4444', 'Source: TRM Labs · Elliptic · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(239,68,68,0.7)');

  const out = path.join(__dirname, '../public/rektgistry-tweet-q1-dprk.png');
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ Image 3 saved:', out);
}
