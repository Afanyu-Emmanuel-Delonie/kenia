import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ContactModal from './ContactModal';

const navLinks = [
  { label: 'Collections',   to: '/collections'  },
  { label: 'Craftsmanship', to: '/craftsmanship' },
  { label: 'About',         to: '/about'         },
];

function UnavailablePopup({ label, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 2000, background: '#050505', border: '1px solid rgba(182,141,64,0.3)',
      padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 8px 32px rgba(5,5,5,0.2)', animation: 'slideUp 0.3s ease',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B68D40', flexShrink: 0 }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#FCFCFA', fontWeight: 400 }}>
        <strong style={{ color: '#B68D40' }}>{label}</strong> is not available yet
      </p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(252,252,250,0.3)', padding: 0, marginLeft: '0.5rem', fontSize: '1rem', lineHeight: 1 }}>×</button>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [unavailable, setUnavailable] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const onDark    = isMenuOpen || !scrolled;
  const textColor = onDark ? '#FCFCFA' : 'var(--kernia-obsidian)';
  const dividerBg = (!isMenuOpen && scrolled) ? 'rgba(5,5,5,0.12)' : 'rgba(255,255,255,0.2)';

  const overlayBtn = {
    fontFamily: 'var(--font-data)', fontSize: '0.55rem', letterSpacing: '0.18em',
    textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer',
    padding: 0, transition: 'color 0.3s ease', color: 'rgba(252,252,250,0.45)',
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: (!isMenuOpen && scrolled) ? 'rgba(252,252,250,0.97)' : 'transparent',
        backdropFilter: (!isMenuOpen && scrolled) ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${(!isMenuOpen && scrolled) ? 'rgba(182,141,64,0.18)' : 'transparent'}`,
        zIndex: 1000, transition: 'background 0.4s ease, border-color 0.4s ease',
        padding: '0 clamp(1.2rem, 4vw, 2.5rem)', height: '58px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* LEFT: hamburger + logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '20px', height: '13px', flexShrink: 0 }}
            >
              <span style={{ display: 'block', width: '100%', height: '1px', background: textColor, transition: 'all 0.35s ease', transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ display: 'block', width: '60%', height: '1px', background: textColor, transition: 'all 0.35s ease', opacity: isMenuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '100%', height: '1px', background: textColor, transition: 'all 0.35s ease', transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>

            <Link to="/" style={{
              fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400,
              color: textColor, textDecoration: 'none', letterSpacing: '0.3em',
              transition: 'color 0.4s ease', lineHeight: 1,
            }}>
              KENIA
            </Link>
          </div>

          {/* RIGHT: contact · [icons desktop] · divider · account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>

            {/* Contact */}
            <button
              onClick={() => setContactOpen(true)}
              style={{
                fontFamily: 'var(--font-data)', fontSize: '0.55rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, transition: 'color 0.3s ease', whiteSpace: 'nowrap',
                color: onDark ? 'rgba(255,255,255,0.55)' : 'rgba(5,5,5,0.45)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--kernia-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = onDark ? 'rgba(255,255,255,0.55)' : 'rgba(5,5,5,0.45)')}
            >
              Contact
            </button>

            {/* Wishlist — desktop only */}
            <button
              onClick={() => setUnavailable('Wishlist')} aria-label="Wishlist"
              className="nav-icon-desktop"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor, padding: 0, transition: 'opacity 0.3s ease', position: 'relative' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span style={{
                position: 'absolute', top: '-5px', right: '-6px',
                background: 'var(--kernia-gold)', color: 'var(--kernia-obsidian)',
                fontFamily: 'var(--font-data)', fontSize: '0.42rem', fontWeight: 700,
                width: '12px', height: '12px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}>2</span>
            </button>

            {/* Cart — desktop only */}
            <button
              onClick={() => setUnavailable('Cart')} aria-label="Cart"
              className="nav-icon-desktop"
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor, padding: 0, transition: 'opacity 0.3s ease', position: 'relative' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span style={{
                position: 'absolute', top: '-5px', right: '-6px',
                background: onDark ? '#FCFCFA' : '#050505', color: onDark ? '#050505' : '#FCFCFA',
                fontFamily: 'var(--font-data)', fontSize: '0.42rem', fontWeight: 700,
                width: '12px', height: '12px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1, transition: 'background 0.4s ease, color 0.4s ease',
              }}>3</span>
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '16px', background: dividerBg, flexShrink: 0 }} />

            {/* Account */}
            <button
              onClick={() => navigate('/login')}
              style={{
                fontFamily: 'var(--font-data)', fontSize: '0.52rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                padding: '0.5rem 1.1rem', transition: 'all 0.3s ease', whiteSpace: 'nowrap',
                color: onDark ? 'var(--kernia-obsidian)' : 'var(--kernia-ivory)',
                background: onDark ? 'var(--kernia-ivory)' : 'var(--kernia-obsidian)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--kernia-gold)'; e.currentTarget.style.color = 'var(--kernia-obsidian)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = onDark ? 'var(--kernia-ivory)' : 'var(--kernia-obsidian)'; e.currentTarget.style.color = onDark ? 'var(--kernia-obsidian)' : 'var(--kernia-ivory)'; }}
            >
              Account
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen menu overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'var(--kernia-obsidian)', zIndex: 999,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'flex-start', padding: '0 clamp(2rem, 8vw, 8rem)',
        transform: isMenuOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: isMenuOpen ? 'all' : 'none',
      }}>
        <div style={{ width: '28px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '3rem' }} />

        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '4rem' }}>
          {navLinks.map(({ label }, i) => (
            <button
              key={label}
              onClick={() => { setIsMenuOpen(false); setUnavailable(label); }}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 400, color: 'var(--kernia-ivory)', background: 'none',
                border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
                letterSpacing: '-0.01em', lineHeight: 1,
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(40px)',
                transition: `color 0.3s ease, opacity 0.5s ease ${0.15 + i * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.07}s`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--kernia-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--kernia-ivory)')}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ width: '28px', height: '1px', background: 'var(--kernia-gold)', marginBottom: '2rem' }} />

        {/* Utility row — Contact always here; Wishlist + Cart always here (mobile only sees them here) */}
        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Contact',  action: () => { setIsMenuOpen(false); setContactOpen(true); } },
            { label: 'Wishlist', action: () => { setIsMenuOpen(false); setUnavailable('Wishlist'); } },
            { label: 'Cart',     action: () => { setIsMenuOpen(false); setUnavailable('Cart'); } },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              style={overlayBtn}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--kernia-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(252,252,250,0.45)')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      {unavailable && <UnavailablePopup label={unavailable} onClose={() => setUnavailable(null)} />}

      <style>{`
        @media (max-width: 640px) {
          .nav-icon-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
