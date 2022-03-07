const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: path.resolve(process.cwd(), './app.js'),
  output: {
    path: path.resolve(process.cwd(), './demoDist'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {},
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
