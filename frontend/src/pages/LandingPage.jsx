import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import BestSelling from "../components/BestSelling";
import PromoSection from "../components/PromoSection";
import FeaturedCollections from "../components/FeaturedCollections";
import CTASection from "../components/CTASection";
import Testimonials from "../components/Testimonials";
import NewsSection from "../components/NewsSection";
import CraftsmanshipSection from "../components/CraftsmanshipSection";
import Footer from "../components/Footer";
import { assetUrl } from "../utils/assets";

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}

export default function LandingPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="hero-section"
        style={{
          minHeight: "100vh",
          width: "100vw",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        {/* Hero image — eager, high priority for LCP */}
        <img
          src={assetUrl("hero.png")}
          alt=""
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,5,0.45)", zIndex: 1 }} />


        {/* Main Content */}
        <div
          className="hero-content"
          style={{
            textAlign: "center",
            maxWidth: "600px",
            width: "100%",
            padding: "0 1rem",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            className="hero-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 400,
              color: "var(--kernia-ivory)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              marginBottom: "clamp(1.5rem, 4vw, 2rem)",
            }}
          >
            Artisanal Mastery
          </h1>

          <p
            className="hero-description"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
              fontWeight: 300,
              color: "rgba(252,252,250,0.85)",
              letterSpacing: "0.015em",
              lineHeight: 1.6,
              maxWidth: "480px",
              margin: "0 auto",
              marginBottom: "clamp(2.5rem, 6vw, 3.5rem)",
            }}
          >
            Since 1947, our master artisans have crafted each piece with
            unwavering dedication to perfection. Discover leather goods that
            transcend generations.
          </p>

          <div
            className="hero-buttons"
            style={{
              display: "flex",
              gap: "clamp(1rem, 3vw, 1.5rem)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/store"
              className="btn-primary"
              style={{
                display: "inline-block",
                padding:
                  "clamp(0.9rem, 2.5vw, 1.1rem) clamp(2rem, 5vw, 2.8rem)",
                background: "var(--kernia-gold)",
                color: "var(--kernia-obsidian)",
                textDecoration: "none",
                fontFamily: "var(--font-ui)",
                fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "all 0.35s ease",
                border: "1px solid var(--kernia-gold)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "var(--kernia-gold)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--kernia-gold)";
                e.target.style.color = "var(--kernia-obsidian)";
              }}
            >
              Explore Atelier
            </Link>
            <Link
              to="/login"
              className="btn-secondary"
              style={{
                display: "inline-block",
                padding:
                  "clamp(0.9rem, 2.5vw, 1.1rem) clamp(2rem, 5vw, 2.8rem)",
                background: "transparent",
                color: "var(--kernia-ivory)",
                textDecoration: "none",
                fontFamily: "var(--font-ui)",
                fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "all 0.35s ease",
                border: "1px solid rgba(252,252,250,0.3)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(252,252,250,0.1)";
                e.target.style.borderColor = "var(--kernia-ivory)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "rgba(252,252,250,0.3)";
              }}
            >
              Artisan Portal
            </Link>
          </div>
        </div>
      </div>

      <Reveal delay={0}><BestSelling /></Reveal>
      <Reveal delay={0}><PromoSection /></Reveal>
      <Reveal delay={0}><FeaturedCollections /></Reveal>
      <Reveal delay={0}><CTASection /></Reveal>
      <Reveal delay={0}><Testimonials /></Reveal>
      <Reveal delay={0}><NewsSection /></Reveal>
      <Reveal delay={0}><CraftsmanshipSection /></Reveal>
      <Reveal delay={0}><Footer /></Reveal>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '44px',
          height: '44px',
          background: 'var(--kernia-obsidian)',
          border: '1px solid var(--kernia-gold)',
          color: 'var(--kernia-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999,
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Responsive Styles */}
      <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
          .hero-section {
            padding: 0 1rem !important;
            min-height: 70vh !important;
          }
          
          .hero-access-link {
            top: 1rem !important;
            right: 1rem !important;
          }
          
          .hero-content {
            padding: 0 0.5rem !important;
          }
          
          .hero-description {
            margin-bottom: 1.5rem !important;
          }
          
          .hero-buttons {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100% !important;
            max-width: 280px !important;
            text-align: center !important;
            padding: 1rem 2rem !important;
          }
        }
        
        /* Tablet Styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-section {
            padding: 0 2rem !important;
          }
          
          .hero-content {
            max-width: 550px !important;
          }
        }
        
        /* Large Desktop Styles */
        @media (min-width: 1400px) {
          .hero-content {
            max-width: 700px !important;
          }
        }
        
        /* Ultra-wide Screens */
        @media (min-width: 1920px) {
          .hero-title {
            font-size: 5.5rem !important;
          }
          
          .hero-description {
            font-size: 1.2rem !important;
          }
        }
        
        /* Portrait Orientation on Mobile */
        @media (max-width: 768px) and (orientation: portrait) {
          .hero-section {
            min-height: 65vh !important;
            justify-content: center !important;
          }
        }
        
        /* Landscape Orientation on Mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .hero-section {
            min-height: 100vh !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          
          .hero-title {
            font-size: 2.2rem !important;
            margin-bottom: 1rem !important;
          }
          
          .hero-description {
            font-size: 0.85rem !important;
            margin-bottom: 2rem !important;
          }
          
          .hero-buttons {
            flex-direction: row !important;
            gap: 1rem !important;
          }
          
          .btn-primary,
          .btn-secondary {
            width: auto !important;
            padding: 0.8rem 1.5rem !important;
            font-size: 0.6rem !important;
          }
        }
      `}</style>
    </>
  );
}
