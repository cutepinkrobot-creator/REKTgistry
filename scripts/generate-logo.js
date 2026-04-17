const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 800;
const H = 200;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#0b0c10';
ctx.fillRect(0, 0, W, H);

// Subtle border glow
ctx.strokeStyle = 'rgba(204,255,0,0.15)';
ctx.lineWidth = 1;
ctx.strokeRect(1, 1, W - 2, H - 2);

// "REKT" in neon yellow
ctx.fillStyle = '#ccff00';
ctx.font = 'bold 110px "Arial Black", Arial';
ctx.textBaseline = 'middle';
ctx.letterSpacing = '4px';

// Shadow glow
ctx.shadowColor = '#ccff00';
ctx.shadowBlur = 8;
ctx.fillText('REKT', 40, H / 2);

// Measure REKT width
const rektWidth = ctx.measureText('REKT').width;

// "gistry" in white/light
ctx.fillStyle = '#e2e8f0';
ctx.shadowColor = 'rgba(226,232,240,0.3)';
ctx.shadowBlur = 3;
ctx.fillText('gistry', 40 + rektWidth + 4, H / 2);

// Tagline
ctx.shadowBlur = 0;
ctx.fillStyle = '#5a6080';
ctx.font = '16px Arial';
ctx.fillText('Web3 Scam Registry', W - 220, H - 24);

// Save
const outDir = path.join(__dirname, '../public');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'rektgistry-logo.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(out, buffer);
console.log('Logo saved to', out);
