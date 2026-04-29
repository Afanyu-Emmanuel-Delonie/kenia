import { useState, useRef } from 'react';

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "The craftsmanship is extraordinary. Every detail speaks to the artisan's dedication to perfection.",
      author: "Isabella Chen",
      title: "Art Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "A timeless piece that elevates every outfit. The quality is unmatched and the design is simply stunning.",
      author: "Sophia Laurent",
      title: "Fashion Editor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Investment in true luxury. The attention to detail and premium materials make this a treasured possession.",
      author: "Emma Richardson",
      title: "Creative Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Each piece tells a story of uncompromising quality. This is what true luxury feels like.",
      author: "Victoria Hayes",
      title: "Style Consultant",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Exceptional artistry meets modern elegance. A perfect addition to any discerning wardrobe.",
      author: "Camille Dubois",
      title: "Fashion Curator",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

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

  const scrollLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    const cardWidth = 400;
    const gap = 32;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setCurrentIndex(newIndex);
  };

  return (
    <section style={{
      padding: '6rem 0',
      background: 'var(--kernia-ivory)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
        }}>
          <div>
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
              fontSize: '2.5rem',
              fontWeight: 400,
              color: 'var(--kernia-obsidian)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}>
              Voices of Excellence
            </h2>
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}>
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid rgba(5,5,5,0.2)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--kernia-obsidian)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(5,5,5,0.2)';
              }}
            >
              <span style={{
                fontSize: '1.2rem',
                color: 'var(--kernia-obsidian)',
              }}>‹</span>
            </button>

            {/* Pagination Dots */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
            }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: currentIndex === index ? 'var(--kernia-obsidian)' : 'rgba(5,5,5,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid rgba(5,5,5,0.2)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--kernia-obsidian)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(5,5,5,0.2)';
              }}
            >
              <span style={{
                fontSize: '1.2rem',
                color: 'var(--kernia-obsidian)',
              }}>›</span>
            </button>
          </div>
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
            <div key={index} style={{
              minWidth: '400px',
              padding: '3rem 2.5rem',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(5,5,5,0.08)',
              position: 'relative',
            }}>
              {/* Quote */}
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1.1rem',
                fontWeight: 300,
                color: 'var(--kernia-obsidian)',
                lineHeight: 1.6,
                letterSpacing: '0.01em',
                marginBottom: '3rem',
                fontStyle: 'italic',
                textAlign: 'left',
              }}>
                {testimonial.quote}
              </p>

              {/* Author Section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                {/* Author Info */}
                <div>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--kernia-obsidian)',
                    letterSpacing: '0.02em',
                    marginBottom: '0.25rem',
                  }}>
                    {testimonial.author}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    fontWeight: 300,
                    color: 'var(--kernia-obsidian)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                  }}>
                    {testimonial.title}
                  </p>
                </div>

                {/* Profile Image */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--kernia-gold)',
                  flexShrink: 0,
                }}>
                  <img 
                    src={testimonial.image}
                    alt={testimonial.author}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}