import { useMemo, useState, useEffect } from 'react';

export default function Intro({ onStart }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const isTwinkle = i % 3 === 0;
      const isDepth = i >= 36;
      return {
        id: i,
        left: Math.random() * 100,
        size: isDepth ? 8 + Math.random() * 4 : 2 + Math.random() * 5,
        duration: isDepth ? 12 + Math.random() * 8 : 8 + Math.random() * 12,
        delay: Math.random() * 15,
        isTwinkle,
        isDepth,
        top: isDepth ? `${10 + Math.random() * 80}%` : undefined,
      };
    });
  }, []);

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      position: 'relative',
    }}>

      {/* ── Left panel ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '80px 32px 60px' : '100px 60px 60px 80px',
        background: 'linear-gradient(135deg, rgba(5,4,15,0.98) 0%, rgba(10,8,30,0.95) 100%)',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}>

        {/* Radial glow behind content */}
        <div style={{
          position: 'absolute',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Particles — clipped to left panel */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          {particles.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.left}%`,
                bottom: p.isDepth ? undefined : 0,
                top: p.isDepth ? p.top : undefined,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                background: '#D4AF37',
                opacity: p.isDepth ? 0.25 : undefined,
                animation: p.isTwinkle
                  ? `twinkle ${3 + Math.random() * 3}s ${p.delay}s infinite ease-in-out`
                  : `floatParticle ${p.duration}s ${p.delay}s infinite ease-in`,
              }}
            />
          ))}
        </div>

        {/* Text content — left-aligned, no card box */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '480px', width: '100%' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '11px', letterSpacing: '4px',
            color: '#D4AF37', opacity: 0.8,
            textTransform: 'uppercase', marginBottom: '24px',
          }}>
            ✦ A Personality Quiz ✦
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: isMobile ? '1.8rem' : '2.6rem',
            color: '#F5E6C8', lineHeight: 1.15, marginBottom: '20px',
            textShadow: '0 0 40px rgba(212,175,55,0.15)',
          }}>
            Which Harry Potter Character Are You?
          </h1>

          {/* Divider — left-aligned */}
          <div style={{
            width: '80px', height: '1px',
            background: 'linear-gradient(90deg, #D4AF37, transparent)',
            marginBottom: '20px',
          }} />

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: '1.05rem', color: 'rgba(245,230,200,0.75)',
            lineHeight: 1.7, marginBottom: '0', maxWidth: '380px',
          }}>
            Answer 12 questions to reveal your true wizarding identity
          </p>

          {/* Button — auto width, left-aligned */}
          <button
            onClick={onStart}
            style={{
              background: 'linear-gradient(135deg, #C9A227, #D4AF37)',
              color: '#0A0A1A',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '13px', letterSpacing: '2px',
              padding: '14px 40px', border: 'none',
              borderRadius: '6px', cursor: 'pointer',
              textTransform: 'uppercase',
              animation: 'buttonPulse 2s ease-in-out infinite',
              display: 'inline-block', marginTop: '32px',
            }}
          >
            Begin Your Journey
          </button>
        </div>
      </div>

      {/* ── Right panel — atmospheric image ── */}
      {!isMobile && (
        <div style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=1200&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}>
          {/* Left-edge fade into left panel */}
          <div style={{
            content: '',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(5,4,15,1) 0%, rgba(5,4,15,0.4) 30%, transparent 70%)',
          }} />
        </div>
      )}
    </div>
  );
}
