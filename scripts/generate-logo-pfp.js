const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register Orbitron font
const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const SIZE = 500;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');
const CX = SIZE / 2;
const CY = SIZE / 2;

// Dark background
ctx.fillStyle = '#0b0c10';
ctx.fillRect(0, 0, SIZE, SIZE);

// ── Crosshair / target in background ──────────────────────────────────────
ctx.save();

// Concentric rings (faint neon yellow)
const rings = [180, 130, 85, 45];
rings.forEach((r, i) => {
  ctx.beginPath();
  ctx.arc(CX, CY, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(204,255,0,${0.07 + i * 0.03})`;
  ctx.lineWidth = i === 0 ? 1.5 : 1;
  ctx.stroke();
});

// Cross hairs (full-width lines through center, faint)
ctx.strokeStyle = 'rgba(204,255,0,0.10)';
ctx.lineWidth = 1;

ctx.beginPath();
ctx.moveTo(0, CY);
ctx.lineTo(SIZE, CY);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(CX, 0);
ctx.lineTo(CX, SIZE);
ctx.stroke();

// Small gap around center (erase the lines inside innermost ring to give 'sight' look)
const GAP = 28;
// diagonal tick marks at 45° between lines
[45, 135, 225, 315].forEach(deg => {
  const rad = (deg * Math.PI) / 180;
  const innerR = 55;
  const outerR = 78;
  ctx.beginPath();
  ctx.moveTo(CX + Math.cos(rad) * innerR, CY + Math.sin(rad) * innerR);
  ctx.lineTo(CX + Math.cos(rad) * outerR, CY + Math.sin(rad) * outerR);
  ctx.strokeStyle = 'rgba(204,255,0,0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();
});

// Dot in center
ctx.beginPath();
ctx.arc(CX, CY + 4, 3, 0, Math.PI * 2);
ctx.fillStyle = 'rgba(204,255,0,0.18)';
ctx.fill();

ctx.restore();

// ── Outer border ──────────────────────────────────────────────────────────
ctx.strokeStyle = 'rgba(204,255,0,0.25)';
ctx.lineWidth = 3;
ctx.strokeRect(4, 4, SIZE - 8, SIZE - 8);

// ── "REKT" ────────────────────────────────────────────────────────────────
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = '#ccff00';
ctx.shadowBlur = 8;
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

const out = path.join(__dirname, '../public/rektgistry-pfp.png');
fs.writeFileSync(out, canvas.toBuffer('image/png'));
console.log('PFP saved to', out);
