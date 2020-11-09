import React from 'react';
import ReactDOM from 'react-dom';
import {Visualizer} from '../src';

const Main = ({}) => {
  return <section>
    <h1>Visualizer Example</h1>
    <Visualizer audioPreviewUrl='https://p.scdn.co/mp3-preview/0a3d69eb74273a6864abc9c6b80e92defbf1368b?cid=774b29d4f13844c495f206cafdad9c86' />
  </section>;
};

ReactDOM.render(React.createElement(Main), document.querySelector('#app'));