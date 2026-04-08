const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const SIZE = 500;
const canvas = createCanvas(SIZE, SIZE);
const ctx = canvas.getContext('2d');

// Dark background
ctx.fillStyle = '#0b0c10';
ctx.fillRect(0, 0, SIZE, SIZE);

// Subtle neon border
ctx.strokeStyle = 'rgba(204,255,0,0.25)';
ctx.lineWidth = 3;
ctx.strokeRect(4, 4, SIZE - 8, SIZE - 8);

// "REKT" - big, centered, neon yellow glow
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

ctx.shadowColor = '#ccff00';
ctx.shadowBlur = 30;
ctx.fillStyle = '#ccff00';
ctx.font = 'bold 148px "Arial Black", Arial';
ctx.fillText('REKT', SIZE / 2, SIZE / 2 - 50);

// "gistry" - smaller, white
ctx.shadowColor = 'rgba(226,232,240,0.4)';
ctx.shadowBlur = 10;
ctx.fillStyle = '#e2e8f0';
ctx.font = 'bold 72px "Arial Black", Arial';
ctx.fillText('gistry', SIZE / 2, SIZE / 2 + 70);

// Tagline
ctx.shadowBlur = 0;
ctx.fillStyle = '#5a6080';
ctx.font = '18px Arial';
ctx.fillText('Web3 Scam Registry', SIZE / 2, SIZE - 30);

const out = path.join(__dirname, '../public/rektgistry-pfp.png');
fs.writeFileSync(out, canvas.toBuffer('image/png'));
console.log('PFP saved to', out);
