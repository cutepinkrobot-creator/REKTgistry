const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

registerFont(path.join(__dirname, '../public/Orbitron-Bold.ttf'), { family: 'Orbitron', weight: 'bold' });

const SIZE = 500;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');
const CX = SIZE / 2;
const CY = SIZE / 2;

// Dark background
ctx.fillStyle = '#0b0c10';
ctx.fillRect(0, 0, SIZE, SIZE);

// ── Target rings with alternating fill ────────────────────────────────────
ctx.save();
const ringData = [
  { r: 200, fill: 'rgba(204,255,0,0.04)', stroke: 'rgba(204,255,0,0.18)' },
  { r: 155, fill: 'rgba(204,255,0,0.0)',  stroke: 'rgba(204,255,0,0.14)' },
  { r: 108, fill: 'rgba(204,255,0,0.04)', stroke: 'rgba(204,255,0,0.16)' },
  { r: 65,  fill: 'rgba(204,255,0,0.0)',  stroke: 'rgba(204,255,0,0.20)' },
  { r: 28,  fill: 'rgba(255,80,80,0.18)', stroke: 'rgba(255,80,80,0.55)' },
];
ringData.forEach(({ r, fill, stroke }) => {
  ctx.beginPath();
  ctx.arc(CX, CY, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
});

// Crosshair lines — broken (gap near center)
const GAP = 36;
const lineColor = 'rgba(204,255,0,0.13)';
ctx.strokeStyle = lineColor;
ctx.lineWidth = 1;

// Horizontal
ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(CX - GAP, CY); ctx.stroke();
ctx.beginPath(); ctx.moveTo(CX + GAP, CY); ctx.lineTo(SIZE, CY); ctx.stroke();
// Vertical
ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, CY - GAP); ctx.stroke();
ctx.beginPath(); ctx.moveTo(CX, CY + GAP); ctx.lineTo(CX, SIZE); ctx.stroke();

// Tick marks at 45° corners
[45, 135, 225, 315].forEach(deg => {
  const rad = (deg * Math.PI) / 180;
  ctx.beginPath();
  ctx.moveTo(CX + Math.cos(rad) * 70, CY + Math.sin(rad) * 70);
  ctx.lineTo(CX + Math.cos(rad) * 95, CY + Math.sin(rad) * 95);
  ctx.strokeStyle = 'rgba(204,255,0,0.16)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
});

// Red center dot with glow
ctx.shadowColor = '#ff5050';
ctx.shadowBlur = 14;
ctx.beginPath();
ctx.arc(CX, CY, 6, 0, Math.PI * 2);
ctx.fillStyle = '#ff5050';
ctx.fill();
ctx.shadowBlur = 0;

ctx.restore();

// ── Border ────────────────────────────────────────────────────────────────
ctx.strokeStyle = 'rgba(204,255,0,0.25)';
ctx.lineWidth = 3;
ctx.strokeRect(4, 4, SIZE - 8, SIZE - 8);

// ── "REKT" ────────────────────────────────────────────────────────────────
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = '#ccff00';
ctx.shadowBlur = 32;
ctx.fillStyle = '#ccff00';
ctx.font = 'bold 148px Orbitron';
ctx.fillText('REKT', CX, CY - 50);

// ── "gistry" ──────────────────────────────────────────────────────────────
ctx.shadowColor = 'rgba(226,232,240,0.4)';
ctx.shadowBlur = 10;
ctx.fillStyle = '#e2e8f0';
ctx.font = 'bold 72px Orbitron';
ctx.fillText('gistry', CX, CY + 70);

// ── Tagline ───────────────────────────────────────────────────────────────
ctx.shadowBlur = 0;
ctx.fillStyle = '#5a6080';
ctx.font = '16px Orbitron';
ctx.fillText('Web3 Scam Registry', CX, SIZE - 30);

const out = path.join(__dirname, '../public/rektgistry-pfp-v3-target.png');
fs.writeFileSync(out, canvas.toBuffer('image/png'));
console.log('Saved:', out);
