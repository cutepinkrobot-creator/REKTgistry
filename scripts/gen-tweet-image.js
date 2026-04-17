const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;
const c = createCanvas(W, H);
const ctx = c.getContext('2d');

// ── Background ───────────────────────────────────────────────────────────────
ctx.fillStyle = '#0b0c10';
ctx.fillRect(0, 0, W, H);

// Subtle grid
ctx.strokeStyle = 'rgba(204,255,0,0.03)';
ctx.lineWidth = 1;
for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

// Left radial glow
const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
g1.addColorStop(0, 'rgba(204,255,0,0.10)');
g1.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

// Top right accent glow
const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
g2.addColorStop(0, 'rgba(74,126,255,0.08)');
g2.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

// ── Top neon line ─────────────────────────────────────────────────────────
const topLine = ctx.createLinearGradient(0, 0, W, 0);
topLine.addColorStop(0, 'rgba(204,255,0,0)');
topLine.addColorStop(0.3, 'rgba(204,255,0,0.8)');
topLine.addColorStop(0.7, 'rgba(204,255,0,0.8)');
topLine.addColorStop(1, 'rgba(204,255,0,0)');
ctx.strokeStyle = topLine;
ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(W, 3); ctx.stroke();

// ── REKT logo top-left ───────────────────────────────────────────────────
ctx.textBaseline = 'alphabetic';
ctx.textAlign = 'left';
// "REKT" — large, neon lime
ctx.shadowColor = '#ccff00';
ctx.shadowBlur = 8;
ctx.fillStyle = '#ccff00';
ctx.font = 'bold 44px Orbitron';
ctx.fillText('REKT', 52, 52);
// "gistry" — smaller, slate, stacked directly below
ctx.shadowColor = 'rgba(255,255,255,0.2)';
ctx.shadowBlur = 2;
ctx.fillStyle = '#d0d8e8';
ctx.font = 'bold 20px Orbitron';
ctx.fillText('gistry', 54, 74);

// Badge top-right
ctx.shadowBlur = 0;
ctx.textAlign = 'right';
ctx.font = 'bold 11px Orbitron';
const badgeText = '◈ LAUNCH ANNOUNCEMENT';
const bw = ctx.measureText(badgeText).width + 24;
const bx = W - 52 - bw, by = 36;
ctx.strokeStyle = 'rgba(204,255,0,0.4)';
ctx.lineWidth = 1;
ctx.strokeRect(bx, by, bw, 24);
ctx.fillStyle = 'rgba(204,255,0,0.07)';
ctx.fillRect(bx, by, bw, 24);
ctx.fillStyle = '#ccff00';
ctx.fillText(badgeText, W - 52, by + 12);

// ── Divider ──────────────────────────────────────────────────────────────
ctx.strokeStyle = 'rgba(204,255,0,0.12)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(52, 80); ctx.lineTo(W - 52, 80); ctx.stroke();

// ── Main heading ─────────────────────────────────────────────────────────
ctx.textAlign = 'left';
ctx.shadowColor = 'rgba(255,255,255,0.1)';
ctx.shadowBlur = 4;
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 68px Orbitron';
ctx.fillText('12,860+ scammers.', 52, 185);
ctx.fillText('On record. Forever.', 52, 265);

// ── Sub text ─────────────────────────────────────────────────────────────
ctx.shadowBlur = 0;
ctx.fillStyle = 'rgba(255,255,255,0.45)';
ctx.font = 'bold 22px Orbitron';
ctx.fillText('$688M+ in documented losses. Community-powered. Free to search.', 52, 330);

// ── Stat pills ───────────────────────────────────────────────────────────
const stats = [
  { label: 'INCIDENTS', value: '12,860+' },
  { label: 'TOTAL LOST', value: '$688M+' },
  { label: 'CATEGORIES', value: '7' },
];

let px = 52;
const py = 400;
stats.forEach(s => {
  const pw = 210, ph = 72;
  // pill bg
  ctx.fillStyle = 'rgba(204,255,0,0.05)';
  ctx.strokeStyle = 'rgba(204,255,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 8);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 26px Orbitron';
  ctx.textAlign = 'center';
  ctx.fillText(s.value, px + pw/2, py + 26);

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = 'bold 10px Orbitron';
  ctx.fillText(s.label, px + pw/2, py + 52);

  px += pw + 16;
});

// ── Pun line ─────────────────────────────────────────────────────────────
ctx.textAlign = 'left';
ctx.fillStyle = 'rgba(255,255,255,0.22)';
ctx.font = 'bold 16px Orbitron';
ctx.fillText('Every rug has a weaver.', 52, 516);

// ── Bottom bar ───────────────────────────────────────────────────────────
ctx.fillStyle = 'rgba(204,255,0,0.05)';
ctx.fillRect(0, H - 70, W, 70);
ctx.strokeStyle = 'rgba(204,255,0,0.15)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();

// URL left
ctx.textAlign = 'left';
ctx.fillStyle = '#ccff00';
ctx.font = 'bold 20px Orbitron';
ctx.fillText('rektgistry.com', 52, H - 30);

// CTA right
ctx.textAlign = 'right';
ctx.fillStyle = 'rgba(255,255,255,0.4)';
ctx.font = 'bold 14px Orbitron';
ctx.fillText('Search the registry → Report a scammer → File an appeal', W - 52, H - 30);

// ── Bottom neon line ─────────────────────────────────────────────────────
const botLine = ctx.createLinearGradient(0, 0, W, 0);
botLine.addColorStop(0, 'rgba(204,255,0,0)');
botLine.addColorStop(0.3, 'rgba(204,255,0,0.7)');
botLine.addColorStop(0.7, 'rgba(204,255,0,0.7)');
botLine.addColorStop(1, 'rgba(204,255,0,0)');
ctx.strokeStyle = botLine;
ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();

const out = path.join(__dirname, '../public/rektgistry-tweet-launch.png');
fs.writeFileSync(out, c.toBuffer('image/png'));
console.log('✓ Tweet image saved:', out);
