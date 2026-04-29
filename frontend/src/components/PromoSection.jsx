import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assets';

const PromoCard = ({ image, category, discount, sub, link, isLarge = false }) => (
  <div className="promo-card" style={{
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    minHeight: isLarge ? '300px' : '200px',
  }}>
    <img
      src={image}
      alt={category}
      loading="lazy"
      decoding="async"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />

    {/* Gradient overlay — bottom up only */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
    }} />

    {/* Text — bottom left */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: 'clamp(1rem, 3vw, 1.75rem) clamp(1rem, 4vw, 2rem)',
    }}>
      <h3 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isLarge ? 'clamp(0.9rem, 2vw, 1.05rem)' : 'clamp(0.8rem, 1.8vw, 0.95rem)',
        fontWeight: 600, color: '#fff',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        marginBottom: 'clamp(0.25rem, 1vw, 0.35rem)',
      }}>
        {category} — {discount}
      </h3>
      <p style={{
        fontSize: 'clamp(0.65rem, 1.5vw, 0.72rem)', 
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Inter, sans-serif', fontWeight: 300,
        lineHeight: 1.5, 
        marginBottom: 'clamp(0.8rem, 2vw, 1.1rem)',
      }}>
        {sub}
      </p>
      <Link
        to={link}
        style={{
          display: 'inline-block',
          padding: 'clamp(0.6rem, 1.5vw, 0.7rem) clamp(1.2rem, 3vw, 1.8rem)',
          background: '#fff', color: '#050505',
          textDecoration: 'none',
          fontFamily: 'var(--font-data)',
          fontSize: 'clamp(0.5rem, 1.2vw, 0.55rem)', 
          fontWeight: 400,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#B68D40'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#050505'; }}
      >
        Discover {category}
      </Link>
    </div>
  </div>
);

export default function PromoSection() {
  return (
    <section 
      className="promo-section"
      style={{ 
        background: '#F5F3EE', 
        padding: 'clamp(1.5rem, 4vw, 2.5rem)', 
        paddingTop: 'clamp(3rem, 8vw, 6rem)', 
        paddingBottom: 'clamp(3rem, 8vw, 6rem)' 
      }}
    >
      <div 
        className="promo-grid"
        style={{
          maxWidth: '1100px', 
          margin: '0 auto',
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: 'clamp(0.5rem, 2vw, 1rem)', 
          height: 'clamp(300px, 50vw, 480px)',
        }}
      >
          <PromoCard
          image={assetUrl('featured-1.png')}
          category="Women" discount="New Arrivals"
          sub="Discover our latest collection of handcrafted women's accessories, where elegance meets artisanal excellence."
          link="/collections/women" isLarge
        />

        <div 
          className="promo-stack"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'clamp(0.75rem, 2vw, 1rem)' 
          }}
        >
          <PromoCard
            image={assetUrl('futured-2.png')}
            category="Men" discount="Heritage Line"
            sub="Refined masculinity in every stitch and detail."
            link="/collections/men"
          />
          <PromoCard
            image={assetUrl('future-3.png')}
            category="Accessories" discount="Artisan Crafted"
            sub="Complete your ensemble with our signature accessories."
            link="/collections/accessories"
          />
        </div>
      </div>
      
      {/* Responsive Styles */}
      <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
          .promo-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            height: auto !important;
          }
          
          .promo-stack {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
          }
          
          .promo-card {
            min-height: 250px !important;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .promo-stack {
            grid-template-columns: 1fr !important;
          }
          
          .promo-card {
            min-height: 200px !important;
          }
        }
        
        /* Tablet Styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .promo-grid {
            grid-template-columns: 1.5fr 1fr !important;
            height: clamp(400px, 50vw, 450px) !important;
          }
        }
        
        /* Large Desktop */
        @media (min-width: 1400px) {
          .promo-grid {
            max-width: 1300px !important;
            height: 520px !important;
          }
        }
      `}</style>
    </section>
  );
}
