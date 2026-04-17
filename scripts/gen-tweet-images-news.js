const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;

// ── Helper: draw background ───────────────────────────────────────────────────
function drawBackground(ctx, glowColor1, glowColor2) {
  ctx.fillStyle = '#0b0c10';
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = 'rgba(204,255,0,0.03)';
  ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  // Bottom-left radial glow
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, glowColor1);
  g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  // Top-right accent glow
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, glowColor2);
  g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

// ── Helper: draw REKT logo top-left ──────────────────────────────────────────
function drawLogo(ctx) {
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 52px Orbitron';
  ctx.fillText('REKT', 52, 54);
  ctx.shadowBlur = 3;
  ctx.fillStyle = '#d0d8e8';
  ctx.font = 'bold 28px Orbitron';
  ctx.fillText('gistry', 170, 58);
  ctx.shadowBlur = 0;
}

// ── Helper: draw top badge ────────────────────────────────────────────────────
function drawBadge(ctx, text, color) {
  ctx.shadowBlur = 0;
  ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24;
  const bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = color + '66';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = color + '12';
  ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = color;
  ctx.fillText(text, W - 52, by + 12);
}

// ── Helper: draw top neon line ────────────────────────────────────────────────
function drawTopLine(ctx, color) {
  const topLine = ctx.createLinearGradient(0, 0, W, 0);
  topLine.addColorStop(0, 'rgba(0,0,0,0)');
  topLine.addColorStop(0.3, color);
  topLine.addColorStop(0.7, color);
  topLine.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = topLine;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(W, 3); ctx.stroke();
}

// ── Helper: draw horizontal divider ──────────────────────────────────────────
function drawDivider(ctx, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
}

// ── Helper: draw bottom bar ───────────────────────────────────────────────────
function drawBottomBar(ctx, accentColor, rightText) {
  ctx.fillStyle = accentColor + '0d';
  ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = accentColor + '26';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ccff00';
  ctx.font = 'bold 20px Orbitron';
  ctx.fillText('rektgistry.com', 52, H - 30);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = 'bold 13px Orbitron';
  ctx.fillText(rightText, W - 52, H - 30);
}

// ── Helper: draw bottom neon line ─────────────────────────────────────────────
function drawBottomLine(ctx, color) {
  const botLine = ctx.createLinearGradient(0, 0, W, 0);
  botLine.addColorStop(0, 'rgba(0,0,0,0)');
  botLine.addColorStop(0.3, color);
  botLine.addColorStop(0.7, color);
  botLine.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = botLine;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 1: Fake Ledger App scam alert
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(255,80,80,0.10)', 'rgba(255,140,0,0.07)');
  drawTopLine(ctx, 'rgba(255,80,80,0.8)');
  drawLogo(ctx);
  drawBadge(ctx, '⚠ ACTIVE SCAM ALERT', '#ff5050');

  drawDivider(ctx, 80, 'rgba(255,80,80,0.2)');

  // ── Big stat left ──────────────────────────────────────────────────────────
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ff5050';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ff5050';
  ctx.font = 'bold 120px Orbitron';
  ctx.fillText('$9.5M', 52, 195);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = 'bold 22px Orbitron';
  ctx.fillText('stolen in 7 days', 52, 265);

  ctx.fillStyle = 'rgba(255,200,100,0.75)';
  ctx.font = 'bold 17px Orbitron';
  ctx.fillText('50+ victims. 1 fake app. Apple App Store.', 52, 305);

  // ── Vertical divider ───────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,80,80,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(580, 105); ctx.lineTo(580, 350); ctx.stroke();

  // ── Bullet points right ────────────────────────────────────────────────────
  const bullets = [
    '📱 Fake Ledger Live app on App Store',
    '🔑 Prompted users for 24-word seed phrase',
    '💸 Funds laundered via 150+ KuCoin addresses',
  ];
  ctx.textAlign = 'left';
  ctx.font = 'bold 16px Orbitron';
  bullets.forEach((b, i) => {
    ctx.fillStyle = i === 0 ? 'rgba(255,255,255,0.75)' : i === 1 ? 'rgba(255,180,80,0.85)' : 'rgba(255,80,80,0.85)';
    ctx.fillText(b, 610, 155 + i * 72);
  });

  // ── Red neon glow accent lines (left edge) ─────────────────────────────────
  const redGlow = ctx.createLinearGradient(0, 100, 0, 360);
  redGlow.addColorStop(0, 'rgba(255,80,80,0)');
  redGlow.addColorStop(0.5, 'rgba(255,80,80,0.7)');
  redGlow.addColorStop(1, 'rgba(255,80,80,0)');
  ctx.strokeStyle = redGlow;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 360); ctx.stroke();

  // ── Divider before bottom section ─────────────────────────────────────────
  drawDivider(ctx, 370, 'rgba(255,80,80,0.12)');

  drawBottomBar(ctx, '#ff5050', 'Source: @zachxbt · April 2026');
  drawBottomLine(ctx, 'rgba(255,80,80,0.7)');

  const out = path.join(__dirname, '../public/rektgistry-tweet-ledger.png');
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ Image 1 saved:', out);
}

// ════════════════════════════════════════════════════════════════════════════
// IMAGE 2: FBI IC3 Annual Report stats
// ════════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(74,126,255,0.09)', 'rgba(74,126,255,0.06)');
  drawTopLine(ctx, 'rgba(74,126,255,0.8)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ FBI IC3 ANNUAL REPORT 2025', '#4a7eff');

  drawDivider(ctx, 80, 'rgba(74,126,255,0.2)');

  // ── HUGE centered stat ────────────────────────────────────────────────────
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#4a7eff';
  ctx.shadowBlur = 22;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 140px Orbitron';
  ctx.fillText('$11.4B', W / 2, 188);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#4a7eff';
  ctx.font = 'bold 24px Orbitron';
  ctx.fillText('lost to crypto scams in 2025', W / 2, 264);

  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.font = 'bold 14px Orbitron';
  ctx.fillText('↑ 22% from 2024  ·  181,565 complaints  ·  all-time record', W / 2, 300);

  drawDivider(ctx, 332, 'rgba(74,126,255,0.18)');

  // ── Stat pills ────────────────────────────────────────────────────────────
  const stats = [
    { value: '181,565', label: 'COMPLAINTS' },
    { value: '$7.2B', label: 'INVESTMENT FRAUD' },
    { value: '$389M', label: 'CRYPTO ATM SCAMS' },
  ];

  const pw = 260, ph = 72;
  const totalW = stats.length * pw + (stats.length - 1) * 20;
  let px = (W - totalW) / 2;
  const py = 350;

  stats.forEach(s => {
    ctx.fillStyle = 'rgba(74,126,255,0.07)';
    ctx.strokeStyle = 'rgba(74,126,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 8);
    ctx.fill(); ctx.stroke();

    ctx.shadowColor = '#ccff00';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#ccff00';
    ctx.font = 'bold 26px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(s.value, px + pw / 2, py + 26);

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.label, px + pw / 2, py + 52);

    px += pw + 20;
  });

  // ── Italic pun ────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = 'bold 15px Orbitron';
  ctx.fillText("and that's only what got reported.", W / 2, 462);

  drawBottomBar(ctx, '#4a7eff', 'FBI IC3 Report · April 2026');
  drawBottomLine(ctx, 'rgba(74,126,255,0.7)');

  const out = path.join(__dirname, '../public/rektgistry-tweet-fbi.png');
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('✓ Image 2 saved:', out);
}
