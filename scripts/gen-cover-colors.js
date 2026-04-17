const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

function makecover(gridColor, filename) {
  const W = 1500, H = 500;
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  // Left radial glow
  const grd = ctx.createRadialGradient(420, H/2, 0, 420, H/2, 340);
  grd.addColorStop(0, 'rgba(204,255,0,0.06)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

  // Right accent glow
  const grd2 = ctx.createRadialGradient(W-200, H/2, 0, W-200, H/2, 280);
  grd2.addColorStop(0, 'rgba(74,126,255,0.035)'); grd2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd2; ctx.fillRect(0, 0, W, H);

  // Crosshair rings
  const CX = 420, CY = H/2;
  [200, 145, 95, 52].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(CX, CY, r, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(204,255,0,${0.025 + i*0.012})`; ctx.lineWidth = 1; ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(204,255,0,0.03)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(840, CY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, H); ctx.stroke();

  // Separator
  ctx.strokeStyle = 'rgba(204,255,0,0.10)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(840, 60); ctx.lineTo(840, H-60); ctx.stroke();

  // REKT
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 168px Orbitron';
  ctx.fillText('REKT', CX, CY - 40);

  // gistry
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(204,255,0,0.65)'; ctx.font = 'bold 72px Orbitron';
  ctx.fillText('gistry', CX, CY + 70);

  // Badge
  const RX = 1150;
  const badgeText = '◈ WEB3 SCAM REGISTRY';
  ctx.shadowBlur = 0; ctx.font = 'bold 13px Orbitron'; ctx.textAlign = 'center';
  const bw = ctx.measureText(badgeText).width + 28, bh = 26;
  const bx = RX - bw/2, by = CY - 120;
  ctx.strokeStyle = 'rgba(204,255,0,0.28)'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = 'rgba(204,255,0,0.06)'; ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = '#ccff00'; ctx.fillText(badgeText, RX, by + bh/2);

  // Taglines
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 38px Orbitron';
  ctx.fillText('Decentralized trust.', RX, CY - 50);
  ctx.fillText('Centralized receipts.', RX, CY + 2);

  ctx.fillStyle = 'rgba(204,255,0,0.55)'; ctx.font = 'bold 16px Orbitron';
  ctx.fillText('Every rug has a weaver.', RX, CY + 58);

  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 18px Orbitron';
  ctx.fillText('REKTgistry.com', RX, CY + 110);

  // Bottom saber line
  const lineY = H - 22;
  const linGrd = ctx.createLinearGradient(0, 0, W, 0);
  linGrd.addColorStop(0,   'rgba(204,255,0,0)');
  linGrd.addColorStop(0.2, 'rgba(204,255,0,0.45)');
  linGrd.addColorStop(0.5, 'rgba(204,255,0,0.65)');
  linGrd.addColorStop(0.8, 'rgba(204,255,0,0.45)');
  linGrd.addColorStop(1,   'rgba(204,255,0,0)');
  ctx.strokeStyle = linGrd; ctx.lineWidth = 2;
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(W, lineY); ctx.stroke();
  ctx.shadowBlur = 0;

  const out = path.join(__dirname, '../public/', filename);
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ Saved:', filename);
}

makecover('rgba(0,200,255,0.055)',   'rektgistry-twitter-cover-bluegrid.png');
makecover('rgba(255,120,0,0.055)',   'rektgistry-twitter-cover-orangegrid.png');
