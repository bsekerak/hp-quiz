import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const S = {
  header: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(5,4,15,0.95)',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(212,175,55,0.25)',
    height: '68px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 48px',
    boxSizing: 'border-box', width: '100%',
  },
  logo: {
    fontFamily: "'Cinzel Decorative', serif", fontSize: '18px',
    color: '#D4AF37', textDecoration: 'none', letterSpacing: '1px',
    whiteSpace: 'nowrap', flexShrink: 0,
  },
  nav: {
    display: 'flex', alignItems: 'center', gap: '8px',
    listStyle: 'none', margin: 0, padding: 0,
  },
  navLink: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
    color: 'rgba(245,230,200,0.75)', textDecoration: 'none',
    letterSpacing: '1px', padding: '8px 16px', borderRadius: '4px',
    borderBottom: '1px solid transparent', transition: 'color 200ms, background 200ms',
    display: 'block',
  },
  navLinkActive: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
    color: '#D4AF37', textDecoration: 'none',
    letterSpacing: '1px', padding: '8px 16px', borderRadius: '4px',
    borderBottom: '1px solid #D4AF37', display: 'block',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: '#D4AF37', fontSize: '24px', cursor: 'pointer', padding: '8px',
  },
  mobileNav: {
    position: 'absolute', top: '68px', left: 0, right: 0,
    background: 'rgba(5,4,15,0.98)', padding: '20px',
    borderBottom: '1px solid rgba(212,175,55,0.2)',
    display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 999,
  },
  mobileLink: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: '17px',
    color: 'rgba(245,230,200,0.75)', textDecoration: 'none',
    letterSpacing: '1px', padding: '14px 16px',
    borderBottom: '1px solid rgba(212,175,55,0.1)', display: 'block',
  },
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 768
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleTakeQuiz = (e) => {
    e.preventDefault();
    navigate('/', { state: { resetQuiz: Date.now() } });
    setMenuOpen(false);
  };

  // Keep mobile state in sync with resize
  if (typeof window !== 'undefined') {
    const update = () => setIsMobile(window.innerWidth <= 768);
    if (!window.__hpResizeAttached) {
      window.addEventListener('resize', update);
      window.__hpResizeAttached = true;
    }
  }

  const linkStyle = ({ isActive }) => isActive ? S.navLinkActive : S.navLink;
  const mobileLinkStyle = ({ isActive }) => ({
    ...S.mobileLink,
    color: isActive ? '#D4AF37' : 'rgba(245,230,200,0.75)',
  });

  const close = () => setMenuOpen(false);

  return (
    <header style={S.header}>
      <Link to="/" style={S.logo}>✦ Wizarding World Quiz</Link>

      {/* Desktop nav */}
      {!isMobile && (
        <nav style={S.nav}>
          <a href="/" onClick={handleTakeQuiz} style={location.pathname === '/' ? S.navLinkActive : S.navLink}>Take the Quiz</a>
          <NavLink to="/characters" style={linkStyle}>Characters</NavLink>
          <NavLink to="/houses" style={linkStyle}>Houses</NavLink>
        </nav>
      )}

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          style={{ ...S.hamburger, display: 'block' }}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <nav style={S.mobileNav}>
          <a href="/" onClick={handleTakeQuiz} style={mobileLinkStyle({ isActive: location.pathname === '/' })}>Take the Quiz</a>
          <NavLink to="/characters" style={mobileLinkStyle} onClick={close}>Characters</NavLink>
          <NavLink to="/houses" style={mobileLinkStyle} onClick={close}>Houses</NavLink>
        </nav>
      )}
    </header>
  );
}
