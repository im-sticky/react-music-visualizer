import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Canvas} from './Canvas';


export const Visualizer = ({audioPreviewUrl, canvasHeight = 480}) => {
  const [audioContext, setAudioContext] = useState();
  const [canvasContext, setCanvasContext] = useState();
  const [audioSource, setAudioSource] = useState();
  const [audioBuffer, setAudioBuffer] = useState();
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
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasContext(canvasRef.current.getContext('2d'));
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (audioContext && audioPreviewUrl) {
      loadPreviewUrl(audioPreviewUrl);
      
      audioAnalyser.current = audioContext.createAnalyser();
      audioAnalyser.current.fftSize = 128;

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

    // remove any 0ed out data nodes
    let filteredData = dataArray.current.filter(x => x > 0);

    canvasContext.fillStyle = '#000000';
    canvasContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasContext.lineWidth = 3;
    canvasContext.strokeStyle = '#7200ab';
    canvasContext.beginPath();

    let sliceWidth = canvasRef.current.width / filteredData.length / 2;
    let x = 0;

    const drawFrequency = (i, drawHeight, drawBottom) => {
      if (filteredData[i] > 0) {
        let frequencyPercent = filteredData[i] / 255;
        let y = frequencyPercent * drawHeight + drawBottom;

        i === 0 ?
          canvasContext.moveTo(x, y) :
          canvasContext.lineTo(x, y);

        x += sliceWidth;
      }
    };

    const drawWholeFrequency = (heightMultiplier) => {
      let drawHeight = canvasRef.current.height //* heightMultiplier;
      let drawBottom = canvasRef.current.height * (1 - heightMultiplier) / 4; // increase number to make tighter

      for (let i = 0; i < filteredData.length; i++) {
        drawFrequency(i, drawHeight, drawBottom);
      }

      for (let i = filteredData.length; i > 0; i--) {
        drawFrequency(i, drawHeight, drawBottom);
      }

      x += sliceWidth;
      canvasContext.lineTo(x, drawHeight + drawBottom);
      x = 0;
    };

    for (let i = 1.05; i > 0.25; i -= 0.05) {
      drawWholeFrequency(i);
    }

    canvasContext.stroke();
  }

  return <Canvas height={canvasHeight} ref={canvasRef} />
};

Visualizer.propTypes = {
  audioPreviewUrl: PropTypes.string,
  canvasHeight: PropTypes.number,
};