const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    Index: './src/V2/index.ts',
    Landing: './src/scripts/landing.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: true, // <- remove unused function
  },
  
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['Index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/landing.html',
      filename: 'landing.html',
      chunks: ['Landing'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' }
      ]
    })
  ],
  cache: true,
};
