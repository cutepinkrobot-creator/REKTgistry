export default function AuthErrorPage() {
  const orbitron = { fontFamily: 'Orbitron, sans-serif' };
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ paddingTop: '72px' }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
        style={{ backgroundColor: 'rgba(204,0,0,0.1)', border: '2px solid rgba(204,0,0,0.3)' }}
      >
        ✕
      </div>
      <div
        className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-3 py-1 rounded mb-4"
        style={{ ...orbitron, backgroundColor: 'rgba(204,0,0,0.08)', color: '#ff6b6b', border: '1px solid rgba(204,0,0,0.25)' }}
      >
        AUTH ERROR
      </div>
      <h1
        className="text-3xl font-black mb-3"
        style={{ ...orbitron, color: 'var(--text-primary)' }}
      >
        Auth Failed
      </h1>
      <p className="text-base mb-2" style={{ ...orbitron, color: 'var(--text-secondary)', maxWidth: 400 }}>
        Something went wrong with sign in. The link may have expired.
      </p>
      <p className="text-sm mb-10 italic" style={{ ...orbitron, color: 'rgba(255,255,255,0.25)' }}>
        Even magic links have a half-life.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
          style={{ ...orbitron, backgroundColor: 'rgba(204,255,0,0.09)', border: '1.5px solid rgba(204,255,0,0.3)', color: '#ccff00', textDecoration: 'none' }}
        >
          Try Again
        </a>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
          style={{ ...orbitron, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none' }}
        >
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
