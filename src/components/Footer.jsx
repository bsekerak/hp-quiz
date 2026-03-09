import { Link } from 'react-router-dom';

const linkStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '14px', color: 'rgba(212,175,55,0.6)',
  textDecoration: 'none', letterSpacing: '1px',
};

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(5,4,15,0.97)',
      borderTop: '1px solid rgba(212,175,55,0.15)',
      padding: '48px 40px', textAlign: 'center', width: '100%',
    }}>
      <p style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '16px', color: '#D4AF37', marginBottom: '12px',
      }}>
        ✦ Wizarding World Quiz ✦
      </p>

      <p style={{
        fontFamily: "'Crimson Text', serif",
        fontSize: '13px', color: 'rgba(245,230,200,0.35)',
        marginBottom: '20px', maxWidth: '480px',
        marginLeft: 'auto', marginRight: 'auto',
      }}>
        A fan-made personality experience. Not affiliated with Warner Bros. or Wizarding World.
      </p>

      <div style={{
        display: 'flex', justifyContent: 'center',
        gap: '24px', flexWrap: 'wrap', marginBottom: '20px',
      }}>
        <Link to="/" style={linkStyle}>Take the Quiz</Link>
        <Link to="/characters" style={linkStyle}>Characters</Link>
        <Link to="/houses" style={linkStyle}>Houses</Link>
      </div>

      <p style={{
        fontFamily: "'Crimson Text', serif",
        fontSize: '12px', color: 'rgba(245,230,200,0.25)',
      }}>
        © 2026 Fan Project
      </p>
    </footer>
  );
}
