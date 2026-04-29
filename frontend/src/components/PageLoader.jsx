import { useState, useEffect } from 'react';

export default function PageLoader({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 900);
    const doneTimer = setTimeout(() => onDone?.(), 1500);
    return () => [fadeTimer, doneTimer].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#FCFCFA',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: fading ? 'none' : 'auto',
    }}>

      <p style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2.5rem',
        fontWeight: 400,
        color: '#050505',
        letterSpacing: '0.06em',
        lineHeight: 1,
        userSelect: 'none',
      }}>Kenia</p>

      {/* Thin animated underline */}
      <div style={{ width: '48px', height: '1px', background: 'rgba(5,5,5,0.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#B68D40', animation: 'kLoad 0.9s ease forwards' }} />
      </div>

      <style>{`@keyframes kLoad { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }`}</style>
    </div>
  );
}
