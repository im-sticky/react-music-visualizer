import React from 'react';
import ReactDOM from 'react-dom';
import {Visualizer} from '../src';

const Main = ({}) => <section>
  <Visualizer
    audioPreviewUrl='https://p.scdn.co/mp3-preview/0a3d69eb74273a6864abc9c6b80e92defbf1368b?cid=774b29d4f13844c495f206cafdad9c86'
    drawOptions={{
      canvasColor: 'rgb(21, 16, 25)',
      lineColor: 'rgb(136, 200, 255)',
      lineAmount: 4,
      strokeWidth: 2,
    }} />

  <Visualizer
    audioPreviewUrl='https://p.scdn.co/mp3-preview/0a3d69eb74273a6864abc9c6b80e92defbf1368b?cid=774b29d4f13844c495f206cafdad9c86'
    canvasWidth={512}
    canvasHeight={51}
    fftSize={256}
    drawFunc={(dataArray, audioAnalyser, canvasContext, canvasElement) => {
      canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasContext.fillStyle = '#CC5500';

      let freqDrawWidth = Math.floor(canvasElement.width / audioAnalyser.fftSize) || 1;

	    for (let i = 0; i < dataArray.length; i++) {
        let freqDrawHeight = Math.floor(dataArray[i] / 255 * canvasElement.height); 
        
        canvasContext.fillRect(canvasElement.width / 2 + freqDrawWidth / 2 + i * freqDrawWidth, canvasElement.height, freqDrawWidth, -freqDrawHeight);
        canvasContext.fillRect(canvasElement.width / 2 - freqDrawWidth / 2 - i * freqDrawWidth, canvasElement.height, freqDrawWidth, -freqDrawHeight);
	    }
    }} />
</section>;

ReactDOM.render(React.createElement(Main), document.querySelector('#app'));