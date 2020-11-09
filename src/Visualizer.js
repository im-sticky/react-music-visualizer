import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {powerOfTwo} from './utils/powerOfTwo';
import {Canvas} from './Canvas';

const defaultOptions = {
  canvasColor: '#000000',
  lineColor: '#7200ab',
  lineAmount: 16,
  strokeWidth: 3,
  strokeTightness: 5,
  mirrored: true,
};

export const Visualizer = ({audioPreviewUrl, canvasWidth, canvasHeight = 540, drawFunc, drawOptions = {}, fftSize = 128}) => {
  const [audioContext, setAudioContext] = useState();
  const [canvasContext, setCanvasContext] = useState();
  const [audioSource, setAudioSource] = useState();
  const [audioBuffer, setAudioBuffer] = useState();
  const [mergedOptions, setMergedOptions] = useState(defaultOptions);
  const dataArray = useRef();
  const audioAnalyser = useRef();
  const canvasRef = useRef();

  function loadPreviewUrl(url) {
    let request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
      audioContext.decodeAudioData(request.response, buffer => setAudioBuffer(buffer), err => console.error(err));
    }
    request.send();
  }

  useEffect(() => {
    setMergedOptions(Object.assign(mergedOptions, drawOptions));
  }, [drawOptions]);

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasContext(canvasRef.current.getContext('2d'));
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (audioContext && audioPreviewUrl && powerOfTwo(fftSize)) {
      loadPreviewUrl(audioPreviewUrl);
      
      audioAnalyser.current = audioContext.createAnalyser();
      audioAnalyser.current.fftSize = fftSize;

      dataArray.current = new Uint8Array(audioAnalyser.current.frequencyBinCount);
    }
  }, [audioContext, audioPreviewUrl]);

  useEffect(() => {
    if (audioBuffer && audioContext) {
      setAudioSource(audioContext.createBufferSource());
    }
  }, [audioContext, audioBuffer]);

  useEffect(() => {
    if (audioSource) {
      let gainNode = audioContext.createGain();

      gainNode.gain.value = 0;

      audioSource.connect(gainNode);
      gainNode.connect(audioContext.destination);

      audioSource.buffer = audioBuffer;
      audioSource.connect(audioAnalyser.current);
      audioSource.loop = true;
      audioSource.start(0);
      audioContext.resume();

      drawAudioData();
    }
  }, [audioSource]);

  function drawAudioData() {
    requestAnimationFrame(drawAudioData);

    audioAnalyser.current.getByteFrequencyData(dataArray.current);

    if (drawFunc) {
      drawFunc(dataArray.current, audioAnalyser.current, canvasContext, canvasRef.current);
    } else {
      // remove any 0ed out data nodes
      let filteredData = dataArray.current.filter(x => x > 0);
  
      canvasContext.fillStyle = mergedOptions.canvasColor;
      canvasContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasContext.lineWidth = mergedOptions.strokeWidth;
      canvasContext.strokeStyle = mergedOptions.lineColor;
      canvasContext.beginPath();
  
      let sliceWidth = canvasRef.current.width / filteredData.length / (mergedOptions.mirrored ? 2 : 1);
      let x = 0;
  
      const drawFrequency = (i, drawHeight, drawBottom) => {
        let frequencyPercent = filteredData[i] / 255;
        let y = frequencyPercent * drawHeight + drawBottom;

        i === 0 ?
          canvasContext.moveTo(x, y) :
          canvasContext.lineTo(x, y);

        x += sliceWidth;
      };
  
      const drawWholeFrequency = (heightMultiplier) => {
        let drawHeight = canvasRef.current.height //* heightMultiplier;
        let drawBottom = canvasRef.current.height * (1 - heightMultiplier) / mergedOptions.strokeTightness;
  
        for (let i = 0; i < filteredData.length; i++) {
          drawFrequency(i, drawHeight, drawBottom);
        }
  
        if (mergedOptions.mirrored) {
          for (let i = filteredData.length; i > 0; i--) {
            drawFrequency(i, drawHeight, drawBottom);
          }
        }
  
        x += sliceWidth;
        canvasContext.lineTo(x, drawHeight + drawBottom);
        x = 0;
      };
  
      const interval = (1.05 - 0.25) / mergedOptions.lineAmount;
  
      for (let i = 1.05; i > 0.25; i -= interval) {
        drawWholeFrequency(i);
      }
  
      canvasContext.stroke();
    }
  }

  return <Canvas height={canvasHeight} maxWidth={canvasWidth} ref={canvasRef} />
};

Visualizer.propTypes = {
  audioPreviewUrl: PropTypes.string,
  canvasHeight: PropTypes.number,
  canvasWidth: PropTypes.number,
  drawFunc: PropTypes.func,
  drawOptions: PropTypes.object,
  fftSize: (props, propName, componentName) => {
    if (props[propName]) {
      return powerOfTwo(props[propName]) ? null : new Error(`Invalid prop '${propName}' in component '${componentName}' is not a power of 2`);
    }

    return null;
  },
};