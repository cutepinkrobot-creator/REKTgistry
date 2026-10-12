// Generates 5 X/Twitter header banner options (1500x500) in public/
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1500, H = 500, SCALE = 3;
const LIME = '#ccff00';

function newCanvas() {
  const c = createCanvas(W * SCALE, H * SCALE);
  const ctx = c.getContext('2d');
  ctx.scale(SCALE, SCALE);
  return { c, ctx };
}

function save(c, name) {
  const out = path.join(__dirname, '../public', name);
  fs.writeFileSync(out, c.toBuffer('image/png'));
  console.log('wrote', out);
}

function fill(ctx, color) { ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); }

function grid(ctx, color, step = 44) {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (let x = 0; x <= W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
}

// no glow anywhere — crisp text only
function logoAt(ctx, x, y, size = 92) {
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.shadowBlur = 0;
  ctx.fillStyle = LIME; ctx.font = `bold ${size}px Orbitron`;
  ctx.fillText('REKT', x, y);
  const rektW = ctx.measureText('REKT').width;
  ctx.fillStyle = '#e8edf5'; ctx.font = `bold ${size * 0.62}px Orbitron`;
  ctx.fillText('gistry', x + rektW + 10, y);
}

function logoCenter(ctx, y, size = 92) {
  ctx.font = `bold ${size}px Orbitron`;
  const rektW = ctx.measureText('REKT').width;
  ctx.font = `bold ${size * 0.62}px Orbitron`;
  const gisW = ctx.measureText('gistry').width;
  logoAt(ctx, W / 2 - (rektW + gisW + 10) / 2, y, size);
}

function spacedText(ctx, text, x, y, color, size, spacing) {
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
  ctx.font = `bold ${size}px Orbitron`;
  ctx.fillStyle = color;
  for (const ch of text.split('')) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + spacing;
  }
}

function spacedWidth(ctx, text, size, spacing) {
  ctx.font = `bold ${size}px Orbitron`;
  let total = 0;
  for (const ch of text.split('')) total += ctx.measureText(ch).width + spacing;
  return total - spacing;
}

function tagline(ctx, text, y, color = 'rgba(232,237,245,0.75)', size = 20, spacing = 8) {
  const total = spacedWidth(ctx, text, size, spacing);
  spacedText(ctx, text, W / 2 - total / 2, y, color, size, spacing);
}

function taglineLeft(ctx, text, x, y, color = 'rgba(232,237,245,0.75)', size = 20, spacing = 8) {
  spacedText(ctx, text, x, y, color, size, spacing);
}

// ─── 1. LIQUIDATION — crashing candlestick chart ─────────────────────────────
function banner1() {
  const { c, ctx } = newCanvas();
  fill(ctx, '#050507');
  grid(ctx, 'rgba(255,80,80,0.05)');

  // red glow bottom
  let g = ctx.createRadialGradient(W * 0.75, H, 0, W * 0.75, H, 700);
  g.addColorStop(0, 'rgba(255,60,60,0.13)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // candlestick crash on the RIGHT half — rise then dump, text stays clear on the left
  const candles = [
    [850, 210, 45, 55, 1], [895, 195, 50, 40, 1], [940, 175, 55, 50, 1], [985, 160, 40, 50, 1],
    [1030, 150, 50, 45, 0], [1075, 165, 45, 40, 1], [1120, 145, 55, 55, 1],
    [1165, 140, 70, 50, 0], [1210, 185, 75, 45, 0], [1255, 235, 90, 55, 0],
    [1300, 300, 95, 60, 0], [1345, 370, 70, 45, 0], [1390, 415, 50, 45, 0],
    [1435, 445, 35, 30, 0],
  ];
  for (const [x, top, body, wick, up] of candles) {
    const col = up ? 'rgba(74,222,128,0.65)' : 'rgba(255,80,80,0.7)';
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 12, top - wick / 2); ctx.lineTo(x + 12, top + body + wick / 2); ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(x, top, 24, body);
  }
  // "LIQUIDATED" stamp over the dump zone, below the chart peak
  ctx.save();
  ctx.translate(1130, 415); ctx.rotate(-0.07);
  ctx.font = 'bold 34px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(255,80,80,0.45)'; ctx.lineWidth = 3;
  ctx.strokeRect(-190, -32, 380, 64);
  ctx.fillStyle = 'rgba(255,80,80,0.45)';
  ctx.fillText('LIQUIDATED', 0, 2);
  ctx.restore();

  // text block — left side, fully clear of the chart
  logoAt(ctx, 70, 240, 88);
  taglineLeft(ctx, 'EVERY RUG. EVERY RECEIPT.', 70, 300, 'rgba(232,237,245,0.85)', 17, 5);
  taglineLeft(ctx, 'FOREVER.', 70, 340, 'rgba(255,80,80,0.8)', 17, 5);
  taglineLeft(ctx, 'REKTGISTRY.COM', 70, 420, 'rgba(204,255,0,0.7)', 14, 5);
  save(c, 'banner-liquidation.png');
}

