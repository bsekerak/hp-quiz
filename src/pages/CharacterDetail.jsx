import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { characters } from '../data/characters';
import { houses } from '../data/houses';

export default function CharacterDetail() {
  const { id } = useParams();
  const key = id.charAt(0).toUpperCase() + id.slice(1);
  const character = characters[key];

  useEffect(() => {
    if (character) {
      document.title = `${character.name} — ${character.mbti} ${character.mbtiTitle} | Wizarding World Quiz`;
      document.querySelector('meta[name="description"]')?.setAttribute('content',
        `${character.name} is ${character.mbti} — ${character.mbtiTitle}. ${character.description}`);
    }
  }, [character]);

  if (!character) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h1 className="page-title">Character not found</h1>
        <Link to="/characters" className="btn-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
          Back to Characters
        </Link>
      </div>
    );
  }

  const houseId = character.house.toLowerCase();
  const house = houses[houseId];

  return (
    <div>
      {/* Hero banner */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${character.houseColor}55 0%, rgba(10,10,26,0.97) 100%)`,
          padding: '80px 24px 60px',
          textAlign: 'center',
          borderBottom: `1px solid ${character.accentColor}30`,
        }}
      >
        {/* Emoji circle */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: character.houseColor,
            border: '3px solid #D4AF37',
            boxShadow: `0 0 30px rgba(212,175,55,0.5), 0 0 60px ${character.houseColor}88`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            margin: '0 auto 24px',
            animation: 'scaleIn 500ms ease both',
          }}
        >
          {character.emoji}
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#F5E6C8',
            margin: '0 0 16px',
            lineHeight: 1.2,
            textShadow: '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.15)',
          }}
        >
          {character.name}
        </h1>

        <div style={{ marginBottom: '16px' }}>
          <span
            className="pill"
            style={{ background: character.houseColor, color: '#fff', fontSize: '14px' }}
          >
            {character.house}
          </span>
          <span
            className="pill"
            style={{ background: '#2A2A2A', color: '#C0C0C0', fontSize: '14px' }}
          >
            {character.mbti} — {character.mbtiTitle}
          </span>
        </div>

        <div className="ornamental-divider">✦ ✦ ✦</div>
      </div>

      {/* Content card */}
      <div
        className="glass-card"
        style={{
          maxWidth: '800px',
          margin: '40px auto 60px',
          padding: '48px',
        }}
      >
        {/* Who Are They */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-heading">Who Are They?</h2>
          <p
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: '18px',
              color: '#F5E6C8',
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {character.description}
          </p>
        </section>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', margin: '0 0 40px' }} />

        {/* Personality Traits */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-heading">Personality Traits</h2>
          <div>
            {character.traits.map(trait => (
              <span
                key={trait}
                className="pill"
                style={{
                  border: `1px solid ${character.accentColor}`,
                  background: 'rgba(28,18,8,0.6)',
                  color: '#F5E6C8',
                  fontSize: '15px',
                  padding: '8px 20px',
                  borderRadius: '24px',
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </section>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', margin: '0 0 40px' }} />

        {/* MBTI Profile */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-heading">MBTI Profile</h2>
          <p
            style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              color: '#D4AF37',
              margin: '0 0 4px',
            }}
          >
            {character.mbti}
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '18px',
              color: '#C0C0C0',
              margin: '0 0 16px',
              fontStyle: 'italic',
            }}
          >
            {character.mbtiTitle}
          </p>
          <p
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: '17px',
              color: 'rgba(245,230,200,0.85)',
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {character.mbtiDescription}
          </p>
        </section>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', margin: '0 0 40px' }} />

        {/* Their House */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-heading">Their House</h2>
          <p
            style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: '1.2rem',
              color: character.accentColor,
              margin: '0 0 12px',
            }}
          >
            {house?.emoji} {character.house}
          </p>
          {house && (
            <p
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: '17px',
                color: 'rgba(245,230,200,0.8)',
                lineHeight: 1.7,
                margin: '0 0 16px',
                fontStyle: 'italic',
              }}
            >
              "{house.motto}"
            </p>
          )}
          <Link
            to={`/houses/${houseId}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '16px',
              color: '#D4AF37',
              textDecoration: 'none',
              opacity: 0.8,
              transition: 'opacity 200ms ease',
            }}
          >
            Learn about {character.house} →
          </Link>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn-gold">
            Find out if you're like {character.name.split(' ')[0]} →
          </Link>
        </div>
      </div>
    </div>
  );
}
