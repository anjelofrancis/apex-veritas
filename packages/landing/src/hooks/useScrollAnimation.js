import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optional: unobserve after becoming visible
        if (options.triggerOnce !== false) {
          observer.unobserve(element);
        }
      } else {
        if (options.triggerOnce === false) {
          setIsVisible(false);
        }
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce]);

  // Combine default tailwind classes for the animation state
  // Elements should start with opacity-0 translate-y-8 or similar
  const className = `transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return [ref, isVisible, className];
}
