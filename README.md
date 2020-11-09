# React Music Visualizer

The intentions of this project is to expose a basic and flexible waveform audio/music visualizer as a modern functional react component. A resizable `<Canvas />` component is also exposed.

## Installation

```
npm install react-music-visualizer --save
```

The library is built using [hooks](https://reactjs.org/docs/hooks-intro.html) so you will need to have `react` and `react-dom` version 16.8 or higher.

## Usage

```
<Visualizer audioPreviewUrl='example.com/audio-url' />
```

### Example

More examples on how to use the component can be found in the repo [example page](example/example.js). You can run the example page locally by first running `npm install` and then `npm run dev`.

## `Visualizer` Props

Prop | Type | Default | Notes
--- | --- | --- | ---
`audioPreviewUrl` | String | null | ---
`canvasWidth` | Number | null | Will resize when viewport is below this number
`canvasHeight` | Number | 540 | ---
`drawFunc` | Function | null | ---
`drawOptions` | Object | _See below_ | ---
`fftSize` | Number | 128 | For an explanation check [MDN](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize)

### Default Drawing Options
Option | Type | Default | Notes
--- | --- | --- | ---
`canvasColor` | String | '#000000' | Background color
`lineColor` | String | '#7200ab' | Color of drawn lines
`lineAmount` | Number | 16 | Amount of lines to sequentially draw
`strokeWidth` | Number | 3 | Width of each line
`strokeTightness` | Number | 5 | Space between each line
`mirrored` | Boolean | true | If visual peak is centered

## `Canvas` Props

Prop | Type | Default | Notes
--- | --- | --- | ---
`height` | Number | null | ---
`maxWidth` | Number | 3840 | ---
`className` | String | null | ---
`...props` | Any | null | Any HTML canvas properties