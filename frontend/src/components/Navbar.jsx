import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ContactModal from './ContactModal';

const navLinks = [
  { label: 'Collections', to: '/collections' },
  { label: 'Craftsmanship', to: '/craftsmanship' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();

  const wishlistCount = 2;
  const cartCount = 3;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const textColor = scrolled || isMenuOpen ? 'var(--kernia-obsidian)' : '#fff';
  const borderColor = scrolled ? 'rgba(182,141,64,0.18)' : 'transparent';
  const navBg = scrolled ? 'rgba(252,252,250,0.97)' : 'transparent';

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        background: navBg,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${borderColor}`,
        zIndex: 1000,
        transition: 'background 0.4s ease, border-color 0.4s ease',
        padding: '0 clamp(1.2rem, 4vw, 2.5rem)',
        height: '58px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* ── LEFT: Hamburger + Logo ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', width: '20px', height: '13px', flexShrink: 0,
              }}
            >
              <span style={{ display: 'block', width: '100%', height: '1px', background: textColor, transition: 'all 0.35s ease', transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ display: 'block', width: '60%', height: '1px', background: textColor, transition: 'all 0.35s ease', opacity: isMenuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '100%', height: '1px', background: textColor, transition: 'all 0.35s ease', transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>

            <Link to="/" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 400,
              color: textColor,
              textDecoration: 'none',
              letterSpacing: '0.3em',
              transition: 'color 0.4s ease',
              lineHeight: 1,
            }}>
              KENIA
            </Link>
          </div>

          {/* ── RIGHT: Contact · divider · icons · divider · Account ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>

            {/* Contact — muted utility */}
            <button
              onClick={() => setContactOpen(true)}
              className="nav-contact"
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: '0.55rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: scrolled ? 'rgba(5,5,5,0.45)' : 'rgba(255,255,255,0.55)',
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap', padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--kernia-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = scrolled ? 'rgba(5,5,5,0.45)' : 'rgba(255,255,255,0.55)'}
            >
              Contact
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '16px', background: scrolled ? 'rgba(5,5,5,0.12)' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')} aria-label="Wishlist"
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                color: textColor, transition: 'opacity 0.3s ease', padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-5px',
                  background: 'var(--kernia-gold)', color: 'var(--kernia-obsidian)',
                  fontSize: '0.44rem', fontFamily: 'var(--font-data)', fontWeight: 600,
                  width: '11px', height: '11px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')} aria-label="Cart"
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                color: textColor, transition: 'opacity 0.3s ease', padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-5px',
                  background: scrolled ? 'var(--kernia-obsidian)' : '#fff',
                  color: scrolled ? 'var(--kernia-ivory)' : 'var(--kernia-obsidian)',
                  fontSize: '0.44rem', fontFamily: 'var(--font-data)', fontWeight: 600,
                  width: '11px', height: '11px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.4s ease, color 0.4s ease',
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '16px', background: scrolled ? 'rgba(5,5,5,0.12)' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />

            {/* Account */}
            <button
              onClick={() => navigate('/login')}
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: '0.52rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: scrolled ? 'var(--kernia-ivory)' : 'var(--kernia-obsidian)',
                background: scrolled ? 'var(--kernia-obsidian)' : 'var(--kernia-ivory)',
                border: 'none', cursor: 'pointer',
                padding: '0.5rem 1.1rem',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--kernia-gold)';
                e.currentTarget.style.color = 'var(--kernia-obsidian)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = scrolled ? 'var(--kernia-obsidian)' : 'var(--kernia-ivory)';
                e.currentTarget.style.color = scrolled ? 'var(--kernia-ivory)' : 'var(--kernia-obsidian)';
              }}
            >
              Account
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-screen Menu Overlay ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'var(--kernia-obsidian)', zIndex: 999,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'flex-start', padding: '0 clamp(2rem, 8vw, 8rem)',
        transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: isMenuOpen ? 'all' : 'none',
      }}>
        <div style={{ width: '28px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '3rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '4rem' }}>
          {navLinks.map(({ label, to }, i) => (
            <Link
              key={to} to={to} onClick={() => setIsMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 400,
                color: 'var(--kernia-ivory)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                lineHeight: 1,
                transition: 'color 0.3s ease, opacity 0.3s ease',
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${0.1 + i * 0.06}s`,
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--kernia-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--kernia-ivory)'}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ width: '28px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '2rem' }} />

        <div style={{ display: 'flex', gap: '2.5rem' }}>
          <button
            onClick={() => { setIsMenuOpen(false); setContactOpen(true); }}
            style={{
              fontFamily: 'var(--font-data)', fontSize: '0.55rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(252,252,250,0.45)',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.3s ease', padding: 0,
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--kernia-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(252,252,250,0.45)'}
          >
            Contact
          </button>
          {[{ label: 'Wishlist', to: '/wishlist' }, { label: 'Cart', to: '/cart' }].map(({ label, to }) => (
            <Link
              key={to} to={to} onClick={() => setIsMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-data)', fontSize: '0.55rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(252,252,250,0.45)',
                textDecoration: 'none', transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--kernia-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(252,252,250,0.45)'}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      <style>{`
        @media (max-width: 480px) {
          .nav-contact { display: none !important; }
        }
      `}</style>
    </>
  );
}