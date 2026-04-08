'use client';
import { useEffect, useState, useRef } from 'react';

const LINE1 = "Know who you're working with.";
const LINE2 = "Before it's too late.";

function playTypeClick(ctx: AudioContext) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8) * 0.18;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

export default function TypewriterTitle() {
  const [displayed1, setDisplayed1] = useState('');
  const [displayed2, setDisplayed2] = useState('');
  const [phase, setPhase] = useState<'line1' | 'line2' | 'done'>('line1');
  const [showCursor, setShowCursor] = useState(true);
  const audioCtx = useRef<AudioContext | null>(null);
  const started = useRef(false);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Typewriter engine
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let i = 0;
    const typeNext = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      playTypeClick(audioCtx.current);

      if (phase === 'line1') {
        i++;
        setDisplayed1(LINE1.slice(0, i));
        if (i < LINE1.length) {
          setTimeout(typeNext, 38 + Math.random() * 30);
        } else {
          setTimeout(() => {
            setPhase('line2');
            i = 0;
            setTimeout(typeNextLine2, 200);
          }, 300);
        }
      }
    };

    const typeNextLine2 = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      playTypeClick(audioCtx.current);
      setDisplayed2(prev => {
        const next = LINE2.slice(0, prev.length + 1);
        if (next.length >= LINE2.length) {
          setTimeout(() => setPhase('done'), 400);
        } else {
          setTimeout(typeNextLine2, 42 + Math.random() * 28);
        }
        return next;
      });
    };

    setTimeout(typeNext, 600);
  }, []);

  return (
    <h1 style={{
      fontFamily: 'Orbitron, sans-serif',
      fontSize: 'clamp(26px, 5vw, 50px)',
      fontWeight: 900,
      color: '#e2e8f0',
      lineHeight: 1.15,
      marginBottom: '12px',
      minHeight: '2.4em',
    }}>
      <span>{displayed1}</span>
      {phase === 'line1' && (
        <span style={{ color: '#ccff00', opacity: showCursor ? 1 : 0 }}>|</span>
      )}
      {(phase === 'line2' || phase === 'done') && (
        <>
          {' '}
          <span style={{ color: '#ccff00' }}>
            {displayed2}
            {phase === 'line2' && (
              <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
            )}
          </span>
        </>
      )}
    </h1>
  );
}
