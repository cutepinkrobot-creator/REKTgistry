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
const AC    = '#38bdf8';  // sky blue — ETH/DeFi

const c = createCanvas(W, H); const ctx = c.getContext('2d');

// Background
ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
ctx.strokeStyle = `rgba(56,189,248,${GRID_A})`; ctx.lineWidth = 1;
for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 650);
g1.addColorStop(0, 'rgba(2,132,199,0.10)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 480);
g2.addColorStop(0, 'rgba(99,102,241,0.06)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

// Top neon line
const tl = ctx.createLinearGradient(0, 0, W, 0);
tl.addColorStop(0, 'rgba(0,0,0,0)'); tl.addColorStop(0.3, `${AC}cc`);
tl.addColorStop(0.7, `${AC}cc`); tl.addColorStop(1, 'rgba(0,0,0,0)');
ctx.strokeStyle = tl; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(W, 3); ctx.stroke();

// Logo — gistry white
ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
ctx.fillStyle = '#ccff00'; ctx.font = 'bold 44px Orbitron';
ctx.fillText('REKT', 52, 52);
ctx.shadowBlur = 0;
ctx.fillStyle = '#d0d8e8'; ctx.font = 'bold 20px Orbitron';
ctx.fillText('gistry', 54, 74);

// Badge
ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
ctx.font = 'bold 11px Orbitron';
const badgeText = '🚨 BREAKING · BIGGEST HACK OF 2026';
const bw = ctx.measureText(badgeText).width + 24, bx = W - 52 - bw, by = 36;
ctx.strokeStyle = AC + '55'; ctx.lineWidth = 1;
ctx.strokeRect(bx, by, bw, 24);
ctx.fillStyle = AC + '12'; ctx.fillRect(bx, by, bw, 24);
ctx.fillStyle = AC; ctx.fillText(badgeText, W - 52, by + 12);

// Divider
ctx.strokeStyle = `${AC}22`; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(52, 90); ctx.lineTo(W - 52, 90); ctx.stroke();

// Protocol label
ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
ctx.fillText('KELPDAO — rsETH LAYERZERO BRIDGE EXPLOIT — APRIL 18, 2026', 52, 118);

// Big number with white outline
ctx.font = 'bold 118px Orbitron';
ctx.lineJoin = 'round'; ctx.lineWidth = 3;
ctx.strokeStyle = 'rgba(255,255,255,0.55)';
ctx.strokeText('$292M', 52, 212);
ctx.shadowColor = AC; ctx.shadowBlur = 14;
ctx.fillStyle = AC;
ctx.fillText('$292M', 52, 212);
ctx.shadowBlur = 0;

ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
ctx.fillText('drained · now the #1 DeFi exploit of 2026', 52, 272);
ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
ctx.fillText('overtook Drift Protocol ($285M) just 17 days after that attack', 52, 300);

// Vertical divider
ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(592, 108); ctx.lineTo(592, 326); ctx.stroke();

// Right facts
const pts = [
  { text: 'Fake LayerZero message tricked bridge',   col: 'rgba(255,255,255,0.82)' },
  { text: '116,500 rsETH drained in minutes',        col: 'rgba(186,230,253,0.90)' },
  { text: '$236M WETH borrowed on Aave as collateral', col: `${AC}dd`              },
  { text: 'AAVE token crashed 10% on the news',      col: 'rgba(200,235,255,0.75)' },
];
ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
pts.forEach((p, i) => {
  ctx.fillStyle = p.col;
  ctx.fillText('→  ' + p.text, 620, 130 + i * 52);
});

// Left edge accent bar
const edge = ctx.createLinearGradient(0, 100, 0, 326);
edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}88`); edge.addColorStop(1, `${AC}00`);
ctx.strokeStyle = edge; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 326); ctx.stroke();

// Full divider
ctx.strokeStyle = `${AC}18`; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(52, 340); ctx.lineTo(W - 52, 340); ctx.stroke();

// Stat pills
const pills = [
  { value: '$292M',   label: 'STOLEN' },
  { value: '46 MIN',  label: 'TO FREEZE PROTOCOL' },
  { value: '#1',      label: 'LARGEST HACK OF 2026' },
];
const pw = (W - 104 - 32) / 3; let px = 52;
pills.forEach(p => {
  ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(px, 356, pw, 72, 10); ctx.fill(); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.shadowColor = AC; ctx.shadowBlur = 3;
  ctx.fillStyle = AC; ctx.font = 'bold 22px Orbitron';
  ctx.fillText(p.value, px + pw / 2, 356 + 26);
  ctx.shadowBlur = 0;
  ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
  ctx.fillText(p.label, px + pw / 2, 356 + 54);
  px += pw + 16;
});

// Closing line
ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
ctx.fillText("Wallets funded via Tornado Cash. Bad debt left on Aave. Record broken.", 52, 468);

// Bottom bar
ctx.fillStyle = AC + '0a'; ctx.fillRect(0, H - 70, W, 70);
ctx.strokeStyle = AC + '22'; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
ctx.fillText('REKTgistry.com', 52, H - 35);
ctx.shadowBlur = 0; ctx.textAlign = 'right';
ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
ctx.fillText('Source: @zachxbt · CoinDesk · April 18, 2026', W - 52, H - 35);

// Bottom neon line
const bl = ctx.createLinearGradient(0, 0, W, 0);
bl.addColorStop(0, 'rgba(0,0,0,0)'); bl.addColorStop(0.3, `${AC}bb`);
bl.addColorStop(0.7, `${AC}bb`); bl.addColorStop(1, 'rgba(0,0,0,0)');
ctx.strokeStyle = bl; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();

fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-kelpdao.png'), c.toBuffer('image/png'));
console.log('✓ Saved: kelpdao');
