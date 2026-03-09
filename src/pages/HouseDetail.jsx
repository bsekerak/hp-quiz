import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { houses } from '../data/houses';
import { characters } from '../data/characters';

export default function HouseDetail() {
  const { id } = useParams();
  const house = houses[id];

  useEffect(() => {
    if (house) {
      document.title = `${house.name} — Hogwarts House Guide | Wizarding World Quiz`;
      document.querySelector('meta[name="description"]')?.setAttribute('content',
        `${house.name}: ${house.motto} Learn about ${house.name}'s traits, founder ${house.founder}, notable members, and what it means to be sorted into ${house.name}.`);
    }
  }, [house]);

  if (!house) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h1 className="page-title">House not found</h1>
        <Link to="/houses" className="btn-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
          Back to Houses
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${house.color}99 0%, rgba(10,10,26,0.97) 100%)`,
          padding: '80px 24px 60px',
          textAlign: 'center',
          borderBottom: `1px solid ${house.accentColor}30`,
        }}
      >
        <div
          style={{
            fontSize: '72px',
            marginBottom: '20px',
            animation: 'scaleIn 500ms ease both',
          }}
        >
          {house.emoji}
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: house.accentColor,
            margin: '0 0 12px',
            lineHeight: 1.2,
            textShadow: `0 0 20px ${house.accentColor}60`,
          }}
        >
          {house.name}
        </h1>

        <p
          style={{
            fontFamily: "'Crimson Text', serif",
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: 'rgba(245,230,200,0.7)',
            margin: 0,
          }}
        >
          "{house.motto}"
        </p>
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
        {/* About the House */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-heading">About the House</h2>
          <p
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: '17px',
              color: '#F5E6C8',
              lineHeight: 1.8,
              margin: '0 0 16px',
            }}
          >
            {house.description}
          </p>
          <p
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: '17px',
              color: 'rgba(245,230,200,0.8)',
              lineHeight: 1.8,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {house.sortingDescription}
          </p>
        </section>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', margin: '0 0 40px' }} />

        {/* House Traits */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-heading">House Traits</h2>
          <div>
            {house.traits.map(trait => (
              <span
                key={trait}
                className="pill"
                style={{
                  border: `1px solid ${house.accentColor}`,
                  background: `${house.color}33`,
                  color: house.accentColor,
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

        {/* Notable Members */}
        <section style={{ marginBottom: '40px' }}>
          <h2 className="section-heading">Notable Members from Our Quiz</h2>
          {house.members.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '16px' }}>
              {house.members.map(memberKey => {
                const char = characters[memberKey];
                if (!char) return null;
                return (
                  <Link
                    key={memberKey}
                    to={`/characters/${memberKey.toLowerCase()}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      transition: 'transform 200ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: char.houseColor,
                        border: `2px solid ${house.accentColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        boxShadow: `0 0 10px ${house.accentColor}40`,
                      }}
                    >
                      {char.emoji}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Crimson Text', serif",
                        fontSize: '13px',
                        color: house.accentColor,
                        textAlign: 'center',
                        maxWidth: '70px',
                        lineHeight: 1.3,
                      }}
                    >
                      {char.name.split(' ')[0]}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p
              style={{
                fontFamily: "'Crimson Text', serif",
                fontStyle: 'italic',
                color: 'rgba(245,230,200,0.45)',
                fontSize: '17px',
                margin: '16px 0 0',
              }}
            >
              None of our featured quiz characters belong to this house — but Hufflepuff
              has produced some of the finest wizards in history.
            </p>
          )}
        </section>

        <div style={{ borderTop: '1px solid rgba(212,175,55,0.15)', margin: '0 0 40px' }} />

        {/* House Details — 3-column stat row */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="section-heading">House Details</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            {[
              { label: 'Founder', value: house.founder },
              { label: 'Element', value: house.element },
              { label: 'House Ghost', value: house.ghost },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: `${house.color}22`,
                  border: `1px solid ${house.accentColor}33`,
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: house.accentColor,
                    margin: '0 0 6px',
                    opacity: 0.7,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: '16px',
                    color: '#F5E6C8',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn-gold">
            Take the Quiz — Are you a {house.name}?
          </Link>
        </div>
      </div>
    </div>
  );
}
