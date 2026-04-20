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

function drawBg(ctx, glow1, glow2, gridColor) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gridColor || `rgba(204,255,0,${GRID_A})`; ctx.lineWidth = 1;
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
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.3, AC); g.addColorStop(0.7, AC); g.addColorStop(1, 'rgba(0,0,0,0)');
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
  ctx.shadowColor = AC; ctx.shadowBlur = 12;
  ctx.fillStyle = AC; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}
function drawPills(ctx, pills, py, ph, AC) {
  const pw = (W - 104 - (pills.length - 1) * 16) / pills.length; let px = 52;
  pills.forEach(p => {
    ctx.fillStyle = AC + '10'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = AC; ctx.shadowBlur = 3;
    ctx.fillStyle = AC; ctx.font = 'bold 22px Orbitron';
    ctx.fillText(p.value, px + pw / 2, py + ph * 0.36);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(p.label, px + pw / 2, py + ph * 0.72);
    px += pw + 16;
  });
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 1 — DPRK "Kim Jong Un Test"  →  PURPLE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#a855f7';

  drawBg(ctx, 'rgba(126,34,206,0.08)', 'rgba(88,28,135,0.05)', `rgba(168,85,247,${GRID_A})`);
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ DPRK INSIDER THREAT · APRIL 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('NORTH KOREA — NEW DETECTION METHOD GOING VIRAL', 52, 118);

  bigOutline(ctx, 'THE KIM', 52, 200, 'bold 108px Orbitron', AC);
  bigOutline(ctx, 'JONG UN', 52, 307, 'bold 108px Orbitron', AC);

  // Right panel
  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(592, 108); ctx.lineTo(592, 370); ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 18px Orbitron';
  ctx.fillText('THE TEST', 620, 136);

  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Ask the job candidate to criticize', 620, 166);
  ctx.fillText('North Korea\'s leader out loud.', 620, 186);

  ctx.fillStyle = 'rgba(255,255,255,0.70)'; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Real developer: no problem.', 620, 222);

  ctx.fillStyle = `${AC}ee`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('DPRK operative: hesitates,', 620, 248);
  ctx.fillText('deflects, or disconnects.', 620, 268);

  const pts = [
    { text: '40+ DeFi projects infiltrated by DPRK devs', col: 'rgba(216,180,254,0.90)' },
    { text: 'Fake LinkedIn, GitHub, forged credentials', col: 'rgba(255,255,255,0.80)'   },
    { text: 'Viral video: candidate disconnects live',   col: `${AC}ee`                  },
  ];
  ctx.font = 'bold 12px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 620, 308 + i * 36);
  });

  const edge = ctx.createLinearGradient(0, 100, 0, 370);
  edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}88`); edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 370); ctx.stroke();

  drawDivider(ctx, 382, `${AC}18`);
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('Your next hire could be funding a missile program. Vet everyone.', 52, 428);
  ctx.fillStyle = `${AC}77`; ctx.font = 'bold 12px Orbitron';
  ctx.fillText('DPRK operatives now targeting AI, crypto, and Web3 companies via LinkedIn, GitHub & Upwork.', 52, 452);

  drawBottomBar(ctx, AC, 'Source: CCN · CoinDesk · April 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-dprk-kimtest.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: dprk-kimtest (purple)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 2 — KelpDAO Aftermath: $9B fled Aave  →  SKY BLUE
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#38bdf8';

  drawBg(ctx, 'rgba(2,132,199,0.08)', 'rgba(99,102,241,0.05)', `rgba(56,189,248,${GRID_A})`);
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ DEFI CONTAGION · APRIL 20, 2026', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('KELPDAO AFTERMATH — AAVE CRISIS — THIS WEEKEND', 52, 118);

  bigOutline(ctx, '$9B', 52, 205, 'bold 130px Orbitron', AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('fled Aave in one weekend', 52, 272);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('the fallout from the $292M KelpDAO hack is just getting started', 52, 300);

  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(530, 108); ctx.lineTo(530, 325); ctx.stroke();

  const pts = [
    { text: 'Aave TVL dropped $6.6B overnight',      col: 'rgba(255,255,255,0.82)' },
    { text: 'AAVE token down 16% on the news',        col: 'rgba(186,230,253,0.90)' },
    { text: 'rsETH markets frozen on Aave V3 + V4',  col: `${AC}dd`               },
    { text: '"DeFi is dead" trending on crypto X',   col: 'rgba(200,235,255,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 558, 130 + i * 52);
  });

  const edge = ctx.createLinearGradient(0, 100, 0, 325);
  edge.addColorStop(0, `${AC}00`); edge.addColorStop(0.5, `${AC}88`); edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 325); ctx.stroke();

  drawDivider(ctx, 338, `${AC}18`);

  drawPills(ctx, [
    { value: '$292M',  label: 'STOLEN FROM KELPDAO' },
    { value: '$9B',    label: 'FLED AAVE IN WEEKEND' },
    { value: '-16%',   label: 'AAVE TOKEN DROP' },
  ], 354, 72, AC);

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('One exploit. One weekend. $9 billion reasons to reconsider DeFi risk.', 52, 466);

  drawBottomBar(ctx, AC, 'Source: Bloomberg · CoinDesk · April 20, 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-kelpdao-aftermath.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: kelpdao-aftermath (blue)');
}
