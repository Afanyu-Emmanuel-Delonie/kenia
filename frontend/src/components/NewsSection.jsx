import { Link } from 'react-router-dom';

const NewsCard = ({ image, title, excerpt, date, readTime, link, isLarge = false }) => (
  <div style={{
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  }}>
    <img
      src={image}
      alt={title}
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
      padding: '1.75rem 2rem',
    }}>
      <h3 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: isLarge ? '1.05rem' : '0.95rem',
        fontWeight: 600, color: '#fff',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        marginBottom: '0.35rem',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Inter, sans-serif', fontWeight: 300,
        lineHeight: 1.5, marginBottom: '1.1rem',
      }}>
        {excerpt}
      </p>
      <Link
        to={link}
        style={{
          display: 'inline-block',
          padding: '0.6rem 1.5rem',
          background: '#fff', color: '#050505',
          textDecoration: 'none',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.58rem', fontWeight: 400,
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#B68D40'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#050505'; }}
      >
        Read News
      </Link>
    </div>
  </div>
);

export default function NewsSection() {
  return (
    <section 
      className="news-section"
      style={{ 
        background: '#F5F3EE', 
        padding: 'clamp(1.5rem, 4vw, 2.5rem)', 
        paddingTop: 'clamp(3rem, 6vw, 6rem)', 
        paddingBottom: 'clamp(3rem, 6vw, 6rem)' 
      }}
    >
      <div 
        className="news-grid"
        style={{
          maxWidth: '1100px', 
          margin: '0 auto',
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: 'clamp(0.75rem, 2vw, 1rem)', 
          height: 'clamp(350px, 60vw, 480px)',
        }}
      >

        <NewsCard
          image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop"
          title="The Art of Italian Leather Craftsmanship"
          excerpt="Discover the centuries-old techniques that make our handbags extraordinary."
          date="March 15, 2024"
          readTime="5 min read"
          link="/news/1" isLarge
        />

        <div 
          className="news-stack"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'clamp(0.75rem, 2vw, 1rem)' 
          }}
        >
          <NewsCard
            image="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop"
            title="Sustainable Luxury: Our Commitment"
            excerpt="How we're pioneering eco-conscious practices in luxury fashion."
            date="March 10, 2024"
            readTime="3 min read"
            link="/news/2"
          />
          <NewsCard
            image="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=400&fit=crop"
            title="Behind the Scenes: Atelier Visit"
            excerpt="An exclusive look into our master craftsmen's workshop."
            date="March 5, 2024"
            readTime="4 min read"
            link="/news/3"
          />
        </div>

      </div>
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
            height: auto !important;
          }
          
          .news-stack {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .news-stack {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}