export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ paddingTop: '72px' }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
        style={{
          backgroundColor: 'rgba(204,255,0,0.07)',
          border: '1.5px solid rgba(204,255,0,0.2)',
        }}
      >
        ☠️
      </div>

      <div
        className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-3 py-1 rounded mb-4"
        style={{
          backgroundColor: 'rgba(204,255,0,0.07)',
          color: '#ccff00',
          border: '1px solid rgba(204,255,0,0.2)',
          fontFamily: 'Orbitron, sans-serif',
        }}
      >
        404 ERROR
      </div>

      <h1
        className="text-4xl sm:text-5xl font-black mb-3 sw-title"
        style={{ color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}
      >
        This page rug pulled itself.
      </h1>

      <p
        className="text-lg mb-2"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Orbitron, sans-serif' }}
      >
        Wallet not found. Neither is this page.
      </p>

      <p
        className="text-sm mb-10 italic"
        style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Orbitron, sans-serif' }}
      >
        At least we document the ones that do.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
          style={{
            backgroundColor: 'rgba(204,255,0,0.09)',
            border: '1.5px solid rgba(204,255,0,0.3)',
            color: '#ccff00',
            fontFamily: 'Orbitron, sans-serif',
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </a>
        <a
          href="/directory"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontFamily: 'Orbitron, sans-serif',
            textDecoration: 'none',
          }}
        >
          Browse the Registry →
        </a>
      </div>
    </main>
  );
}
