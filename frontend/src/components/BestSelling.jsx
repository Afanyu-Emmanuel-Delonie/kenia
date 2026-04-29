import { useState } from 'react';
import { Link } from 'react-router-dom';
import InquiryModal from './InquiryModal';
import { assetUrl } from '../utils/assets';

const products = [
  {
    id: 1,
    name: 'Meridian Tote',
    collection: 'Heritage Collection',
    price: 2850,
    image: assetUrl('best-selling-1.png')
  },
  {
    id: 2,
    name: 'Nocturne Clutch',
    collection: 'Evening Luxe',
    price: 1650,
    image: assetUrl('best-selling-2.png')
  },
  {
    id: 3,
    name: 'Voyager Satchel',
    collection: 'Travel Essentials',
    price: 3200,
    image: assetUrl('best-selling-3.png')
  },
  {
    id: 4,
    name: 'Atelier Briefcase',
    collection: 'Signature Series',
    price: 4500,
    image: assetUrl('best-selling-4.png')
  }
];

const ProductCard = ({ product, onEnquire }) => {
  const [hovered, setHovered] = useState(false);
  return (
  <div
    style={{ backgroundColor: 'transparent', cursor: 'pointer', transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; setHovered(true); }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; setHovered(false); }}
  >
    <div style={{
      position: 'relative',
      marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
      overflow: 'hidden',
      height: 'clamp(240px, 35vw, 280px)',
    }}>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
        }}
      />
      <div style={{
        position: 'absolute', top: '1rem', left: '1rem',
        background: 'rgba(252,252,250,0.95)', padding: '0.4rem 0.8rem', backdropFilter: 'blur(10px)',
      }}>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.5rem', color: 'var(--kernia-obsidian)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {product.collection}
        </span>
      </div>
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(5,5,5,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onEnquire(product); }}
          style={{
            fontFamily: 'var(--font-data)', fontSize: '0.55rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', background: 'var(--kernia-ivory)', color: 'var(--kernia-obsidian)',
            border: 'none', cursor: 'pointer', padding: '0.75rem 1.8rem', transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--kernia-gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--kernia-ivory)'; }}
        >
          Enquire
        </button>
      </div>
    </div>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--kernia-obsidian)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
      {product.name}
    </h3>
    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 500, color: 'var(--kernia-obsidian)', letterSpacing: '0.02em' }}>
      ${product.price.toLocaleString()}
    </p>
  </div>
  );
};

export default function BestSelling() {
  const [activeListing, setActiveListing] = useState(null);
  return (
    <section style={{
      padding: 'clamp(3rem, 8vw, 6rem) 0',
      backgroundColor: 'var(--kernia-ivory)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(2.5rem, 6vw, 4rem)',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-data)',
            fontSize: '0.65rem',
            fontWeight: 400,
            color: 'var(--kernia-gold)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
          }}>
            Artisan Favorites
          </h3>
          
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 400,
            color: 'var(--kernia-obsidian)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
          }}>
            Masterpieces in Leather
          </h2>

          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem',
            fontWeight: 300,
            color: 'rgba(5,5,5,0.7)',
            letterSpacing: '0.01em',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            Each piece represents 72 hours of meticulous craftsmanship, 
            where tradition meets contemporary elegance.
          </p>
        </div>

        <div 
          className="products-scroll"
          style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 4vw, 2rem)',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollBehavior: 'smooth',
            marginBottom: 'clamp(2rem, 5vw, 3rem)',
          }}
        >
          {products.map(product => (
            <div key={product.id} style={{ minWidth: 'clamp(250px, 30vw, 280px)', flex: '0 0 auto' }}>
              <ProductCard product={product} onEnquire={setActiveListing} />
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
        }}>
          <Link
            to="/collections"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: 'transparent',
              color: 'var(--kernia-obsidian)',
              textDecoration: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              border: '1px solid var(--kernia-obsidian)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--kernia-obsidian)';
              e.target.style.color = 'var(--kernia-ivory)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--kernia-obsidian)';
            }}
          >
            View Atelier Collection
          </Link>
        </div>
      </div>
      
      {activeListing && (
        <InquiryModal
          listing={{ id: activeListing.id, title: activeListing.name }}
          onClose={() => setActiveListing(null)}
        />
      )}

      {/* Responsive Styles */}
      <style>{`
        .products-scroll {
          scrollbar-width: none;
        }
        
        .products-scroll::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .products-scroll {
            gap: 1.2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .products-scroll {
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
