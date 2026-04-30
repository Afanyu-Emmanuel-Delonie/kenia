import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { assetUrl } from "../utils/assets";

const collections = [
  {
    id: 1,
    name: "Heritage Collection",
    description: "Timeless designs rooted in our 1947 legacy",
    image: assetUrl("promo-1.png"),
    link: "/collections/heritage",
  },
  {
    id: 2,
    name: "Atelier Noir",
    description: "Sophisticated darkness meets refined elegance",
    image: assetUrl("promo-2.png"),
    link: "/collections/noir",
  },
  {
    id: 3,
    name: "Evening Luxe",
    description: "Exquisite pieces for distinguished occasions",
    image: assetUrl("promo-3.png"),
    link: "/collections/evening",
  },
  {
    id: 4,
    name: "Voyager Series",
    description: "Luxury redefined for the modern traveler",
    image: assetUrl("promo-4.png"),
    link: "/collections/voyager",
  },
  {
    id: 5,
    name: "Artisan Limited",
    description: "Exclusive pieces by master craftsmen",
    image: assetUrl("promo-1.png"),
    link: "/collections/artisan",
  },
  {
    id: 6,
    name: "Signature Classics",
    description: "Our most coveted and iconic designs",
    image: assetUrl("promo-2.png"),
    link: "/collections/signature",
  },
];

const CollectionCard = ({ collection }) => (
  <div
    style={{
      backgroundColor: "transparent",
      cursor: "pointer",
      transition: "transform 0.35s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div
      style={{
        height: "240px",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={collection.image}
        alt={collection.name}
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(5,5,5,0.4) 0%, transparent 60%)",
        }}
      />
    </div>
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: "var(--kernia-obsidian)",
        marginBottom: "0.8rem",
        letterSpacing: "-0.01em",
      }}
    >
      {collection.name}
    </h3>
    <p
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "0.9rem",
        fontWeight: 300,
        color: "rgba(5,5,5,0.65)",
        marginBottom: "1.5rem",
        lineHeight: 1.5,
        letterSpacing: "0.01em",
      }}
    >
      {collection.description}
    </p>
    <Link
      to={collection.link}
      style={{
        fontFamily: "var(--font-data)",
        fontSize: "0.6rem",
        fontWeight: 400,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--kernia-gold)",
        textDecoration: "none",
        borderBottom: "1px solid transparent",
        paddingBottom: "2px",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.borderBottomColor = "var(--kernia-gold)";
      }}
      onMouseLeave={(e) => {
        e.target.style.borderBottomColor = "transparent";
      }}
    >
      Discover Collection
    </Link>
  </div>
);

export default function FeaturedCollections() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(collections.length / itemsPerPage);

  const scrollToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
    if (scrollRef.current) {
      const cardWidth = 280 + 32; // card width + gap
      const scrollPosition = pageIndex * cardWidth * itemsPerPage;
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="collections"
      style={{
        padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)",
        backgroundColor: "var(--kernia-ivory)",
        scrollMarginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "0.65rem",
                fontWeight: 400,
                color: "var(--kernia-gold)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Curated Collections
            </h3>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 400,
                color: "var(--kernia-obsidian)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Stories in Leather
            </h2>
          </div>

          {/* Pagination Dots */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => scrollToPage(index)}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    currentPage === index
                      ? "var(--kernia-obsidian)"
                      : "rgba(5,5,5,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== index) {
                    e.target.style.background = "rgba(5,5,5,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== index) {
                    e.target.style.background = "rgba(5,5,5,0.2)";
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="featured-collections-scroll"
          style={{
            display: "flex",
            gap: "clamp(1rem, 3vw, 2rem)",
            overflowX: "auto",
            paddingBottom: "1rem",
            scrollBehavior: "smooth",
          }}
        >
          {collections.map((collection) => (
            <div
              key={collection.id}
              style={{
                minWidth: "clamp(250px, 30vw, 280px)",
                flex: "0 0 auto",
              }}
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
