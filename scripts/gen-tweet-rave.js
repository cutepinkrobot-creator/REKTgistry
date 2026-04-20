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
const AC    = '#f59e0b';  // amber — market manipulation / money theme

function drawLogo(ctx) {
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#d0d8e8'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
}
function drawNeonLine(ctx, y, color) {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.3, color); g.addColorStop(0.7, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = g; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}
function drawDivider(ctx, y, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
}
function drawBottomBar(ctx, accentColor, rightText) {
  ctx.fillStyle = accentColor + '0a'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = accentColor + '22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('REKTgistry.com', 52, H - 35);
  ctx.shadowBlur = 0; ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText(rightText, W - 52, H - 35);
}

// ── Background ──────────────────────────────────────────────────────────
ctx = null; // avoid lint
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(245,158,11,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  // Bottom-left warm glow
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 650);
  g1.addColorStop(0, 'rgba(180,100,0,0.09)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  // Top-right blue accent
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 450);
  g2.addColorStop(0, 'rgba(59,130,246,0.05)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);

  // Badge
  ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const badgeText = '⚠ MARKET MANIPULATION ALERT';
  const bw = ctx.measureText(badgeText).width + 24, bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = AC + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = AC + '12'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = AC; ctx.fillText(badgeText, W - 52, by + 12);

  drawDivider(ctx, 90, `${AC}22`);

  // Ticker tag
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('$RAVE — ALLEGED INSIDER PUMP', 52, 118);

  // Big FDV number
  ctx.shadowColor = AC; ctx.shadowBlur = 14;
  ctx.fillStyle = AC; ctx.font = 'bold 118px Orbitron';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.strokeText('$26B', 52, 208);
  ctx.fillText('$26B', 52, 208);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('fully diluted valuation', 52, 272);
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('token broke into top 20 by market cap — @zachxbt flagged insider manipulation', 52, 300);

  // Vertical divider
  ctx.strokeStyle = `${AC}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(590, 108); ctx.lineTo(590, 325); ctx.stroke();

  // Right side facts
  const pts = [
    { text: '@zachxbt called on Binance to investigate', col: 'rgba(255,255,255,0.82)' },
    { text: 'Bitget + Gate.io also named in request',    col: 'rgba(253,230,138,0.88)' },
    { text: '$10,000 whistleblower bounty offered',      col: `${AC}ee`               },
    { text: 'Token pumped with no credible catalyst',    col: 'rgba(255,200,100,0.75)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 13px Orbitron';
  pts.forEach((p, i) => {
    ctx.fillStyle = p.col;
    ctx.fillText('→  ' + p.text, 618, 130 + i * 52);
  });

  // Left edge accent bar
  const edge = ctx.createLinearGradient(0, 100, 0, 325);
  edge.addColorStop(0, `${AC}00`);
  edge.addColorStop(0.5, `${AC}77`);
  edge.addColorStop(1, `${AC}00`);
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 325); ctx.stroke();

  drawDivider(ctx, 338, `${AC}18`);

  // 3 stat pills
  const pills = [
    { value: '$26B FDV', label: 'ALLEGED PUMP TARGET' },
    { value: 'TOP 20',   label: 'MARKET CAP RANK HIT' },
    { value: '$10,000',  label: 'WHISTLEBLOWER BOUNTY' },
  ];
  const pw = (W - 104 - 32) / 3;
  let px = 52;
  pills.forEach(p => {
    ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 354, pw, 72, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = AC; ctx.shadowBlur = 3;
    ctx.fillStyle = AC; ctx.font = 'bold 20px Orbitron';
    ctx.fillText(p.value, px + pw / 2, 354 + 26);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(p.label, px + pw / 2, 354 + 54);
    px += pw + 16;
  });

  // Closing line
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText("If a token hits $26B with no news, someone already knew.", 52, 470);

  drawBottomBar(ctx, AC, 'Source: @zachxbt · April 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-rave-manipulation.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: rave-manipulation');
}
