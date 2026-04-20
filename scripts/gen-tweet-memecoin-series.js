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

function drawBg(ctx, glow1, glow2, gridColor) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gridColor || `rgba(204,255,0,${GRID_A})`; ctx.lineWidth = 1;
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
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 4;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 44px Orbitron';
  ctx.fillText('REKT', 52, 52);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#d0d8e8'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('gistry', 54, 74);
}
function drawBadge(ctx, text, AC) {
  ctx.shadowBlur = 0; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.font = 'bold 11px Orbitron';
  const bw = ctx.measureText(text).width + 24, bx = W - 52 - bw, by = 36;
  ctx.strokeStyle = AC + '55'; ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, bw, 24);
  ctx.fillStyle = AC + '0e'; ctx.fillRect(bx, by, bw, 24);
  ctx.fillStyle = AC; ctx.fillText(text, W - 52, by + 12);
}
function drawNeonLine(ctx, y, AC) {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.3, AC);
  g.addColorStop(0.7, AC); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = g; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}
function drawDivider(ctx, y, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(W - 52, y); ctx.stroke();
}
function drawBottomBar(ctx, AC, right) {
  ctx.fillStyle = AC + '0a'; ctx.fillRect(0, H - 70, W, 70);
  ctx.strokeStyle = AC + '22'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.shadowColor = '#ccff00'; ctx.shadowBlur = 3;
  ctx.fillStyle = '#ccff00'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('REKTgistry.com', 52, H - 35);
  ctx.shadowBlur = 0; ctx.textAlign = 'right';
  ctx.fillStyle = DIM; ctx.font = 'bold 13px Orbitron';
  ctx.fillText(right, W - 52, H - 35);
}
function bigOutline(ctx, text, x, y, font, AC) {
  ctx.font = font; ctx.lineJoin = 'round'; ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText(text, x, y);
  ctx.shadowColor = AC; ctx.shadowBlur = 12;
  ctx.fillStyle = AC; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 1 — 5 Red Flags Before a Rug  →  PINK / MAGENTA
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#2dd4bf';  // teal-400

  drawBg(ctx, 'rgba(13,148,136,0.08)', 'rgba(15,118,110,0.04)', `rgba(45,212,191,${GRID_A})`);
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ MEME COIN SURVIVAL GUIDE', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  bigOutline(ctx, '5 RED FLAGS', 52, 148, 'bold 80px Orbitron', AC);
  ctx.fillStyle = 'rgba(255,255,255,0.80)'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('before a meme coin rugs on you', 52, 196);

  drawDivider(ctx, 216, `${AC}18`);

  const flags = [
    { num: '01', text: 'Liquidity is unlocked — devs can pull it any second'  },
    { num: '02', text: 'Top 5 wallets hold 40%+ of supply — one dump = zero'  },
    { num: '03', text: 'Contract not verified or audited — trust nothing'      },
    { num: '04', text: 'Anonymous team, no history, no faces — red flag'       },
    { num: '05', text: 'Promises of guaranteed returns — it\'s always a trap'  },
  ];

  flags.forEach((f, i) => {
    const y = 246 + i * 72;
    // Row bg
    ctx.fillStyle = i % 2 === 0 ? AC + '08' : 'rgba(255,255,255,0.02)';
    ctx.fillRect(52, y - 24, W - 104, 58);

    // Number
    ctx.shadowColor = AC; ctx.shadowBlur = 4;
    ctx.fillStyle = AC; ctx.font = 'bold 18px Orbitron';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(f.num, 72, y + 5);
    ctx.shadowBlur = 0;

    // Flag text
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 14px Orbitron';
    ctx.fillText(f.text, 120, y + 5);
  });

  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 14px Orbitron';
  ctx.fillText('Save this. Check it every time.', 52, H - 88);

  drawBottomBar(ctx, AC, 'REKTgistry.com — search before you ape');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-rug-redflags.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: rug-redflags (pink)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 2 — What is a Honeypot?  →  AMBER
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');
  const AC = '#f59e0b';

  drawBg(ctx, 'rgba(180,100,0,0.08)', 'rgba(120,60,0,0.04)', `rgba(245,158,11,${GRID_A})`);
  drawNeonLine(ctx, 3, `${AC}cc`);
  drawLogo(ctx);
  drawBadge(ctx, '◈ SCAM EXPLAINED · HONEYPOT', AC);
  drawDivider(ctx, 90, `${AC}22`);

  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = `${AC}88`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('YOU CAN BUY. YOU CAN\'T SELL. YOUR FUNDS ARE GONE.', 52, 118);

  bigOutline(ctx, 'HONEYPOT', 52, 205, 'bold 100px Orbitron', AC);

  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 20px Orbitron';
  ctx.fillText('a contract that lets you in but never out', 52, 262);

  drawDivider(ctx, 288, `${AC}18`);

  // 3 step flow
  const steps = [
    { num: '01', title: 'You buy the token',      sub: 'transaction works perfectly, price goes up' },
    { num: '02', title: 'You try to sell',         sub: 'transaction fails — blacklist or sell block' },
    { num: '03', title: 'Dev dumps & disappears',  sub: 'they sell everything, price hits zero' },
  ];
  const pw = (W - 104 - 32) / 3; let px = 52;
  steps.forEach(s => {
    ctx.fillStyle = AC + '0f'; ctx.strokeStyle = AC + '28'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, 306, pw, 96, 10); ctx.fill(); ctx.stroke();
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.shadowColor = AC; ctx.shadowBlur = 4;
    ctx.fillStyle = AC; ctx.font = 'bold 24px Orbitron';
    ctx.fillText(s.num, px + 16, 306 + 26);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = 'bold 13px Orbitron';
    ctx.fillText(s.title, px + 16, 306 + 54);
    ctx.fillStyle = DIM; ctx.font = 'bold 10px Orbitron';
    ctx.fillText(s.sub, px + 16, 306 + 76);
    px += pw + 16;
  });

  // Real example
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = `${AC}bb`; ctx.font = 'bold 13px Orbitron';
  ctx.fillText('Real example this month: $RAVE surged 3,765% then crashed 90%+ — @zachxbt flagged insider manipulation', 52, 442);

  ctx.fillStyle = DIMMER; ctx.font = 'bold 15px Orbitron';
  ctx.fillText('Always run a honeypot check before you buy. No exceptions.', 52, 468);

  drawBottomBar(ctx, AC, 'Source: Hacken · ZachXBT · April 2026');
  drawNeonLine(ctx, H - 2, `${AC}bb`);

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-honeypot.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: honeypot (amber)');
}

