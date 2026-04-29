import { useEffect, useRef } from 'react';

/**
 * Attaches a reveal-on-scroll animation to the returned ref.
 * @param {object} options
 * @param {number} options.delay  - animation-delay in ms (default 0)
 * @param {number} options.threshold - intersection threshold 0–1 (default 0.1)
 */
export default function useReveal({ delay = 0, threshold = 0.1 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return ref;
}
