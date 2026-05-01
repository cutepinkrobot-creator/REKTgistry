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
const AC     = '#fbbf24'; // amber — warning

function drawBg(ctx) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(251,191,36,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, 'rgba(120,80,0,0.14)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(251,191,36,0.06)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
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

const SCALE = 2;
const c = createCanvas(W * SCALE, H * SCALE);
const ctx = c.getContext('2d');
ctx.scale(SCALE, SCALE);

drawBg(ctx);
drawNeonLine(ctx, 3);
drawLogo(ctx);
drawBadge(ctx, '◈ ADMIN KEY EXPLOIT · APRIL 30, 2026');
drawDivider(ctx, 90);

// Label
ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.fillStyle = AC + '88'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('WASABI PROTOCOL — ETH · BASE · BERACHAIN · BLAST', 52, 118);

// Big amount
ctx.font = 'bold 88px Orbitron'; ctx.lineJoin = 'round'; ctx.lineWidth = 3;
ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText('$5M+', 52, 210);
ctx.shadowColor = AC; ctx.shadowBlur = 16;
ctx.fillStyle = AC; ctx.fillText('$5M+', 52, 210);
ctx.shadowBlur = 0;

ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = 'bold 17px Orbitron';
ctx.fillText('drained across 4 chains via admin key exploit', 52, 244);

drawDivider(ctx, 264);

// Two-column fact cards
const col1 = 52, col2 = 636;
const entries = [
  { col: col1, name: 'attacker self-granted admin role',       detail: 'called grantRole on permissions contract'  },
  { col: col1, name: 'vault contracts upgraded to malicious',  detail: 'all balances drained instantly'            },
  { col: col1, name: 'funds routed through Tornado Cash',      detail: '~840 ETH largest single drain'             },
  { col: col2, name: 'timelock was built in — set to zero',    detail: 'zero delay = zero protection'              },
  { col: col2, name: '"WITHDRAW NOW" — Berachain official',    detail: 'public emergency warning issued'           },
  { col: col2, name: '29th hack of April 2026',                detail: 'worst month in crypto history'             },
];

entries.forEach((e, i) => {
  const col = e.col;
  const row = i % 3;
  const y = 284 + row * 68;

  ctx.fillStyle = AC + '08';
  ctx.fillRect(col, y - 14, 556, 56);

  const isWarning = (col === col2 && row === 0);
  ctx.strokeStyle = isWarning ? AC + '55' : AC + '18';
  ctx.lineWidth = 1;
  ctx.strokeRect(col, y - 14, 556, 56);

  ctx.shadowColor = AC; ctx.shadowBlur = 3;
  ctx.fillStyle = AC; ctx.font = 'bold 13px Orbitron';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('→', col + 14, y + 14);
  ctx.shadowBlur = 0;

  const nameColor = isWarning ? '#fde68a' : 'rgba(255,255,255,0.88)';
  ctx.fillStyle = nameColor; ctx.font = 'bold 11px Orbitron';
  ctx.fillText(e.name, col + 34, y + 4);
  ctx.fillStyle = AC + 'aa'; ctx.font = 'bold 9px Orbitron';
  ctx.fillText(e.detail, col + 34, y + 22);
});

// Left edge bar
const edge = ctx.createLinearGradient(0, 100, 0, 490);
edge.addColorStop(0, AC + '00'); edge.addColorStop(0.5, AC + '77'); edge.addColorStop(1, AC + '00');
ctx.strokeStyle = edge; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 490); ctx.stroke();

ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
ctx.fillStyle = DIMMER; ctx.font = 'bold 12px Orbitron';
ctx.fillText('search the registry before you trust anyone in crypto.', 52, 508);

drawBottomBar(ctx, 'Source: CryptoTimes · CoinDesk · April 30, 2026');
drawNeonLine(ctx, H - 2);

fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-wasabi.png'), c.toBuffer('image/png'));
console.log('✓ Saved: wasabi (amber) 2x');
