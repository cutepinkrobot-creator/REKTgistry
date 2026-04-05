export default function CloudBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated gradient blobs */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60vw', height: '60vw',
            top: '-20%', left: '-10%',
            background: 'radial-gradient(circle, rgba(74,126,255,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'fly-a 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '50vw', height: '50vw',
            top: '30%', right: '-15%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
            filter: 'blur(48px)',
            animation: 'fly-b 29s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '40vw', height: '40vw',
            bottom: '-10%', left: '30%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
            filter: 'blur(32px)',
            animation: 'fly-c 17s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '35vw', height: '35vw',
            top: '60%', left: '10%',
            background: 'radial-gradient(circle, rgba(74,126,255,0.04) 0%, transparent 70%)',
            filter: 'blur(24px)',
            animation: 'fly-a 35s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '45vw', height: '45vw',
            top: '10%', left: '40%',
            background: 'radial-gradient(circle, rgba(204,255,0,0.02) 0%, transparent 70%)',
            filter: 'blur(36px)',
            animation: 'fly-b 19s ease-in-out infinite',
          }}
        />
      </div>
      {/* Vignette */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,12,16,0.75) 100%)' }}
      />
    </>
  );
}
