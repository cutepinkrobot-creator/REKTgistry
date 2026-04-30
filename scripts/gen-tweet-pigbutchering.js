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
const AC     = '#14b8a6'; // teal

function drawBg(ctx) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(20,184,166,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, 'rgba(15,118,110,0.12)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(20,184,166,0.07)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
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
drawBadge(ctx, '◈ PIG BUTCHERING CRACKDOWN · APRIL 23, 2026');
drawDivider(ctx, 90);

// Label
ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.fillStyle = AC + '88'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('LARGEST EVER GOVERNMENT ACTION AGAINST CRYPTO SCAM COMPOUNDS', 52, 118);

// Big number
ctx.font = 'bold 88px Orbitron'; ctx.lineJoin = 'round'; ctx.lineWidth = 3;
ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText('$701M', 52, 210);
ctx.shadowColor = AC; ctx.shadowBlur = 16;
ctx.fillStyle = AC; ctx.fillText('$701M', 52, 210);
ctx.shadowBlur = 0;

ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = 'bold 17px Orbitron';
ctx.fillText('in crypto seized — DOJ Scam Center Strike Force', 52, 244);

drawDivider(ctx, 264);

// Two-column fact cards
const col1 = 52, col2 = 636;
const entries = [
  { col: col1, name: 'Cambodian senator Kok An sanctioned',  detail: 'OFAC · 28 entities in his network'       },
  { col: col1, name: '503 fake investment sites seized',      detail: 'Operation Level Up · DOJ'                },
  { col: col1, name: '2 Chinese nationals charged',           detail: 'ran Myanmar scam compound Shunda Park'   },
  { col: col2, name: '6,000-member Telegram channel taken',   detail: 'used to recruit trafficked workers'      },
  { col: col2, name: '$7.2B lost by Americans in 2025',       detail: 'FBI IC3 — pig butchering alone'          },
  { col: col2, name: '$10M reward for Tai Chang compound',    detail: 'State Dept · Burma scam center'          },
];

entries.forEach((e, i) => {
  const col = e.col;
  const row = i % 3;
  const y = 284 + row * 68;

  ctx.fillStyle = AC + '08';
  ctx.fillRect(col, y - 14, 556, 56);
  ctx.strokeStyle = AC + '18'; ctx.lineWidth = 1;
  ctx.strokeRect(col, y - 14, 556, 56);

  ctx.shadowColor = AC; ctx.shadowBlur = 3;
  ctx.fillStyle = AC; ctx.font = 'bold 13px Orbitron';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('→', col + 14, y + 14);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = 'bold 11px Orbitron';
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

drawBottomBar(ctx, 'Source: DOJ · US Treasury · State Dept · April 23, 2026');
drawNeonLine(ctx, H - 2);

fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-pigbutchering.png'), c.toBuffer('image/png'));
console.log('✓ Saved: pigbutchering (teal) 2x');
