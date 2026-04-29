import { assetUrl } from '../utils/assets';

export default function CraftsmanshipSection() {
  return (
    <section style={{
      padding: 'clamp(3rem, 8vw, 8rem) 0',
      background: 'var(--kernia-ivory)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 4vw, 2rem)',
      }}>
        <div 
          className="craftsmanship-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >
          {/* Content Side */}
          <div className="craftsmanship-content">
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              fontWeight: 400,
              color: 'var(--kernia-obsidian)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              opacity: 0.7,
            }}>
              Heritage & Artistry
            </p>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 400,
              color: 'var(--kernia-obsidian)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              marginBottom: '2.5rem',
            }}>
              Masterful Craftsmanship
            </h2>

            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
              fontWeight: 300,
              color: 'var(--kernia-obsidian)',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
              marginBottom: '2.5rem',
            }}>
              Each piece is born from the hands of master artisans who have dedicated their lives to perfecting their craft. With techniques passed down through generations, every stitch tells a story of precision, passion, and unwavering commitment to excellence.
            </p>

            {/* Craftsmanship Stats */}
            <div 
              className="craftsmanship-stats"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(1rem, 3vw, 2rem)',
                marginBottom: '3rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 400,
                  color: 'var(--kernia-gold)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  72
                </div>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: 'var(--kernia-obsidian)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                }}>
                  Hours Per Piece
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 400,
                  color: 'var(--kernia-gold)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  15
                </div>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: 'var(--kernia-obsidian)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                }}>
                  Master Artisans
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 400,
                  color: 'var(--kernia-gold)',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  1947
                </div>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: 'var(--kernia-obsidian)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                }}>
                  Since Founded
                </p>
              </div>
            </div>
          </div>

          {/* Video Side */}
          <div 
            className="craftsmanship-image"
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <video
                src={assetUrl('about.mp4')}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: 'clamp(400px, 50vw, 600px)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Overlay Quote */}
              <div style={{
                position: 'absolute',
                bottom: '2rem', left: '2rem', right: '2rem',
                background: 'rgba(5,5,5,0.8)',
                padding: '2rem',
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 300,
                  color: 'var(--kernia-ivory)', fontStyle: 'italic',
                  lineHeight: 1.5, marginBottom: '1rem',
                }}>
                  "True luxury lies not in the materials alone, but in the soul and skill of the artisan who shapes them."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: 'var(--kernia-gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500, color: 'var(--kernia-obsidian)' }}>M</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--kernia-ivory)', marginBottom: '0.1rem' }}>Master Giovanni</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 300, color: 'rgba(252,252,250,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Artisan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .craftsmanship-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          
          .craftsmanship-content {
            order: 2 !important;
            text-align: center !important;
          }
          
          .craftsmanship-image {
            order: 1 !important;
          }
          
          .craftsmanship-stats {
            gap: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .craftsmanship-stats {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