// ─── 2. TERMINAL — hacker scan log ───────────────────────────────────────────
function banner2() {
  const { c, ctx } = newCanvas();
  fill(ctx, '#04060a');
  grid(ctx, 'rgba(57,255,20,0.04)', 36);

  let g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 900);
  g.addColorStop(0, 'rgba(57,255,20,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // terminal lines left + right
  const lines = [
    '> scanning wallet 0x7f3...a92',
    '> honeypot check ......... FAIL',
    '> dev wallet dumped ...... 100%',
    '> liquidity pulled ....... $4.2M',
    '> VERDICT: RUG CONFIRMED',
    '> adding to registry_',
  ];
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = 'bold 17px Orbitron';
  lines.forEach((ln, i) => {
    const alert = ln.includes('VERDICT');
    ctx.fillStyle = alert ? 'rgba(255,80,80,0.85)' : 'rgba(57,255,20,0.4)';
    ctx.fillText(ln, 60, 110 + i * 52);
  });
  // right side mirrored dimmer
  ctx.textAlign = 'right';
  const lines2 = ['block 21984312', 'block 21984313', 'block 21984314', 'block 21984315', 'block 21984316', 'block 21984317'];
  lines2.forEach((ln, i) => {
    ctx.fillStyle = 'rgba(57,255,20,0.18)';
    ctx.fillText(ln, W - 60, 110 + i * 52);
  });

  // scanline effect
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, y, W, 1);
  }

  logoCenter(ctx, 250);
  tagline(ctx, 'DON’T TRUST. VERIFY. THEN VERIFY AGAIN.', 310);
  tagline(ctx, 'REKTGISTRY.COM', 445, 'rgba(57,255,20,0.55)', 15, 6);
  save(c, 'banner-terminal.png');
}

// ─── 3. CAUTION — hazard tape / crime scene ─────────────────────────────────
function banner3() {
  const { c, ctx } = newCanvas();
  fill(ctx, '#070604');
  grid(ctx, 'rgba(251,191,36,0.05)');

  let g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 850);
  g.addColorStop(0, 'rgba(251,191,36,0.07)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // hazard stripes top and bottom
  function tape(y, rot) {
    ctx.save();
    ctx.translate(W / 2, y); ctx.rotate(rot);
    ctx.fillStyle = 'rgba(251,191,36,0.9)';
    ctx.fillRect(-W, -22, W * 2, 44);
    ctx.fillStyle = '#0a0a0a';
    for (let x = -W; x < W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 22); ctx.lineTo(x + 30, -22); ctx.lineTo(x + 52, -22); ctx.lineTo(x + 22, 22);
      ctx.closePath(); ctx.fill();
    }
    ctx.font = 'bold 15px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.restore();
  }
  tape(46, -0.025);
  tape(H - 46, 0.025);

  // "CRIME SCENE" text on tape
  ctx.save();
  ctx.translate(W / 2, 46); ctx.rotate(-0.025);
  ctx.restore();

  // stamp
  ctx.save();
  ctx.translate(W * 0.83, H * 0.5); ctx.rotate(0.12);
  ctx.font = 'bold 34px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(255,80,80,0.4)'; ctx.lineWidth = 3;
  ctx.strokeRect(-150, -34, 300, 68);
  ctx.fillStyle = 'rgba(255,80,80,0.38)';
  ctx.fillText('EXPOSED', 0, 2);
  ctx.restore();
  ctx.save();
  ctx.translate(W * 0.16, H * 0.52); ctx.rotate(-0.1);
  ctx.font = 'bold 30px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(251,191,36,0.4)'; ctx.lineWidth = 3;
  ctx.strokeRect(-140, -30, 280, 60);
  ctx.fillStyle = 'rgba(251,191,36,0.4)';
  ctx.fillText('ON CHAIN', 0, 2);
  ctx.restore();

  logoCenter(ctx, 255);
  tagline(ctx, 'SCAM SCENE — DO NOT CROSS', 315, 'rgba(251,191,36,0.8)');
  save(c, 'banner-caution.png');
}

