import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { houses } from '../data/houses';

export default function Houses() {
  const houseList = Object.entries(houses);

  useEffect(() => {
    document.title = 'The Four Hogwarts Houses — Gryffindor, Slytherin, Ravenclaw, Hufflepuff | Wizarding World Quiz';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Learn about all four Hogwarts houses — Gryffindor, Slytherin, Ravenclaw, and Hufflepuff. Discover their traits, founders, members, and what makes each house unique.');
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <h1 className="page-title">The Four Houses of Hogwarts</h1>
        <p className="page-subtitle">
          Four founders, four values, four paths — which house calls to you?
        </p>
        <div className="gold-divider" />
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '28px',
        }}
      >
        {houseList.map(([id, house]) => (
          <Link
            key={id}
            to={`/houses/${id}`}
            className="house-card"
            style={{
              background: `${house.color}33`,
              border: `1px solid ${house.color}66`,
            }}
          >
            {/* Crest emoji */}
            <div
              style={{
                fontSize: '56px',
                marginBottom: '16px',
                filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.5))',
              }}
            >
              {house.emoji}
            </div>

            {/* House name */}
            <h2
              style={{
                fontFamily: "'Cinzel Decorative', cursive",
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: house.accentColor,
                margin: '0 0 10px',
                letterSpacing: '0.5px',
              }}
            >
              {house.name}
            </h2>

            {/* Motto */}
            <p
              style={{
                fontFamily: "'Crimson Text', serif",
                fontStyle: 'italic',
                fontSize: '16px',
                color: 'rgba(245,230,200,0.7)',
                margin: '0 0 12px',
                lineHeight: 1.5,
              }}
            >
              "{house.motto}"
            </p>

            {/* Founder */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '13px',
                color: 'rgba(245,230,200,0.45)',
                margin: '0 0 16px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Founded by {house.founder}
            </p>

            {/* Trait pills */}
            <div style={{ marginBottom: '20px' }}>
              {house.traits.map(trait => (
                <span
                  key={trait}
                  className="pill"
                  style={{
                    border: `1px solid ${house.accentColor}66`,
                    background: 'rgba(0,0,0,0.3)',
                    color: house.accentColor,
                    fontSize: '12px',
                    padding: '3px 10px',
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* CTA */}
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '15px',
                color: house.accentColor,
                opacity: 0.8,
              }}
            >
              Explore House →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
