const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    Index: './src/index.ts',
    Controller: './src/controller.ts'
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
      template: './src/controller.html',
      filename: 'controller.html',
      chunks: ['Controller'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' }
      ]
    })
  ],
  devServer: {
    compress: true,
    port: 8081,
    historyApiFallback: true,
  },
  cache: true,
};
