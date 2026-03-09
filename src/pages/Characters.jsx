import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { characters } from '../data/characters';

export default function Characters() {
  const characterList = Object.entries(characters);

  useEffect(() => {
    document.title = 'Harry Potter Characters — Personality & MBTI Types | Wizarding World Quiz';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Explore personality profiles and MBTI types for 10 iconic Harry Potter characters including Harry Potter, Hermione Granger, Severus Snape, Luna Lovegood and more.');
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <h1 className="page-title">The Characters of Hogwarts</h1>
        <p className="page-subtitle">
          Ten of the most iconic witches and wizards — discover who you truly are
        </p>
        <div className="gold-divider" />
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px',
        }}
      >
        {characterList.map(([key, character]) => {
          const firstSentence = character.description.split('.')[0] + '.';
          return (
            <Link
              key={key}
              to={`/characters/${key.toLowerCase()}`}
              className="character-card"
            >
              {/* Emoji circle */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: character.houseColor,
                  border: '2px solid #D4AF37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${character.houseColor}80`,
                }}
              >
                {character.emoji}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'Cinzel Decorative', cursive",
                    fontSize: '17px',
                    color: '#F5E6C8',
                    margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}
                >
                  {character.name}
                </p>

                {/* Badges */}
                <div style={{ marginBottom: '8px' }}>
                  <span
                    className="pill"
                    style={{
                      background: character.houseColor,
                      color: '#fff',
                      fontSize: '11px',
                      padding: '2px 10px',
                    }}
                  >
                    {character.house}
                  </span>
                  <span
                    className="pill"
                    style={{
                      background: 'rgba(42,42,42,0.8)',
                      color: '#C0C0C0',
                      fontSize: '11px',
                      padding: '2px 10px',
                    }}
                  >
                    {character.mbti}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: '15px',
                    color: 'rgba(245,230,200,0.6)',
                    lineHeight: 1.6,
                    margin: '0 0 10px',
                  }}
                >
                  {firstSentence}
                </p>

                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '14px',
                    color: '#D4AF37',
                    opacity: 0.7,
                  }}
                >
                  Read more →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
