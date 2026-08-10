import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Client-side navigation keeps the previous scroll offset, so following a link
 * from halfway down one page lands halfway down the next. Reset on pathname
 * change to match what a browser does on a real navigation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
