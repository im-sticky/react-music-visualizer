import {useEffect} from 'react';
import debounce from 'lodash.debounce';

/**
 * Binds a function to window resize event.
 * @param {function} resizeEvent 
 * @param {number}   timing
 */
export function useWindowResize(resizeEvent, timing = 10) {
  const getWidth = () => document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;

  useEffect(() => {
    const resizeListener = debounce(() => {
      resizeEvent(getWidth());
    }, timing);

    // call once for initial viewport size
    resizeListener();
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return getWidth();
}