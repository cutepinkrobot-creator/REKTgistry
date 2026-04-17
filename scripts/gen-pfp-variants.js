const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

registerFont(path.join(__dirname, '../public/Orbitron-Bold.ttf'), { family: 'Orbitron', weight: 'bold' });

function drawPFP({ rings, crosshair, centerDot, border, label }) {
  const SIZE = 500;
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  const CX = SIZE / 2, CY = SIZE / 2;

  ctx.fillStyle = '#0b0c10';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Rings
  ctx.save();
  rings.forEach(({ r, fill, stroke, lw }) => {
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw || 1.5;
    ctx.stroke();
  });

  // Crosshair lines (broken)
  const GAP = crosshair.gap || 36;
  ctx.strokeStyle = crosshair.color;
  ctx.lineWidth = crosshair.lw || 1;
  ctx.beginPath(); ctx.moveTo(0, CY);       ctx.lineTo(CX - GAP, CY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX + GAP, CY); ctx.lineTo(SIZE, CY);     ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX, 0);       ctx.lineTo(CX, CY - GAP); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX, CY + GAP); ctx.lineTo(CX, SIZE);     ctx.stroke();

  // Diagonal ticks
  [45, 135, 225, 315].forEach(deg => {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(rad) * 70, CY + Math.sin(rad) * 70);
    ctx.lineTo(CX + Math.cos(rad) * 95, CY + Math.sin(rad) * 95);
    ctx.strokeStyle = crosshair.tickColor || crosshair.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Center dot
  ctx.shadowColor = centerDot.glow;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(CX, CY, centerDot.r || 6, 0, Math.PI * 2);
  ctx.fillStyle = centerDot.color;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Border
  ctx.strokeStyle = border;
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, SIZE - 8, SIZE - 8);

  // REKT
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 148px Orbitron';
  ctx.fillText('REKT', CX, CY - 50);

  // gistry
  ctx.shadowColor = 'rgba(226,232,240,0.4)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 72px Orbitron';
  ctx.fillText('gistry', CX, CY + 70);

  // Tagline
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#5a6080';
  ctx.font = '16px Orbitron';
  ctx.fillText('Web3 Scam Registry', CX, SIZE - 30);

  const out = path.join(__dirname, `../public/${label}.png`);
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('Saved:', label);
}

// ── V4: Full red target ───────────────────────────────────────────────────
drawPFP({
  label: 'rektgistry-pfp-v4-red',
  rings: [
    { r: 200, stroke: 'rgba(255,80,80,0.15)', lw: 1 },
    { r: 155, stroke: 'rgba(255,80,80,0.20)', lw: 1 },
    { r: 108, fill: 'rgba(255,80,80,0.05)', stroke: 'rgba(255,80,80,0.28)', lw: 1.5 },
    { r: 65,  stroke: 'rgba(255,80,80,0.35)', lw: 1.5 },
    { r: 28,  fill: 'rgba(255,80,80,0.22)', stroke: 'rgba(255,80,80,0.70)', lw: 2 },
  ],
  crosshair: { color: 'rgba(255,80,80,0.18)', tickColor: 'rgba(255,80,80,0.25)', gap: 36 },
  centerDot: { color: '#ff5050', glow: '#ff5050', r: 7 },
  border: 'rgba(255,80,80,0.30)',
});

// ── V5: Full blue target ──────────────────────────────────────────────────
drawPFP({
  label: 'rektgistry-pfp-v5-blue',
  rings: [
    { r: 200, stroke: 'rgba(74,126,255,0.14)', lw: 1 },
    { r: 155, stroke: 'rgba(74,126,255,0.20)', lw: 1 },
    { r: 108, fill: 'rgba(74,126,255,0.05)', stroke: 'rgba(74,126,255,0.28)', lw: 1.5 },
    { r: 65,  stroke: 'rgba(74,126,255,0.35)', lw: 1.5 },
    { r: 28,  fill: 'rgba(74,126,255,0.22)', stroke: 'rgba(74,126,255,0.70)', lw: 2 },
  ],
  crosshair: { color: 'rgba(74,126,255,0.18)', tickColor: 'rgba(74,126,255,0.28)', gap: 36 },
  centerDot: { color: '#4a7eff', glow: '#4a7eff', r: 7 },
  border: 'rgba(74,126,255,0.30)',
});

// ── V6: Yellow rings, red center dot, blue ticks ──────────────────────────
drawPFP({
  label: 'rektgistry-pfp-v6-mixed',
  rings: [
    { r: 200, stroke: 'rgba(204,255,0,0.10)', lw: 1 },
    { r: 155, stroke: 'rgba(74,126,255,0.18)', lw: 1 },
    { r: 108, fill: 'rgba(204,255,0,0.03)', stroke: 'rgba(204,255,0,0.18)', lw: 1.5 },
    { r: 65,  stroke: 'rgba(74,126,255,0.28)', lw: 1.5 },
    { r: 28,  fill: 'rgba(255,80,80,0.20)', stroke: 'rgba(255,80,80,0.65)', lw: 2 },
  ],
  crosshair: { color: 'rgba(204,255,0,0.12)', tickColor: 'rgba(74,126,255,0.28)', gap: 36 },
  centerDot: { color: '#ff5050', glow: '#ff5050', r: 7 },
  border: 'rgba(204,255,0,0.25)',
});

// ── V7: Blue rings, red center, yellow border ─────────────────────────────
drawPFP({
  label: 'rektgistry-pfp-v7-blue-red',
  rings: [
    { r: 200, stroke: 'rgba(74,126,255,0.12)', lw: 1 },
    { r: 155, stroke: 'rgba(74,126,255,0.18)', lw: 1 },
    { r: 108, fill: 'rgba(74,126,255,0.04)', stroke: 'rgba(74,126,255,0.24)', lw: 1.5 },
    { r: 65,  stroke: 'rgba(255,80,80,0.35)', lw: 1.5 },
    { r: 28,  fill: 'rgba(255,80,80,0.25)', stroke: 'rgba(255,80,80,0.72)', lw: 2 },
  ],
  crosshair: { color: 'rgba(74,126,255,0.16)', tickColor: 'rgba(255,80,80,0.30)', gap: 36 },
  centerDot: { color: '#ff5050', glow: '#ff5050', r: 7 },
  border: 'rgba(204,255,0,0.25)',
});
