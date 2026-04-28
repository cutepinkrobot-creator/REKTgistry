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
const AC     = '#f97316'; // orange-500

function drawBg(ctx) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(249,115,22,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, 'rgba(194,65,12,0.10)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(234,88,12,0.06)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
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
function drawBadge(ctx, text) {
  ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24, bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = AC + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = AC + '0e'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = AC; ctx.fillText(text, W - 52, by + 12);
}
function drawNeonLine(ctx, y) {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.3, AC);
  g.addColorStop(0.7, AC); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = g; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}
function drawDivider(ctx, y, alpha) {
  ctx.strokeStyle = AC + (alpha || '22'); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
}
function drawBottomBar(ctx, right) {
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
function bigOutline(ctx, text, x, y, font) {
  ctx.font = font; ctx.lineJoin = 'round'; ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText(text, x, y);
  ctx.shadowColor = AC; ctx.shadowBlur = 14;
  ctx.fillStyle = AC; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

// ── Render at 2x ──────────────────────────────────────────────────────────
const SCALE = 2;
const c = createCanvas(W * SCALE, H * SCALE);
const ctx = c.getContext('2d');
ctx.scale(SCALE, SCALE);

drawBg(ctx);
drawNeonLine(ctx, 3);
drawLogo(ctx);
drawBadge(ctx, '◈ CRYPTO LAWSUIT · APRIL 2026');
drawDivider(ctx, 90);

// Eyebrow
ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.fillStyle = AC + '88'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('JUSTIN SUN VS. WORLD LIBERTY FINANCIAL — TRUMP FAMILY PROJECT', 52, 118);

// Big headline
bigOutline(ctx, '$45M', 52, 215, 'bold 118px Orbitron');

ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
ctx.fillText('invested. tokens secretly blacklisted.', 52, 274);
ctx.fillStyle = AC + 'bb'; ctx.font = 'bold 15px Orbitron';
ctx.fillText('WLFI added a freeze function to the contract — no vote, no announcement, no disclosure', 52, 302);

// Vertical divider
ctx.strokeStyle = AC + '20'; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(600, 108); ctx.lineTo(600, 325); ctx.stroke();

// Right side bullets
const pts = [
  { text: 'Sun invested $45M across 3B WLFI tokens',    col: 'rgba(255,255,255,0.82)' },
  { text: 'Tokens once valued at $1B — now frozen',     col: 'rgba(253,186,116,0.90)' },
  { text: 'WLFI threatened to burn unless Sun minted',  col: AC + 'ee'               },
  { text: '$200M in USD1 stablecoin for them',          col: 'rgba(255,200,150,0.75)' },
];
ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
pts.forEach((p, i) => {
  ctx.fillStyle = p.col;
  ctx.fillText('→  ' + p.text, 628, 130 + i * 52);
});

// Left edge bar
const edge = ctx.createLinearGradient(0, 100, 0, 325);
edge.addColorStop(0, AC + '00'); edge.addColorStop(0.5, AC + '88'); edge.addColorStop(1, AC + '00');
ctx.strokeStyle = edge; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 325); ctx.stroke();

drawDivider(ctx, 338);

// 3 stat pills
const pills = [
  { value: '$45M',   label: 'SUN INVESTED IN WLFI' },
  { value: '$200M',  label: 'MINTING DEMAND MADE' },
  { value: '75%',    label: 'TRUMP FAMILY REVENUE CUT' },
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

// Closing line
ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
ctx.fillText("Sun is suing for fraud. the Trump family takes 75% of all WLFI token revenue.", 52, 466);

drawBottomBar(ctx, 'Source: CoinDesk · The Block · NBC News · April 21, 2026');
drawNeonLine(ctx, H - 2);

fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-justinsun-wlfi.png'), c.toBuffer('image/png'));
console.log('✓ Saved: justinsun-wlfi (orange) 2x');
