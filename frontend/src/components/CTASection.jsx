import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assets';

export default function CTASection() {
  return (
    <section style={{
      padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
      background: 'var(--kernia-ivory)',
    }}>
    <div 
      className="cta-container"
      style={{
        background: 'var(--kernia-obsidian)',
        margin: '0 clamp(0rem, 4vw, 4rem)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 'clamp(3rem, 8vw, 7rem)',
        minHeight: 'clamp(50vh, 60vw, 80vh)',
      }}
    >
      <div 
        className="cta-content"
        style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* Image */}
        <div 
          className="cta-image"
          style={{
            flexShrink: 0,
          }}
        >
          <img 
            src={assetUrl('cta.png')} 
            alt="Luxury Handbag"
            loading="lazy"
            decoding="async"
            style={{
              width: 'clamp(300px, 40vw, 400px)',
              height: 'clamp(350px, 45vw, 450px)',
              objectFit: 'cover',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Content */}
        <div 
          className="cta-text"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 400,
            color: 'var(--kernia-ivory)',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            Elevate Your Style
          </h2>

          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: 300,
            color: 'rgba(252,252,250,0.8)',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
            marginBottom: '2.5rem',
            maxWidth: '320px',
          }}>
            Discover handcrafted luxury that transcends trends. Each piece is a testament to exceptional artistry.
          </p>

          <Link
            to="/store"
            style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              background: 'var(--kernia-gold)',
              color: 'var(--kernia-obsidian)',
              textDecoration: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid var(--kernia-gold)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--kernia-gold)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--kernia-gold)';
              e.target.style.color = 'var(--kernia-obsidian)';
            }}
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </div>
    
    {/* Responsive Styles */}
    <style>{`
      @media (max-width: 768px) {
        .cta-container {
          margin: 0 !important;
          min-height: auto !important;
          padding: 2rem 1rem !important;
        }
        
        .cta-content {
          flex-direction: column !important;
          text-align: center !important;
          gap: 2rem !important;
        }
        
        .cta-image {
          order: 2 !important;
        }
        
        .cta-text {
          align-items: center !important;
          text-align: center !important;
          order: 1 !important;
        }
      }
      
      @media (max-width: 480px) {
        .cta-container {
          padding: 1.5rem 0.5rem !important;
        }
      }
    `}</style>
    </section>
  );
}
