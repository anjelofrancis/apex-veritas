import { useState, useEffect, useRef } from 'react';

export function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const endVal = parseInt(end, 10);
    const startVal = parseInt(start, 10);
    
    if (isNaN(endVal)) return;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeProgress * (endVal - startVal) + startVal));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration, start]);

  return [ref, count];
}
