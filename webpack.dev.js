const path = require('path');

module.exports = {
  entry: './example/example.js',
  output: {
    path: path.resolve(__dirname, 'example', 'dist'),
    filename: 'example.js',
    libraryTarget: 'umd'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'example'),
    watchContentBase: true,
    writeToDisk: true,
    port: 9000
  }
};