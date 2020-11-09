const path = require('path');

module.exports = {
  output: {
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  externals: [
    // Every non-relative module is external
    // abc -> require("abc")
    /^[a-z\-0-9]+$/,
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
    ],
  },
};