// ══════════════════════════════════════════════════════════════════════════
// IMAGE 3 — Anatomy of a Pump & Dump  →  SPLIT GREEN / RED
// ══════════════════════════════════════════════════════════════════════════
{
  const c = createCanvas(W, H); const ctx = c.getContext('2d');

  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(204,255,0,${GRID_A})`; ctx.lineWidth = 1;
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const gL = ctx.createRadialGradient(200, H/2, 0, 200, H/2, 400);
  gL.addColorStop(0, 'rgba(34,197,94,0.07)'); gL.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gL; ctx.fillRect(0, 0, W, H);

  const gR = ctx.createRadialGradient(W - 200, H/2, 0, W - 200, H/2, 400);
  gR.addColorStop(0, 'rgba(239,68,68,0.08)'); gR.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gR; ctx.fillRect(0, 0, W, H);

  drawNeonLine(ctx, 3, 'rgba(204,255,0,0.55)');
  drawLogo(ctx);
  drawBadge(ctx, '◈ PUMP & DUMP — HOW IT WORKS', '#ccff00');
  drawDivider(ctx, 90, 'rgba(204,255,0,0.10)');

  ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = 'bold 28px Orbitron';
  ctx.fillText('ANATOMY OF A PUMP & DUMP', W / 2, 138);

  drawDivider(ctx, 162, 'rgba(255,255,255,0.05)');

  // 3 phase cards
  const phases = [
    {
      phase: 'PHASE 1',
      title: 'THE PUMP',
      color: '#22c55e',
      items: ['Insiders pre-buy at launch', 'Fake hype in Telegram & X', 'Influencers paid to shill', 'FOMO brings retail in'],
    },
    {
      phase: 'PHASE 2',
      title: 'THE TOP',
      color: '#eab308',
      items: ['Price hits ATH fast', 'Volume looks organic', 'Dev wallets fully loaded', 'Countdown has begun'],
    },
    {
      phase: 'PHASE 3',
      title: 'THE DUMP',
      color: '#ef4444',
      items: ['Insiders sell everything', 'Price craters instantly', 'Retail left holding bags', 'Devs vanish, TG goes silent'],
    },
  ];

  const cw = (W - 104 - 32) / 3; let cx2 = 52;
  phases.forEach(p => {
    // Card bg
    ctx.fillStyle = p.color + '0c'; ctx.strokeStyle = p.color + '30'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(cx2, 178, cw, 370, 12); ctx.fill(); ctx.stroke();

    // Phase label
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillStyle = p.color + 'aa'; ctx.font = 'bold 11px Orbitron';
    ctx.fillText(p.phase, cx2 + cw / 2, 178 + 22);

    // Title with outline
    ctx.font = 'bold 28px Orbitron';
    ctx.lineJoin = 'round'; ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.strokeText(p.title, cx2 + cw / 2, 178 + 54);
    ctx.shadowColor = p.color; ctx.shadowBlur = 8;
    ctx.fillStyle = p.color; ctx.fillText(p.title, cx2 + cw / 2, 178 + 54);
    ctx.shadowBlur = 0;

    // Divider
    ctx.strokeStyle = p.color + '25'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx2 + 20, 178 + 76); ctx.lineTo(cx2 + cw - 20, 178 + 76); ctx.stroke();

    // Items
    ctx.textAlign = 'left'; ctx.font = 'bold 12px Orbitron';
    p.items.forEach((item, i) => {
      ctx.fillStyle = i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)';
      ctx.fillText('→  ' + item, cx2 + 18, 178 + 104 + i * 48);
    });

    cx2 += cw + 16;
  });

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = DIMMER; ctx.font = 'bold 14px Orbitron';
  ctx.fillText('You are always Phase 1 entry. They are always Phase 3 exit.', W / 2, H - 88);

  drawBottomBar(ctx, '#ccff00', 'REKTgistry.com — check the project before you ape');
  drawNeonLine(ctx, H - 2, 'rgba(204,255,0,0.55)');

  fs.writeFileSync(path.join(__dirname, '../public/rektgistry-tweet-pump-dump.png'), c.toBuffer('image/png'));
  console.log('✓ Saved: pump-dump (split)');
}
