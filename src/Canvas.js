import React, {useState, useEffect, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {useWindowResize} from './utils/useWindowResize';

export const Canvas = forwardRef(({height, maxWidth = 3840, className, ...props}, ref) => {
  const [canvasWidth, setCanvasWidth] = useState(maxWidth);
  const setWidth = width => setCanvasWidth(Math.min(maxWidth, width))

  const viewportWidth = useWindowResize(currentWidth => setWidth(currentWidth));

  useEffect(() => {
    setWidth(viewportWidth);
  }, []);

  return <canvas
    width={canvasWidth}
    height={height}
    ref={ref}
    className={className}
    {...props} />;
});

Canvas.displayName = 'Canvas';

Canvas.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  maxWidth: PropTypes.number,
};