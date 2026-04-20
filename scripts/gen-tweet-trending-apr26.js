const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '../public/Orbitron-Bold.ttf');
registerFont(fontPath, { family: 'Orbitron', weight: 'bold' });

const W = 1200, H = 675;

// ── V2 style tokens ────────────────────────────────────────────────────────
const BG         = '#050507';
const DIM        = 'rgba(204,255,0,0.55)';
const DIMMER     = 'rgba(204,255,0,0.38)';
const GRID_A     = 0.055;

// ── Shared helpers (same as gen-tweet-v2.js) ──────────────────────────────
function drawBackground(ctx, glow1, glow2, gridColor) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  const gc = gridColor || `rgba(204,255,0,${GRID_A})`;
  ctx.strokeStyle = gc;
  ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 600);
  g1.addColorStop(0, glow1); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g2.addColorStop(0, glow2); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

function drawLogo(ctx) {
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(204,255,0,0.6)'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
}

function drawBadge(ctx, text, color) {
  ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24;
  const bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = color + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = color + '0e'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = color;
  ctx.fillText(text, W - 52, by + 12);
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

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 1 — Phishing Surge
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(255,140,0,0.06)', 'rgba(200,80,0,0.04)');
  drawNeonLine(ctx, 3, 'rgba(255,160,0,0.7)');
  drawLogo(ctx);
  drawBadge(ctx, '⚠ THREAT REPORT · APRIL 2026', '#ff9900');
  drawDivider(ctx, 90, 'rgba(255,140,0,0.14)');

  // Big number
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ff9900'; ctx.shadowBlur = 14;
  ctx.fillStyle = '#ff9900'; ctx.font = 'bold 110px Orbitron';
  ctx.fillText('+1,400%', 52, 185);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('increase in phishing losses — Q1 2026', 52, 258);
  ctx.fillStyle = 'rgba(255,180,60,0.80)'; ctx.font = 'bold 16px Orbitron';
  ctx.fillText('$311M drained in January alone. No code exploited.', 52, 292);

  // Vertical divider
  ctx.strokeStyle = 'rgba(255,140,0,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(580, 108); ctx.lineTo(580, 345); ctx.stroke();

  // Bullets right side
  const bullets = [
    { icon: '🎣', text: 'Social engineering now #1 attack vector',  color: 'rgba(255,255,255,0.80)' },
    { icon: '🤖', text: 'AI deepfakes used in 1 in 4 attacks',       color: 'rgba(255,180,60,0.90)' },
    { icon: '🔗', text: '5,000+ malicious drainer addresses active', color: 'rgba(255,100,60,0.90)' },
  ];
  ctx.textAlign = 'left'; ctx.font = 'bold 14px Orbitron';
  bullets.forEach((b, i) => {
    ctx.fillStyle = b.color;
    ctx.fillText(b.icon + '  ' + b.text, 612, 152 + i * 72);
  });

  // Left edge accent
  const edge = ctx.createLinearGradient(0, 100, 0, 350);
  edge.addColorStop(0, 'rgba(255,140,0,0)');
  edge.addColorStop(0.5, 'rgba(255,140,0,0.5)');
  edge.addColorStop(1, 'rgba(255,140,0,0)');
  ctx.strokeStyle = edge; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(8, 100); ctx.lineTo(8, 350); ctx.stroke();

  drawDivider(ctx, 368, 'rgba(255,140,0,0.10)');

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("They don't need a bug. They just need you to click.", 52, 420);
  ctx.fillStyle = 'rgba(255,180,60,0.55)'; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Verify every link. Trust no DM. Check REKTgistry before you connect.', 52, 450);

  drawBottomBar(ctx, '#ff9900', 'Source: CertiK · Hacken · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(255,160,0,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-phishing-surge.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: phishing-surge');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 2 — Wallet Poisoning / Zero-Value Transfers
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(140,60,255,0.06)', 'rgba(80,0,200,0.04)', `rgba(140,60,255,${GRID_A})`);
  drawNeonLine(ctx, 3, 'rgba(160,80,255,0.7)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ ATTACK VECTOR ALERT', '#a855f7');
  drawDivider(ctx, 90, 'rgba(160,80,255,0.14)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#a855f7'; ctx.font = 'bold 100px Orbitron';
  ctx.fillText('100M+', 52, 178);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('zero-value transfer attempts on BSC alone', 52, 252);
  ctx.fillStyle = 'rgba(180,120,255,0.80)'; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('Wallet poisoning: a $0 transaction that costs you everything', 52, 283);

  // How it works — 3 step pills
  const steps = [
    { num: '01', title: 'Attacker sends $0', sub: 'to your wallet from a fake address' },
    { num: '02', title: 'You copy history',  sub: 'and grab the top address to reuse' },
    { num: '03', title: 'You send funds',    sub: 'to the poisoned address. Gone.' },
  ];
  const pw = (W - 104 - 32) / 3;
  let px = 52;
  steps.forEach(s => {
    ctx.fillStyle = 'rgba(168,85,247,0.07)';
    ctx.strokeStyle = 'rgba(168,85,247,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 320, pw, 86, 10); ctx.fill(); ctx.stroke();

    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 4;
    ctx.fillStyle = '#a855f7'; ctx.font = 'bold 22px Orbitron';
    ctx.fillText(s.num, px + 16, 320 + 26);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 13px Orbitron';
    ctx.fillText(s.title, px + 16, 320 + 52);
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.sub, px + 16, 320 + 70);
    px += pw + 16;
  });

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText('Always verify every character of an address. Every. Single. Time.', 52, 450);

  drawBottomBar(ctx, '#a855f7', 'Source: Safe Labs · Binance Security · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(160,80,255,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-wallet-poison.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: wallet-poison');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 3 — AI Deepfake Crypto Scams
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  drawBackground(ctx, 'rgba(0,200,255,0.05)', 'rgba(0,80,180,0.04)', `rgba(0,180,255,${GRID_A})`);
  drawNeonLine(ctx, 3, 'rgba(0,200,255,0.7)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ NEW THREAT VECTOR · 2026', '#00c8ff');
  drawDivider(ctx, 90, 'rgba(0,200,255,0.14)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';

  // Big headline
  ctx.shadowColor = '#00c8ff'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#00c8ff'; ctx.font = 'bold 80px Orbitron';
  ctx.fillText('AI DEEPFAKE', W / 2, 162);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 44px Orbitron';
  ctx.fillText('SCAMS', W / 2, 225);

  ctx.fillStyle = 'rgba(0,200,255,0.75)'; ctx.font = 'bold 17px Orbitron';
  ctx.fillText('The celebrity endorsing that token? Generated.', W / 2, 272);
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = 'bold 14px Orbitron';
  ctx.fillText('Fraudsters use video + audio AI to impersonate founders, influencers & exchanges', W / 2, 298);

  drawDivider(ctx, 326, 'rgba(0,200,255,0.10)');

  // 4 stat pills
  const stats = [
    { value: '1 in 4',  label: 'ATTACKS USE DEEPFAKE' },
    { value: '5,000+',  label: 'DRAINER ADDRESSES' },
    { value: '$311M',   label: 'JAN 2026 ALONE' },
    { value: '↑1,400%', label: 'PHISHING SURGE' },
  ];
  const pw = (W - 104 - 48) / 4;
  let px = 52;
  stats.forEach(s => {
    ctx.fillStyle = 'rgba(0,200,255,0.07)';
    ctx.strokeStyle = 'rgba(0,200,255,0.20)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 344, pw, 76, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = '#00c8ff'; ctx.shadowBlur = 4;
    ctx.fillStyle = '#00c8ff'; ctx.font = 'bold 22px Orbitron';
    ctx.fillText(s.value, px + pw / 2, 344 + 28);
    ctx.shadowBlur = 0;
    ctx.fillStyle = DIM; ctx.font = 'bold 9px Orbitron';
    ctx.fillText(s.label, px + pw / 2, 344 + 56);
    px += pw + 16;
  });

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("If it sounds too good — it was probably generated.", W / 2, 462);

  drawBottomBar(ctx, '#00c8ff', 'Source: GamblingBitcoin · CertiK · April 2026');
  drawNeonLine(ctx, H - 2, 'rgba(0,200,255,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-ai-deepfake.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: ai-deepfake');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 4 — $282M Social Engineering (Phone Call Hack)
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  ctx.fillStyle = '#040304'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(239,68,68,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const g1 = ctx.createRadialGradient(0, H, 0, 0, H, 700);
  g1.addColorStop(0, 'rgba(120,0,0,0.09)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, 'rgba(239,68,68,0.75)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ SOCIAL ENGINEERING · JAN 2026', '#ef4444');
  drawDivider(ctx, 90, 'rgba(239,68,68,0.12)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(239,68,68,0.55)'; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('NO CODE EXPLOITED. NO CONTRACT HACKED.', 52, 118);

  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 120px Orbitron';
  ctx.fillText('$282M', 52, 205);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 22px Orbitron';
  ctx.fillText('stolen. With a single phone call.', 52, 278);
  ctx.fillStyle = 'rgba(255,100,100,0.70)'; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('Attacker posed as IT support · victim revealed hardware wallet seed phrase', 52, 310);

  // Timeline — 3 steps
  const steps = [
    { label: 'FAKE IT SUPPORT CALL',    desc: 'posed as exchange security team' },
    { label: 'SOCIAL ENGINEERING',      desc: 'convinced victim to "verify" seed' },
    { label: '$282M DRAINED',           desc: 'in minutes. no exploit needed.' },
  ];
  const spw = (W - 104 - 32) / 3;
  let spx = 52;
  steps.forEach((s, i) => {
    ctx.fillStyle = 'rgba(239,68,68,0.06)';
    ctx.strokeStyle = 'rgba(239,68,68,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(spx, 348, spw, 80, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 3;
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 11px Orbitron';
    ctx.fillText('STEP ' + (i + 1), spx + spw/2, 348 + 22);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 12px Orbitron';
    ctx.fillText(s.label, spx + spw/2, 348 + 46);
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.desc, spx + spw/2, 348 + 68);
    spx += spw + 16;
  });

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 16px Orbitron';
  ctx.fillText("The most hackable thing in crypto is still you.", 52, 470);

  drawBottomBar(ctx, '#ef4444', 'Source: CoinDesk · January 2026');
  drawNeonLine(ctx, H - 2, 'rgba(239,68,68,0.65)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-social-eng.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: social-eng');
}
