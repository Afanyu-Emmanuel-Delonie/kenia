import { useState, useRef } from 'react';

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "The craftsmanship is extraordinary. Every detail speaks to the artisan's dedication to perfection.",
      author: "Isabella Chen",
      title: "Art Director",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=b6e3f4,c0aede,d1d4f9"
    },
    {
      quote: "A timeless piece that elevates every outfit. The quality is unmatched and the design is simply stunning.",
      author: "Sophia Laurent",
      title: "Fashion Editor",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=b6e3f4,c0aede,d1d4f9"
    },
    {
      quote: "Investment in true luxury. The attention to detail and premium materials make this a treasured possession.",
      author: "Emma Richardson",
      title: "Creative Director",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=b6e3f4,c0aede,d1d4f9"
    },
    {
      quote: "Each piece tells a story of uncompromising quality. This is what true luxury feels like.",
      author: "Victoria Hayes",
      title: "Style Consultant",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria&backgroundColor=b6e3f4,c0aede,d1d4f9"
    },
    {
      quote: "Exceptional artistry meets modern elegance. A perfect addition to any discerning wardrobe.",
      author: "Camille Dubois",
      title: "Fashion Curator",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille&backgroundColor=b6e3f4,c0aede,d1d4f9"
    }
  ];

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const cardWidth = 400;
    const gap = 32;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < testimonials.length) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    const cardWidth = 400;
    const gap = 32;
    const scrollPosition = index * (cardWidth + gap);

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  return (
    <section style={{
      padding: 'clamp(3rem, 8vw, 6rem) 0',
      background: 'var(--kernia-ivory)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 4vw, 2rem)',
      }}>

        {/* Section Header — top, no controls here */}
        <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.7rem',
            fontWeight: 400,
            color: 'var(--kernia-obsidian)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            opacity: 0.7,
          }}>
            Client Stories
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--kernia-obsidian)',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}>
            Voices of Excellence
          </h2>
        </div>

        {/* Testimonials Scroll Container */}
        <div
          ref={scrollRef}
          className="testimonials-scroll"
          onScroll={handleScroll}
          style={{
            display: 'flex',
            gap: '2rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollBehavior: 'smooth',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card" style={{
              minWidth: 'clamp(300px, 80vw, 400px)',
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2.5rem)',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(5,5,5,0.08)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              {/* Quote Mark */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--kernia-gold)',
                lineHeight: 1,
                marginBottom: '1.5rem',
                opacity: 0.4,
              }}>
                "
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                fontWeight: 300,
                color: 'var(--kernia-obsidian)',
                lineHeight: 1.6,
                letterSpacing: '0.01em',
                marginBottom: '2.5rem',
                fontStyle: 'italic',
                flexGrow: 1,
              }}>
                {testimonial.quote}
              </p>

              {/* Author Row — profile image + name/title side by side */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                {/* Profile Image */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  backgroundColor: 'var(--kernia-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--kernia-obsidian)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    color: 'var(--kernia-obsidian)',
                    textTransform: 'uppercase',
                  }}>
                    {testimonial.author.charAt(0)}
                  </span>
                </div>

                {/* Name & Title */}
                <div>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--kernia-obsidian)',
                    letterSpacing: '0.02em',
                    marginBottom: '0.2rem',
                  }}>
                    {testimonial.author}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.72rem',
                    fontWeight: 300,
                    color: 'var(--kernia-obsidian)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                  }}>
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Controls — pagination dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          alignItems: 'center',
          marginTop: 'clamp(1.5rem, 4vw, 2rem)',
        }}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                borderRadius: currentIndex === index ? '4px' : '50%',
                border: 'none',
                background: currentIndex === index ? 'var(--kernia-obsidian)' : 'rgba(5,5,5,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

      </div>
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .testimonial-card {
            min-width: 300px !important;
            padding: 2rem 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .testimonial-card {
            min-width: 280px !important;
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}