// ─── 4. SYNTHWAVE — neon horizon grid ───────────────────────────────────────
function banner4() {
  const { c, ctx } = newCanvas();
  // vertical gradient sky
  let sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0a0416'); sky.addColorStop(0.55, '#12082a'); sky.addColorStop(1, '#050507');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  const horizon = H * 0.62;
  const sunX = W * 0.76; // sun on the right so text on the left stays clear

  // sun — draw slat gaps by clipping to the sun circle so nothing outside is touched
  let sun = ctx.createLinearGradient(0, horizon - 170, 0, horizon);
  sun.addColorStop(0, 'rgba(255,80,120,0.85)'); sun.addColorStop(1, 'rgba(255,180,60,0.55)');
  ctx.save();
  ctx.beginPath(); ctx.arc(sunX, horizon, 165, Math.PI, 0); ctx.closePath();
  ctx.clip();
  ctx.fillStyle = sun;
  ctx.fillRect(sunX - 165, horizon - 165, 330, 165);
  // slat gaps: repaint sky color strips inside the clipped circle
  ctx.fillStyle = '#0f0722';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(sunX - 165, horizon - 20 - i * 26, 330, 5 + i * 1.5);
  }
  ctx.restore();

  // perspective grid floor
  ctx.strokeStyle = 'rgba(204,255,0,0.35)'; ctx.lineWidth = 1.5;
  for (let i = -14; i <= 14; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * 60, horizon);
    ctx.lineTo(W / 2 + i * 260, H);
    ctx.stroke();
  }
  const rows = [0, 8, 20, 38, 62, 95, 140, 190];
  for (const r of rows) {
    ctx.beginPath(); ctx.moveTo(0, horizon + r); ctx.lineTo(W, horizon + r); ctx.stroke();
  }
  // horizon line — crisp, no glow
  let hg = ctx.createLinearGradient(0, 0, W, 0);
  hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(0.5, LIME); hg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = hg; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(W, horizon); ctx.stroke();

  // text block — left side sky, clear of the sun
  logoAt(ctx, 70, 195, 88);
  taglineLeft(ctx, 'RIDE INTO THE RUGSET', 70, 250, 'rgba(255,140,180,0.9)', 18, 6);
  taglineLeft(ctx, 'THE PERMANENT RECORD OF WEB3', 70, 290, 'rgba(232,237,245,0.65)', 13, 5);
  // url on the grid floor gets a dark chip so it stays readable
  const urlW = spacedWidth(ctx, 'REKTGISTRY.COM', 14, 5);
  ctx.fillStyle = 'rgba(6,3,14,0.92)';
  ctx.fillRect(58, 420, urlW + 26, 40);
  taglineLeft(ctx, 'REKTGISTRY.COM', 71, 440, 'rgba(204,255,0,0.8)', 14, 5);
  save(c, 'banner-synthwave.png');
}

// ─── 5. TICKER WALL — hack headlines ────────────────────────────────────────
function banner5() {
  const { c, ctx } = newCanvas();
  fill(ctx, '#050507');
  grid(ctx, 'rgba(204,255,0,0.045)');

  let g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 900);
  g.addColorStop(0, 'rgba(204,255,0,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const rows = [
    ['$625M', 'RONIN BRIDGE', '$611M', 'POLY NETWORK', '$570M', 'BNB BRIDGE', '$540M'],
    ['FTX -$8B', 'CELSIUS -$4.7B', 'TERRA -$40B', '3AC REKT', 'MTGOX', 'QUADRIGA'],
    ['$1.5B BYBIT', '$320M WORMHOLE', '$200M EULER', '$190M NOMAD', '$130M CREAM'],
    ['RUG', 'HONEYPOT', 'EXIT SCAM', 'PIG BUTCHER', 'DRAINER', 'PHISH', 'RUG', 'HONEYPOT'],
  ];
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const rowY = [60, 140, 360, 440];
  rows.forEach((words, ri) => {
    ctx.font = 'bold 22px Orbitron';
    let x = ri % 2 === 0 ? 30 : 80;
    for (const w of words) {
      const red = w.includes('$') || w.includes('-');
      ctx.fillStyle = red ? 'rgba(255,80,80,0.28)' : 'rgba(204,255,0,0.18)';
      ctx.fillText(w, x, rowY[ri]);
      x += ctx.measureText(w).width + 60;
      if (x > W) break;
    }
  });
  // separators
  ctx.strokeStyle = 'rgba(204,255,0,0.12)'; ctx.lineWidth = 1;
  for (const y of [100, 180, 320, 400]) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  logoCenter(ctx, 262);
  tagline(ctx, 'WE REMEMBER SO YOU DON’T GET REKT', 320, 'rgba(232,237,245,0.75)', 18);
  save(c, 'banner-ticker.png');
}

banner1();
banner2();
banner3();
banner4();
banner5();
console.log('done');
