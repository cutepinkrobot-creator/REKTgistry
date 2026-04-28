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
const AC     = '#7dd3fc'; // baby blue

function drawBg(ctx) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(125,211,252,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, 'rgba(56,189,248,0.09)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, 'rgba(14,165,233,0.05)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
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
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.3, AC + 'cc');
  g.addColorStop(0.7, AC + 'cc'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = g; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}
function drawDivider(ctx, y) {
  ctx.strokeStyle = AC + '22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
}
function drawBottomBar(ctx) {
  ctx.fillStyle = AC + '0a'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = AC + '22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('REKTgistry.com', 52, H - 35);
  ctx.shadowBlur = 0; ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Source: TechCrunch · Vercel · April 2026', W - 52, H - 35);
}
function bigOutline(ctx, text, x, y, font) {
  ctx.font = font; ctx.lineJoin = 'round'; ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText(text, x, y);
  ctx.shadowColor = AC; ctx.shadowBlur = 14;
  ctx.fillStyle = AC; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

// ══════════════════════════════════════════════════════════════════════════
// Vercel Supply Chain Breach  →  DEEP VIOLET
// ══════════════════════════════════════════════════════════════════════════
const SCALE = 2;
const c = createCanvas(W * SCALE, H * SCALE);
const ctx = c.getContext('2d');
ctx.scale(SCALE, SCALE);

drawBg(ctx);
drawNeonLine(ctx, 3);
drawLogo(ctx);
drawBadge(ctx, '◈ SUPPLY CHAIN ATTACK · APRIL 2026');
drawDivider(ctx, 90);

ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
ctx.fillStyle = AC + '88'; ctx.font = 'bold 13px Orbitron';
ctx.fillText('VERCEL BREACH — OAUTH SUPPLY CHAIN — HUNDREDS OF PROJECTS EXPOSED', 52, 118);

bigOutline(ctx, 'VERCEL', 52, 210, 'bold 112px Orbitron');

ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
ctx.fillText('breached via roblox cheat software', 52, 268);
ctx.fillStyle = AC + 'bb'; ctx.font = 'bold 15px Orbitron';
ctx.fillText('a context.ai employee downloaded malware disguised as roblox exploits — rest is history', 52, 296);

// vertical divider
ctx.strokeStyle = AC + '20'; ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 320); ctx.stroke();

const pts = [
  { text: 'Lumma Stealer stole OAuth tokens',          col: 'rgba(255,255,255,0.82)' },
  { text: 'Pivoted through Context.ai → Vercel',       col: 'rgba(186,230,253,0.90)' },
  { text: 'API keys exposed across 100s of projects',  col: AC + 'dd'                },
  { text: 'Google Mandiant called in for response',    col: 'rgba(224,242,254,0.75)' },
];
ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
pts.forEach((p, i) => {
  ctx.fillStyle = p.col;
  ctx.fillText('→  ' + p.text, 618, 130 + i * 50);
});

// edge bar
const edge = ctx.createLinearGradient(0, 100, 0, 320);
edge.addColorStop(0, AC + '00'); edge.addColorStop(0.5, AC + '88'); edge.addColorStop(1, AC + '00');
ctx.strokeStyle = edge; ctx.lineWidth = 2;
ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 320); ctx.stroke();

drawDivider(ctx, 334);

// attack chain pills
const steps = [
  { value: 'ROBLOX CHEAT', label: 'INFECTION VECTOR' },
  { value: 'LUMMA',        label: 'MALWARE USED' },
  { value: 'OAUTH PIVOT',  label: 'ACCESS METHOD' },
];
const pw = (W - 104 - 32) / 3; let px = 52;
steps.forEach(p => {
  ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(px, 350, pw, 72, 10); ctx.fill(); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.shadowColor = AC; ctx.shadowBlur = 3;
  ctx.fillStyle = AC; ctx.font = 'bold 18px Orbitron';
  ctx.fillText(p.value, px + pw / 2, 350 + 26);
  ctx.shadowBlur = 0;
  ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
  ctx.fillText(p.label, px + pw / 2, 350 + 54);
  px += pw + 16;
});

ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
ctx.fillText('one employee. one bad download. hundreds of crypto projects scrambling.', 52, 464);

drawBottomBar(ctx);
drawNeonLine(ctx, H - 2);

fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-vercel-breach.png'), c.toBuffer('image/png'));
console.log('✓ Saved: vercel-breach (deep violet) 2x');
