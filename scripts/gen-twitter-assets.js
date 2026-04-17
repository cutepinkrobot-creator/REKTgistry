const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PICTURE  400×400 (Twitter crops to circle)
// ─────────────────────────────────────────────────────────────────────────────
{
  const S = 400;
  const c = createCanvas(S, S);
  const ctx = c.getContext('2d');
  const CX = S / 2, CY = S / 2;

  // Background
  ctx.fillStyle = '#0b0c10';
  ctx.fillRect(0, 0, S, S);

  // Subtle radial glow behind text
  const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, 200);
  grd.addColorStop(0, 'rgba(204,255,0,0.10)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, S, S);

  // Crosshair rings
  [160, 115, 75].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(204,255,0,${0.06 + i * 0.025})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Cross hair lines
  ctx.strokeStyle = 'rgba(204,255,0,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(S, CY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, S); ctx.stroke();

  // Corner brackets
  const BL = 28, BT = 3, PAD = 16;
  const corners = [
    [PAD, PAD],
    [S - PAD, PAD],
    [PAD, S - PAD],
    [S - PAD, S - PAD],
  ];
  ctx.strokeStyle = 'rgba(204,255,0,0.45)';
  ctx.lineWidth = BT;
  ctx.lineCap = 'square';
  corners.forEach(([x, y]) => {
    const dx = x < S / 2 ? 1 : -1;
    const dy = y < S / 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + dx * BL, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * BL);
    ctx.stroke();
  });

  // "REKT" — neon lime, large
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 108px Orbitron';
  ctx.fillText('REKT', CX, CY - 32);

  // "gistry" — white/slate
  ctx.shadowColor = 'rgba(255,255,255,0.2)';
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#d0d8e8';
  ctx.font = 'bold 50px Orbitron';
  ctx.fillText('gistry', CX, CY + 58);

  // Center dot
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(CX, CY + 5, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(204,255,0,0.35)';
  ctx.fill();

  const out = path.join(__dirname, '../public/rektgistry-twitter-pfp.png');
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ PFP saved:', out);
}

// ─────────────────────────────────────────────────────────────────────────────
// COVER PHOTO  1500×500  (v2 — deeper black, lower glow, green secondary text)
// ─────────────────────────────────────────────────────────────────────────────
{
  const W = 1500, H = 500;
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // Background — near pure black
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, W, H);

  // Grid — very subtle
  ctx.strokeStyle = 'rgba(204,255,0,0.012)';
  ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let x = 0; x <= W; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }

  // Left radial glow — halved
  const grd = ctx.createRadialGradient(420, H / 2, 0, 420, H / 2, 340);
  grd.addColorStop(0, 'rgba(204,255,0,0.06)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Right accent glow — halved
  const grd2 = ctx.createRadialGradient(W - 200, H / 2, 0, W - 200, H / 2, 280);
  grd2.addColorStop(0, 'rgba(74,126,255,0.035)');
  grd2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd2;
  ctx.fillRect(0, 0, W, H);

  // Crosshair rings — more subtle
  const CX = 420, CY = H / 2;
  [200, 145, 95, 52].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(204,255,0,${0.025 + i * 0.012})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(204,255,0,0.03)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(840, CY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, H); ctx.stroke();

  // Vertical separator line
  ctx.strokeStyle = 'rgba(204,255,0,0.10)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(840, 60); ctx.lineTo(840, H - 60); ctx.stroke();

  // ── LEFT: REKT + gistry ──
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 168px Orbitron';
  ctx.fillText('REKT', CX, CY - 40);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(204,255,0,0.65)';
  ctx.font = 'bold 72px Orbitron';
  ctx.fillText('gistry', CX, CY + 70);

  // ── RIGHT: taglines ──
  const RX = 1150;

  // Badge
  const badgeText = '◈ WEB3 SCAM REGISTRY';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 13px Orbitron';
  ctx.textAlign = 'center';
  const bw = ctx.measureText(badgeText).width + 28;
  const bh = 26;
  const bx = RX - bw / 2, by = CY - 120;
  ctx.strokeStyle = 'rgba(204,255,0,0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = 'rgba(204,255,0,0.06)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = '#ccff00';
  ctx.fillText(badgeText, RX, by + bh / 2);

  // Main tagline
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px Orbitron';
  ctx.fillText('Decentralized trust.', RX, CY - 50);
  ctx.fillText('Centralized receipts.', RX, CY + 2);

  // Sub tagline — neon green instead of faded white
  ctx.fillStyle = 'rgba(204,255,0,0.55)';
  ctx.font = 'bold 16px Orbitron';
  ctx.fillText('Every rug has a weaver.', RX, CY + 58);

  // URL — full lime
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 18px Orbitron';
  ctx.fillText('REKTgistry.com', RX, CY + 110);

  // Bottom saber line — toned down
  const lineY = H - 22;
  const linGrd = ctx.createLinearGradient(0, 0, W, 0);
  linGrd.addColorStop(0,   'rgba(204,255,0,0)');
  linGrd.addColorStop(0.2, 'rgba(204,255,0,0.45)');
  linGrd.addColorStop(0.5, 'rgba(204,255,0,0.65)');
  linGrd.addColorStop(0.8, 'rgba(204,255,0,0.45)');
  linGrd.addColorStop(1,   'rgba(204,255,0,0)');
  ctx.strokeStyle = linGrd;
  ctx.lineWidth = 2;
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 3;
  ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(W, lineY); ctx.stroke();
  ctx.shadowBlur = 0;

  // Save both v2 (for compare) and overwrite original
  const outV2 = path.join(__dirname, '../public/rektgistry-twitter-cover-v2.png');
  fs.writeFileSync(outV2, c.toBuffer('image/png'));
  console.log('✓ Cover v2 saved:', outV2);
}
