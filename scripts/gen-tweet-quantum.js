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
const AC     = '#0ea5e9'; // sky-500

function drawBg(ctx) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(14,165,233,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, 'rgba(3,105,161,0.10)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(2,132,199,0.06)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
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
function drawDivider(ctx, y) {
  ctx.strokeStyle = AC + '22'; ctx.lineWidth = 1;
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
drawBadge(ctx, '◈ FACT CHECK · APRIL 2026');
drawDivider(ctx, 90);

// Eyebrow
ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.fillStyle = AC + '88'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('"QUANTUM COMPUTER CRACKED BITCOIN" — HERE\'S WHAT ACTUALLY HAPPENED', 52, 118);

// Split layout — left: MYTH, right: REALITY
const colL = 52, colR = 628, divX = 590;

// Left column — MYTH
ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = 'bold 11px Orbitron';
ctx.fillText('THE HEADLINE', colL, 148);

bigOutline(ctx, '15-BIT', colL, 230, 'bold 96px Orbitron');
ctx.fillStyle = 'rgba(255,255,255,0.70)'; ctx.font = 'bold 16px Orbitron';
ctx.fillText('ECC key broken on IBM', colL, 268);
ctx.fillText('quantum hardware', colL, 290);

ctx.fillStyle = AC + '66'; ctx.font = 'bold 12px Orbitron';
ctx.fillText('→  researcher Giancarlo Lelli', colL, 326);
ctx.fillText('→  won 1 BTC Q-Day Prize', colL, 346);
ctx.fillText('→  headlines screamed "Bitcoin dead"', colL, 366);

// Vertical divider
ctx.strokeStyle = AC + '25'; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(divX, 108); ctx.lineTo(divX, 390); ctx.stroke();

// Right column — REALITY
ctx.fillStyle = AC; ctx.font = 'bold 11px Orbitron';
ctx.textAlign = 'left';
ctx.fillText('THE REALITY', colR, 148);

ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 16px Orbitron';
ctx.fillText('Bitcoin uses 256-BIT keys.', colR, 182);
ctx.fillText('breaking 256-bit is 2^241 times', colR, 206);
ctx.fillText('harder than 15-bit.', colR, 228);

ctx.strokeStyle = AC + '30'; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(colR, 244); ctx.lineTo(W - 52, 244); ctx.stroke();

ctx.fillStyle = AC + 'cc'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('the debunking:', colR, 268);
ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = 'bold 12px Orbitron';
ctx.fillText('→  devs showed a basic random number', colR, 294);
ctx.fillText('    generator reproduced the exact result', colR, 314);
ctx.fillText('→  zero genuine quantum advantage', colR, 340);
ctx.fillText('→  real 256-bit threat: still decades away', colR, 364);

// Left edge bar
const edge = ctx.createLinearGradient(0, 108, 0, 390);
edge.addColorStop(0, AC + '00'); edge.addColorStop(0.5, AC + '88'); edge.addColorStop(1, AC + '00');
ctx.strokeStyle = edge; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(8, 108); ctx.lineTo(8, 390); ctx.stroke();

drawDivider(ctx, 402);

// Bottom message
ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
ctx.fillStyle = AC + 'bb'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('the gap between 15-bit and 256-bit is not a crack in the wall. it\'s the wall itself.', 52, 432);
ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
ctx.fillText("don't sell your Bitcoin because of a headline written by someone who can't do math.", 52, 460);

drawBottomBar(ctx, 'Source: CoinDesk · Project Eleven · Protos · April 24, 2026');
drawNeonLine(ctx, H - 2);

fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-quantum-bitcoin.png'), c.toBuffer('image/png'));
console.log('✓ Saved: quantum-bitcoin (sky blue) 2x');
