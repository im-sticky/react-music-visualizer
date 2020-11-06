import {useEffect} from 'react';
import debounce from 'lodash.debounce';

/**
 * Binds a function to window resize event.
 * @param {function} resizeEvent 
 * @param {number}   timing
 */
export function useWindowResize(resizeEvent, timing = 10) {
  const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  useEffect(() => {
    const resizeListener = debounce(() => {
      resizeEvent(getWidth());
    }, timing);

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return getWidth();
}